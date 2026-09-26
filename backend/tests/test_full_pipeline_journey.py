import os
import time

import pytest

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "fixtures")


def test_full_document_pipeline_e2e(client, auth_session):
    headers = auth_session["headers"]

    # 1. Upload document
    doc_path = os.path.join(FIXTURES_DIR, "01_clean_rental_agreement.pdf")
    with open(doc_path, "rb") as f:
        up_res = client.post(
            "/api/v1/documents",
            headers=headers,
            files={"file": ("agreement.pdf", f, "application/pdf")},
            data={"situation_context": "Landlord asking for excessive hike."},
        )
    assert up_res.status_code == 201
    doc_id = up_res.json()["document_id"]

    # 2. Trigger analyze -> returns 202 with job
    an_res = client.post(f"/api/v1/documents/{doc_id}/analyze", headers=headers, json={"language": "en"})
    assert an_res.status_code == 202
    job_data = an_res.json()
    assert job_data["status"] == "processing"
    assert "stage" in job_data

    # 3. Poll analysis endpoint
    analysis_data = None
    for _ in range(30):
        poll_res = client.get(f"/api/v1/documents/{doc_id}/analysis", headers=headers)
        if poll_res.status_code == 200:
            analysis_data = poll_res.json()
            break
        elif poll_res.status_code == 425:
            # Still processing
            time.sleep(0.1)
        else:
            pytest.fail(f"Unexpected status: {poll_res.status_code}, content: {poll_res.text}")

    assert analysis_data is not None
    assert "summary" in analysis_data
    assert "urgency" in analysis_data
    assert "source_metadata" in analysis_data

    # 4. The API surface advertises no capability it cannot serve. Export was
    #    removed rather than left answering 501, so the route must now be
    #    absent — not present-but-unimplemented.
    exp_res = client.post(f"/api/v1/documents/{doc_id}/export", headers=headers)
    assert exp_res.status_code == 404
    assert exp_res.status_code != 501


def test_situation_intake_and_analyze_e2e(client, auth_session):
    headers = auth_session["headers"]

    # 1. Create situation
    sit_res = client.post(
        "/api/v1/situations",
        headers=headers,
        json={"description": "Landlord has not returned my 50,000 security deposit after 45 days.", "language": "en"},
    )
    assert sit_res.status_code == 201
    sit_data = sit_res.json()
    assert "situation_id" in sit_data
    assert len(sit_data["clarifying_questions"]) > 0
    sit_id = sit_data["situation_id"]

    # 2. Submit answers and analyze
    ans_res = client.post(
        f"/api/v1/situations/{sit_id}/analyze",
        headers=headers,
        json={
            "answers": [
                {"question_id": "q1", "answer": "Yes, we had an agreement for 11 months."},
                {"question_id": "q3", "answer": "Security deposit was Rs. 50,000 paid by bank transfer."},
            ]
        },
    )
    assert ans_res.status_code == 200
    res_data = ans_res.json()
    assert "characterization" in res_data
    assert "what_we_know" in res_data
    assert "what_is_missing" in res_data
    assert "possible_next_steps" in res_data
    # Asymmetry check: MUST NOT contain obligations, deadlines, or money items
    assert "obligations" not in res_data
    assert "deadlines" not in res_data
    assert "money_items" not in res_data
