import uuid

from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.errors import SamjoError
from backend.app.core.ratelimit import rate_limiter
from backend.app.core.security import session_serializer, validate_csrf_header
from backend.app.models.base import get_db
from backend.app.models.entities import SessionModel

SESSION_COOKIE_NAME = "samjo_session"


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"


async def get_current_session(
    request: Request,
    db: Session = Depends(get_db),
) -> SessionModel:
    """
    Validates the session cookie and ensures the session exists and is active.
    If CSRF header is required (non-GET), validates it.
    """
    # 1. CSRF header check on mutating methods
    if request.method not in ("GET", "HEAD", "OPTIONS"):
        csrf_val = request.headers.get("x-samjo-session")
        validate_csrf_header(csrf_val)

    # 2. Extract cookie
    cookie_token = request.cookies.get(SESSION_COOKIE_NAME)
    if not cookie_token:
        raise SamjoError.unauthorized("Session cookie is missing.")

    session_id_str = session_serializer.verify_session_token(cookie_token)
    if not session_id_str:
        raise SamjoError.unauthorized("Invalid or expired session token.")

    try:
        session_uuid = uuid.UUID(session_id_str)
    except ValueError:
        raise SamjoError.unauthorized("Malformed session identifier.")

    stmt = select(SessionModel).where(SessionModel.id == session_uuid)
    session_obj = db.execute(stmt).scalar_one_or_none()
    if not session_obj:
        raise SamjoError.unauthorized("Session does not exist.")

    return session_obj


def check_rate_limit(route_type: str):
    """
    Returns a dependency enforcing hourly rate limits per session AND per IP.
    """
    async def _rate_limit_checker(
        request: Request,
        session: SessionModel = Depends(get_current_session),
    ):
        ip = get_client_ip(request)
        rate_limiter.check_rate_limit(
            session_id=session.id,
            ip_address=ip,
            route=route_type,
        )
    return _rate_limit_checker
