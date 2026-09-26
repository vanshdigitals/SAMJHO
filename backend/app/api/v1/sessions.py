import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from backend.app.api.deps import SESSION_COOKIE_NAME, get_client_ip
from backend.app.core.config import settings
from backend.app.core.ratelimit import rate_limiter
from backend.app.core.security import session_serializer
from backend.app.models.base import get_db
from backend.app.models.entities import AuditEventModel, SessionModel
from backend.app.schemas.api import SessionCreateRequest, SessionResponse

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("", response_model=SessionResponse, status_code=201)
async def create_session(
    request: Request,
    response: Response,
    body: SessionCreateRequest = SessionCreateRequest(),
    db: Session = Depends(get_db),
):
    # Enforce IP rate limit on session creation (20/h/IP)
    client_ip = get_client_ip(request)
    dummy_uuid = uuid.uuid4()
    rate_limiter.check_rate_limit(dummy_uuid, client_ip, "sessions")

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=settings.SESSION_TTL_HOURS)
    session_id = uuid.uuid4()

    # Save to database
    db_session = SessionModel(
        id=session_id,
        language_pref=body.language,
        created_at=now,
        updated_at=now,
        expires_at=expires_at,
    )
    db.add(db_session)

    audit = AuditEventModel(
        id=uuid.uuid4(),
        session_id=session_id,
        event_type="session_created",
        created_at=now,
    )
    db.add(audit)
    db.commit()

    # Generate signed token
    token = session_serializer.generate_session_token(str(session_id))

    # Determine if running over HTTPS (directly, via proxy, or in production)
    forwarded_proto = request.headers.get("x-forwarded-proto", "").lower()
    is_https = (
        settings.APP_ENV == "production"
        or request.url.scheme == "https"
        or forwarded_proto == "https"
        or request.headers.get("origin", "").startswith("https://")
    )

    # Set httpOnly Secure partitioned cookie for cross-origin production support
    # RFC 6265bis: cross-site fetch requires SameSite=None and Secure.
    # Partitioned (CHIPS) ensures modern browsers do not drop cross-site cookies.
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=settings.SESSION_TTL_HOURS * 3600,
        httponly=True,
        samesite="none" if is_https else "lax",
        secure=is_https,
        partitioned=is_https,
        path="/",
    )

    return SessionResponse(
        session_id=str(session_id),
        expires_at=expires_at,
    )
