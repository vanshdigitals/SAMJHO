import base64
import hashlib

from cryptography.fernet import Fernet
from fastapi import Request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from .config import settings
from .errors import SamjoError


def _get_fernet() -> Fernet:
    key = settings.ENCRYPTION_KEY
    try:
        # Check if valid Fernet key (32 url-safe base64-encoded bytes)
        return Fernet(key.encode("utf-8") if isinstance(key, str) else key)
    except Exception:
        # For dev/test if key wasn't generated via Fernet.generate_key(),
        # derive a 32-byte urlsafe base64 key deterministically from the string.
        derived = base64.urlsafe_b64encode(hashlib.sha256(key.encode("utf-8")).digest())
        return Fernet(derived)


_fernet_instance = _get_fernet()
_serializer_instance = URLSafeTimedSerializer(settings.SESSION_SIGNING_KEY)


def encrypt_bytes(raw: bytes) -> bytes:
    """Encrypt raw bytes using Fernet."""
    return _fernet_instance.encrypt(raw)


def decrypt_bytes(encrypted: bytes) -> bytes:
    """Decrypt encrypted bytes using Fernet."""
    return _fernet_instance.decrypt(encrypted)


def encrypt_data(data: str) -> bytes:
    return encrypt_bytes(data.encode("utf-8"))


def decrypt_data(encrypted: bytes) -> str:
    return decrypt_bytes(encrypted).decode("utf-8")


class SessionSerializer:
    def generate_session_token(self, session_id: str) -> str:
        return _serializer_instance.dumps({"sid": session_id})

    def verify_session_token(self, token: str) -> str | None:
        max_age_seconds = settings.SESSION_TTL_HOURS * 3600
        try:
            data = _serializer_instance.loads(token, max_age=max_age_seconds)
            return data.get("sid")
        except (BadSignature, SignatureExpired, Exception):
            return None


session_serializer = SessionSerializer()


def sign_session_id(session_id: str) -> str:
    return session_serializer.generate_session_token(session_id)


def verify_session_token(token: str) -> str:
    sid = session_serializer.verify_session_token(token)
    if not sid:
        raise SamjoError.unauthorized("Invalid or expired session token.")
    return sid


def validate_csrf_header(header_value: str | None) -> None:
    """Enforce X-Samjo-Session: 1 on state-changing requests."""
    if not header_value or header_value.strip() != "1":
        raise SamjoError.csrf_error("Missing or invalid X-Samjo-Session: 1 header.")


def enforce_csrf(request: Request) -> None:
    if request.method in ("GET", "HEAD", "OPTIONS"):
        return
    if request.url.path.endswith("/sessions") and request.method == "POST":
        return
    csrf_val = request.headers.get("X-Samjo-Session")
    validate_csrf_header(csrf_val)
