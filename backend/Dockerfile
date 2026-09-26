# SAMJO backend — OPTIONAL container image.
#
# The deployed service uses Render's NATIVE PYTHON runtime (see render.yaml).
# Docker is not required to develop, test or deploy SAMJO, and nothing in the
# repository builds this file automatically.
#
# It exists for one reason: native runtimes cannot install system packages, so
# OCR has no engine there. Scans and photos fail with the typed
# OCR_UNAVAILABLE error instead of returning a wrong answer. If OCR in
# production becomes necessary, switch render.yaml back to `runtime: docker`
# and this image supplies Tesseract with the eng and hin language data.
#
# Build from the REPOSITORY ROOT, not from backend/:
#   docker build -f backend/Dockerfile -t samjo-backend .
#
# The application imports itself as `backend.app.*`, so the `backend` package
# has to exist under the workdir. Copying the contents of backend/ into /app
# would put it at /app/app and `uvicorn backend.app.main:app` would not resolve.
FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive \
    PORT=8000

# Tesseract is an apt package, not a pip one. This is the reason the backend
# cannot run on a serverless host (RESOURCE_AUDIT §12.3).
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-hin \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# The package, its migrations, and the Alembic config the release step needs.
COPY backend/ ./backend/
COPY alembic.ini ./alembic.ini

# Uploads are written here and deleted as soon as extraction finishes, so the
# directory only ever holds in-flight files. It is never served.
RUN mkdir -p /app/var/uploads

RUN useradd -m -u 1000 samjo && chown -R samjo:samjo /app
USER samjo

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -fsS "http://127.0.0.1:${PORT}/api/v1/health" || exit 1

# Render supplies $PORT. Migrations run in the release command, not here, so a
# restarting instance never races another one to migrate the same database.
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT}"]
