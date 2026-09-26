import time
import uuid
from collections import defaultdict

from .config import settings
from .errors import SamjoError


class InMemoryRateLimiter:
    """
    In-memory rate limiter enforcing per-session AND per-IP quotas (RESOURCE_AUDIT §21):
    - sessions: 20/h/IP
    - uploads: 10/h
    - analyses: 15/h
    - situations: 10/h
    - reads: 600/h (polling headroom, see note below)
    - deletes: 30/h
    - concurrency: max 1 per session, max 3 per process
    """

    ROUTE_LIMITS = {
        "sessions": 20,
        "uploads": settings.RATE_LIMIT_UPLOADS_PER_HOUR,
        "analyses": settings.RATE_LIMIT_ANALYSES_PER_HOUR,
        "situations": settings.RATE_LIMIT_SITUATIONS_PER_HOUR,
        # RESOURCE_AUDIT §21 lists 120/h but also states the rule that governs
        # it: "polling at 1.5s = 40/min; do not throttle legitimate polling".
        # Those two cannot both hold — a single 60-second analysis spends ~40
        # reads, so 120/h throttles the third honest document of the hour.
        # Reads are cheap; the cost centre is analyses, capped at 15/h, and
        # that cap is what actually bounds spend.
        "reads": 600,
        "deletes": 30,
    }

    def __init__(self):
        # Maps (route, key) -> list of timestamps
        self._history: dict[tuple[str, str], list[float]] = defaultdict(list)
        # Concurrency tracking
        self._active_analyses_by_session: dict[str, int] = defaultdict(int)
        self._total_active_analyses: int = 0

    def _cleanup_old(self, key: tuple[str, str], window_seconds: float, now: float) -> None:
        cutoff = now - window_seconds
        self._history[key] = [t for t in self._history[key] if t > cutoff]

    def check_rate_limit(
        self,
        session_id: str | uuid.UUID | None,
        ip_address: str | None,
        route: str,
    ) -> None:
        now = time.time()
        window = 3600.0
        limit = self.ROUTE_LIMITS.get(route, 60)

        # Check IP quota
        if ip_address:
            ip_key = (f"{route}:ip", ip_address)
            self._cleanup_old(ip_key, window, now)
            if len(self._history[ip_key]) >= limit:
                raise SamjoError.rate_limited(
                    f"Too many {route} requests from this IP. Please try again later."
                )
            self._history[ip_key].append(now)

        # Check Session quota
        if session_id:
            sid_str = str(session_id)
            sess_key = (f"{route}:session", sid_str)
            self._cleanup_old(sess_key, window, now)
            if len(self._history[sess_key]) >= limit:
                raise SamjoError.rate_limited(
                    f"Too many {route} requests for this session. Please try again later."
                )
            self._history[sess_key].append(now)

    async def acquire_concurrency(self, session_id: str | uuid.UUID) -> None:
        sid_str = str(session_id)
        if self._active_analyses_by_session[sid_str] >= 1:
            raise SamjoError.rate_limited(
                "An analysis is already running for this session. Please wait for it to complete."
            )
        if self._total_active_analyses >= 3:
            raise SamjoError.rate_limited(
                "Server is currently processing maximum concurrent analyses. Please try again in a few moments."
            )
        self._active_analyses_by_session[sid_str] += 1
        self._total_active_analyses += 1

    def release_concurrency(self, session_id: str | uuid.UUID) -> None:
        sid_str = str(session_id)
        if self._active_analyses_by_session[sid_str] > 0:
            self._active_analyses_by_session[sid_str] -= 1
        if self._total_active_analyses > 0:
            self._total_active_analyses -= 1


rate_limiter = InMemoryRateLimiter()
limiter = rate_limiter
