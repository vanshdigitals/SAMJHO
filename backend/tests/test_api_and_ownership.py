import os

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "fixtures")


def test_health_check(client):
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert "llm_provider" in data


def test_ownership_and_404_enforcement(client, auth_session):
    # Create second session
    resp2 = client.post("/api/v1/sessions", json={"language": "en"})
    cookie2 = resp2.cookies.get("samjo_session")
    headers2 = {"X-Samjo-Session": "1", "Cookie": f"samjo_session={cookie2}"}

    # Upload document with Session 1
    doc_path = os.path.join(FIXTURES_DIR, "01_clean_rental_agreement.pdf")
    with open(doc_path, "rb") as f:
        upload_resp = client.post(
            "/api/v1/documents",
            headers=auth_session["headers"],
            files={"file": ("agreement.pdf", f, "application/pdf")},
        )
    assert upload_resp.status_code == 201
    doc_id = upload_resp.json()["document_id"]

    # Session 2 attempts to read Session 1's document: MUST RETURN 404 (NEVER 403)
    resp_cross = client.get(f"/api/v1/documents/{doc_id}", headers=headers2)
    assert resp_cross.status_code == 404
    assert resp_cross.json()["error_code"] == "NOT_FOUND"

    # Session 1 successfully deletes document
    del_resp = client.delete(f"/api/v1/documents/{doc_id}", headers=auth_session["headers"])
    assert del_resp.status_code == 204

    # Subsequent read by Session 1 is 404
    read_again = client.get(f"/api/v1/documents/{doc_id}", headers=auth_session["headers"])
    assert read_again.status_code == 404


def test_session_cookie_security_and_no_bearer_fallback(client, auth_session):
    from fastapi.testclient import TestClient

    from backend.app.main import app

    fresh_client = TestClient(app)

    # 1. No cookie -> 401 UNAUTHORIZED
    resp_no_cookie = fresh_client.get("/api/v1/documents/00000000-0000-0000-0000-000000000001")
    assert resp_no_cookie.status_code == 401
    assert resp_no_cookie.json()["error_code"] == "UNAUTHORIZED"
    assert "Session cookie is missing" in resp_no_cookie.json()["message"]

    # 2. Bearer header alone -> MUST BE REJECTED (no fallback allowed)
    cookie_val = auth_session["cookie"]
    resp_bearer = fresh_client.get(
        "/api/v1/documents/00000000-0000-0000-0000-000000000001",
        headers={"Authorization": f"Bearer {cookie_val}"},
    )
    assert resp_bearer.status_code == 401
    assert resp_bearer.json()["error_code"] == "UNAUTHORIZED"

    # 3. Mutating request without CSRF header -> 403 CSRF_ERROR
    resp_no_csrf = fresh_client.post(
        "/api/v1/documents",
        headers={"Cookie": f"samjo_session={cookie_val}"},
    )
    assert resp_no_csrf.status_code == 403
    assert resp_no_csrf.json()["error_code"] == "CSRF_ERROR"


def test_cross_origin_session_cookie_policy(client):
    """
    Verifies that:
    1. Local HTTP requests get SameSite=Lax (safe for local development without TLS).
    2. Cross-origin / HTTPS / Render proxy requests get SameSite=None, Secure, and Partitioned
       to comply with RFC 6265bis and browser cross-origin cookie mandates.
    """
    # 1. Local HTTP request
    resp_local = client.post("/api/v1/sessions", json={"language": "en"})
    assert resp_local.status_code == 201
    set_cookie_local = resp_local.headers.get("set-cookie", "")
    assert "samjo_session=" in set_cookie_local
    assert "httponly" in set_cookie_local.lower()
    assert "samesite=lax" in set_cookie_local.lower()
    assert "secure" not in set_cookie_local.lower()

    # 2. Render reverse proxy HTTPS request (x-forwarded-proto: https)
    resp_proxy = client.post(
        "/api/v1/sessions",
        headers={
            "X-Forwarded-Proto": "https",
            "Origin": "https://samjho-legal-ai.vercel.app",
            "X-Samjo-Session": "1",
        },
        json={"language": "en"},
    )
    assert resp_proxy.status_code == 201
    set_cookie_proxy = resp_proxy.headers.get("set-cookie", "")
    assert "samjo_session=" in set_cookie_proxy
    assert "HttpOnly" in set_cookie_proxy
    assert "samesite=none" in set_cookie_proxy.lower()
    assert "secure" in set_cookie_proxy.lower()
    assert "partitioned" in set_cookie_proxy.lower()


def test_cors_preflight_allows_patch(client):
    """Verifies that CORS preflight permits PATCH and custom headers."""
    resp = client.options(
        "/api/v1/documents/00000000-0000-0000-0000-000000000001/text",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "PATCH",
            "Access-Control-Request-Headers": "x-samjo-session,content-type",
        },
    )
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-credentials") == "true"
    allowed_methods = resp.headers.get("access-control-allow-methods", "")
    assert "PATCH" in allowed_methods



