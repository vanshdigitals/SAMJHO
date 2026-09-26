import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.v1 import api_v1_router
from backend.app.core.config import settings
from backend.app.core.errors import SamjoError
from backend.app.core.logging import get_logger, setup_root_logger
from backend.app.models.base import Base, SessionLocal, engine
from backend.app.services.extraction_service import extraction_service
from backend.app.services.ocr_service import ocr_service
from backend.app.services.reaper_service import reaper_service

# Setup allowlist logger
setup_root_logger(settings.LOG_LEVEL)
logger = get_logger("samjo.main")


REAPER_INTERVAL_SECONDS = 300
"""How often the reaper sweeps.

Retention is measured in hours — 24 for documents, 72 for sessions — and the
stuck-job threshold is 120 seconds, so a five-minute cadence detects both well
inside the windows they govern. A 30-second loop cost six queries a minute
against the database forever, roughly 17,000 a day on an idle instance, to
notice expiry that is bounded in hours. Deletion the reader asks for is
immediate and does not wait for this loop (API.md, DELETE /documents/{id}).
"""


async def periodic_reaper_task():
    """Sweeps every REAPER_INTERVAL_SECONDS: fails stuck jobs >120s, purges TTLs."""
    while True:
        try:
            await asyncio.sleep(REAPER_INTERVAL_SECONDS)
            db = SessionLocal()
            try:
                reaper_service.reap_stuck_jobs(db)
                reaper_service.purge_expired_documents(db)
                reaper_service.purge_expired_sessions(db)
            finally:
                db.close()
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.warning(
                "Periodic reaper iteration error",
                extra={"extra_data": {"event": "reaper_loop_error", "error": type(e).__name__}},
            )


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Application starting up", extra={"extra_data": {"event": "startup"}})
    settings.validate_production_invariants()

    # Schema comes from Alembic in production. create_all() would happily
    # build tables that no migration describes, so the deployed database
    # would drift from the migration history without anyone noticing — and
    # the first migration to run against it would then fail. Development and
    # tests keep the convenience because their database is disposable.
    if settings.APP_ENV == "production":
        logger.info(
            "Skipping create_all; schema is owned by Alembic",
            extra={"extra_data": {"event": "schema_managed_by_alembic"}},
        )
    else:
        Base.metadata.create_all(bind=engine)

    # Clean orphaned uploads
    extraction_service.cleanup_orphaned_uploads()

    # Check OCR engine capabilities
    ocr_caps = ocr_service.check_capabilities()
    if ocr_caps["available"]:
        logger.info(
            "OCR engine ready",
            extra={
                "extra_data": {
                    "event": "ocr_startup_ready",
                    "version": ocr_caps.get("version"),
                    "languages": ocr_caps.get("languages"),
                    "tesseract_cmd": ocr_caps.get("tesseract_cmd"),
                }
            },
        )
    else:
        logger.warning(
            "OCR engine unavailable",
            extra={
                "extra_data": {
                    "event": "ocr_startup_unavailable",
                    "error": ocr_caps.get("error"),
                }
            },
        )

    # Launch background reaper task
    reaper_task = asyncio.create_task(periodic_reaper_task())

    yield

    # Shutdown
    logger.info("Application shutting down", extra={"extra_data": {"event": "shutdown"}})
    reaper_task.cancel()
    try:
        await reaper_task
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title="SAMJO API",
    description="India-first legal-information orientation backend for residential rental agreements.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_ENV != "production" else None,
    redoc_url=None,
)

# 1. GZip Compression Middleware (compresses responses >= 500 bytes for clients requesting gzip)
app.add_middleware(GZipMiddleware, minimum_size=500)

# 2. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# 3. Security Headers Middleware
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    # Enforce request body size limits
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            length = int(content_length)
            if length > settings.MAX_UPLOAD_BYTES:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={
                        "error_code": "FILE_TOO_LARGE",
                        "message": "File exceeds the 10 MB limit.",
                    },
                )
        except ValueError:
            pass

    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none';"
    return response


# 3. Exception Handlers
@app.exception_handler(SamjoError)
async def samjo_error_handler(request: Request, exc: SamjoError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": exc.code,
            "message": exc.message,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error_code": "VALIDATION_ERROR",
            "message": "The request contained invalid parameters.",
        },
    )


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    logger.error(
        "Unhandled server error",
        extra={"extra_data": {"event": "unhandled_error", "error_type": type(exc).__name__}},
    )
    # NEVER expose internal tracebacks to users
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred. Please try again.",
        },
    )


# 4. Include Routers
app.include_router(api_v1_router, prefix="/api/v1")
# Also alias /health at root for cloud health checkers
app.include_router(api_v1_router)
