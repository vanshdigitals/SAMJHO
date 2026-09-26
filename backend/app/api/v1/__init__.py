from fastapi import APIRouter

from backend.app.api.v1.analysis import router as analysis_router
from backend.app.api.v1.documents import router as documents_router
from backend.app.api.v1.exports import router as exports_router
from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.sessions import router as sessions_router
from backend.app.api.v1.situations import router as situations_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router)
api_v1_router.include_router(sessions_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(analysis_router)
api_v1_router.include_router(situations_router)
api_v1_router.include_router(exports_router)
