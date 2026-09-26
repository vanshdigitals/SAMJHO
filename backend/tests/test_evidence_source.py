import os
import time
import uuid

import pytest

from backend.app.schemas.ai import (
    AnalysisResponse,
    Obligation,
    Risk,
    SourceSpan,
    Urgency,
    UrgencyAssessment,
)
from backend.app.services.analysis_service import analysis_service
from backend.app.services.deterministic_service import DeterministicFacts
from backend.app.services.evidence_service import evidence_service

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "fixtures")


def _upload_and_analyze_fixture(client, headers) -> tuple[str, dict]:
    doc_path = os.path.join(FIXTURES_DIR, "01_clean_rental_agreement.pdf")
    with open(doc_path, "rb") as f:
        up_res = client.post(
            "/api/v1/documents",
            headers=headers,
            files={"file": ("agreement.pdf", f, "application/pdf")},
            data={"situation_context": "Tenancy check"},
        )
    assert up_res.status_code == 201
    doc_id = up_res.json()["document_id"]

    an_res = client.post(f"/api/v1/documents/{doc_id}/analyze", headers=headers, json={"language": "en"})
    assert an_res.status_code == 202

    analysis_data = None
    for _ in range(30):
        poll_res = client.get(f"/api/v1/documents/{doc_id}/analysis", headers=headers)
        if poll_res.status_code == 200:
            analysis_data = poll_res.json()
            break
        elif poll_res.status_code == 425:
            time.sleep(0.1)
        else:
            pytest.fail(f"Unexpected status: {poll_res.status_code}, content: {poll_res.text}")

    assert analysis_data is not None
    return doc_id, analysis_data


def test_valid_source_span_retrieval(client, auth_session):
    headers = auth_session["headers"]
    doc_id, analysis_data = _upload_and_analyze_fixture(client, headers)

    # 1. Collect all verified source_ids from obligations, risks, money_items, deadlines
    source_ids = []
    for category in ["obligations", "risks", "money_items", "deadlines"]:
        for item in analysis_data.get(category, []):
            span = item.get("what_document_says")
            if span and span.get("verified"):
                sid = span.get("source_id")
                assert sid is not None, f"Item {item.get('id')} has verified span without source_id"
                # Validate it parses as UUID
                uuid.UUID(sid)
                source_ids.append(sid)

    assert len(source_ids) > 0, "Expected at least one verified source span in analysis payload"

    # 2. Call GET /documents/{doc_id}/source/{source_id} for a valid source span
    target_source_id = source_ids[0]
    resp = client.get(f"/api/v1/documents/{doc_id}/source/{target_source_id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()

    assert data["source_id"] == target_source_id
    assert "quoted_text" in data and len(data["quoted_text"]) > 0
    assert "page" in data and data["page"] >= 1
    assert data["verified"] is True
    assert "context_before" in data
    assert "context_after" in data
    assert len(data["context_before"]) <= 150
    assert len(data["context_after"]) <= 150


def test_missing_source_id_returns_404(client, auth_session):
    headers = auth_session["headers"]
    doc_id, _ = _upload_and_analyze_fixture(client, headers)

    random_source_id = str(uuid.uuid4())
    resp = client.get(f"/api/v1/documents/{doc_id}/source/{random_source_id}", headers=headers)
    assert resp.status_code == 404
    err = resp.json()
    assert err["error_code"] == "NOT_FOUND"


def test_invalid_source_id_string_returns_404(client, auth_session):
    headers = auth_session["headers"]
    doc_id, _ = _upload_and_analyze_fixture(client, headers)

    # Malformed / non-UUID strings must return 404 NOT_FOUND (not 422 or 500)
    for bad_id in ["invalid-source-id", "12345", "not_a_uuid", "00000000-0000-0000-0000-00000000000z"]:
        resp = client.get(f"/api/v1/documents/{doc_id}/source/{bad_id}", headers=headers)
        assert resp.status_code == 404
        err = resp.json()
        assert err["error_code"] == "NOT_FOUND"


def test_deleted_document_source_span_returns_404(client, auth_session):
    headers = auth_session["headers"]
    doc_id, analysis_data = _upload_and_analyze_fixture(client, headers)

    # Find a valid source_id
    first_item = analysis_data["obligations"][0]
    target_source_id = first_item["what_document_says"]["source_id"]

    # Delete the document
    del_res = client.delete(f"/api/v1/documents/{doc_id}", headers=headers)
    assert del_res.status_code in (200, 204)

    # Accessing source of deleted document must return 404
    resp = client.get(f"/api/v1/documents/{doc_id}/source/{target_source_id}", headers=headers)
    assert resp.status_code == 404
    err = resp.json()
    assert err["error_code"] == "NOT_FOUND"


def test_unverified_claim_is_dropped_and_counter_accurate():
    doc_text = "The Tenant shall pay monthly rent of Rs. 15,000 on or before the 5th day of every month."

    class MockDoc:
        ocr_used = False
        ocr_confidence = None

    class MockExtraction:
        char_count = len(doc_text)

    # Create analysis with 1 valid quote and 2 fabricated quotes
    analysis = AnalysisResponse(
        document_id="test-doc",
        summary="Test summary",
        urgency=UrgencyAssessment(level=Urgency.LOW, reason="Standard agreement"),
        obligations=[
            Obligation(
                id="ob-valid",
                title="Pay rent",
                ai_interpretation="You must pay rent each month.",
                what_document_says=SourceSpan(
                    quoted_text="The Tenant shall pay monthly rent of Rs. 15,000 on or before the 5th day",
                    page=1,
                ),
            ),
            Obligation(
                id="ob-fake",
                title="Pay penalty",
                ai_interpretation="You must pay Rs. 50,000 penalty immediately.",
                what_document_says=SourceSpan(
                    quoted_text="Tenant shall pay Rs. 50,000 penalty without notice.",
                    page=1,
                ),
            ),
        ],
        risks=[
            Risk(
                id="rk-fake",
                title="Eviction clause",
                ai_interpretation="Immediate eviction without notice.",
                what_document_says=SourceSpan(
                    quoted_text="The landlord may evict immediately with zero court order.",
                    page=1,
                ),
            )
        ],
    )

    verified = analysis_service._run_verification_gates(
        analysis=analysis,
        document_text=doc_text,
        pages_meta=[{"page_number": 1, "char_start": 0, "char_end": len(doc_text)}],
        facts=DeterministicFacts(),
        doc=MockDoc(),
        extraction=MockExtraction(),
    )

    # Both fake claims must be dropped
    assert len(verified.obligations) == 1
    assert verified.obligations[0].id == "ob-valid"
    assert verified.obligations[0].what_document_says.verified is True
    assert verified.obligations[0].what_document_says.source_id is not None

    assert len(verified.risks) == 0

    # dropped_item_count must accurately record 2 dropped items
    assert verified.source_metadata.dropped_item_count == 2


def test_evidence_service_strictly_no_fuzzy_matching():
    doc_text = "The Lessee shall not sublet or assign the leased premises."

    # Gate 1: Exact match
    ok, span = evidence_service.verify_span(
        "sublet or assign the leased premises",
        doc_text,
    )
    assert ok is True
    assert span is not None
    assert span.verified is True
    assert span.source_id is not None

    # Gate 2: Normalised match (quotes/whitespace differences)
    ok, span = evidence_service.verify_span(
        "The   Lessee   shall   not   sublet",
        doc_text,
    )
    assert ok is True
    assert span is not None
    assert span.verified is True

    # Gate 3: Fuzzy / paraphrased matching is strictly rejected
    ok, span = evidence_service.verify_span(
        "The tenant is not permitted to sublease the apartment",
        doc_text,
    )
    assert ok is False
    assert span is None

    # Typo / missing words is rejected
    ok, span = evidence_service.verify_span(
        "The Lessse shll not sublt",
        doc_text,
    )
    assert ok is False
    assert span is None
