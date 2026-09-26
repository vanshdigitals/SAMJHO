import os
import sys

# Add workspace root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pytest
from fastapi.testclient import TestClient

# Set test environment
os.environ["APP_ENV"] = "test"
os.environ["LLM_PROVIDER"] = "mock"
os.environ["DATABASE_URL"] = "sqlite:///./test_samjo.db"

from backend.app.core.ratelimit import rate_limiter
from backend.app.main import app
from backend.app.models.base import Base, engine

# Create test tables
Base.metadata.create_all(bind=engine)


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Give every test a fresh limiter.

    `rate_limiter` is a module-level singleton, which is correct for the
    product — one process, one set of counters. In the suite it means the
    counters accumulate across tests: uploads are capped at 10/hour, the suite
    performs more than ten, and every test after the tenth was failing with
    429 instead of 201.

    Resetting the state here fixes the isolation, not the limit. Production
    thresholds are untouched, and the tests that assert throttling still
    exercise the real counters within their own test.
    """
    rate_limiter._history.clear()
    rate_limiter._active_analyses_by_session.clear()
    rate_limiter._total_active_analyses = 0
    yield
    # Cleared again on the way out so a test that leaks a concurrency slot
    # cannot strand the next one behind "an analysis is already running".
    rate_limiter._history.clear()
    rate_limiter._active_analyses_by_session.clear()
    rate_limiter._total_active_analyses = 0


@pytest.fixture
def auth_session(client):
    """Creates a new session and returns cookie and CSRF headers."""
    resp = client.post("/api/v1/sessions", json={"language": "en"})
    assert resp.status_code == 201
    data = resp.json()
    cookie = resp.cookies.get("samjo_session")
    headers = {
        "X-Samjo-Session": "1",
        "Cookie": f"samjo_session={cookie}",
    }
    return {
        "session_id": data["session_id"],
        "cookie": cookie,
        "headers": headers,
    }
