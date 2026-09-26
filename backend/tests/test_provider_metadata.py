"""`source_metadata.model_version` must name the provider that actually ran.

DATABASE.md keeps the field for reproducibility. It used to be read from
`settings.LLM_MODEL`, so a run served by the mock provider — or by the
fallback after a primary outage — still reported the configured Gemini model.
A reproducibility field that reports something other than what produced the
output cannot reproduce anything.
"""

from backend.app.services.llm.claude import ClaudeProvider
from backend.app.services.llm.gemini import GeminiProvider
from backend.app.services.llm.mock import MockProvider


def test_each_provider_reports_its_own_identity():
    assert MockProvider().model_id == "mock:fixture"
    assert GeminiProvider(api_key="", model_name="gemini-3.8-flash").model_id == (
        "gemini:gemini-3.8-flash"
    )
    assert ClaudeProvider(api_key="", model_name="claude-sonnet-5").model_id == (
        "claude:claude-sonnet-5"
    )


def test_mock_identity_is_not_mistakable_for_a_real_model():
    """A briefing built from fixtures must not look like a model produced it."""
    model_id = MockProvider().model_id
    assert "gemini" not in model_id
    assert "claude" not in model_id
    assert model_id.startswith("mock:")


def test_identity_follows_the_configured_model_not_a_hardcoded_one():
    """Changing the model changes the recorded identity, with no code change."""
    assert GeminiProvider(api_key="", model_name="gemini-3.1-flash-lite").model_id == (
        "gemini:gemini-3.1-flash-lite"
    )


def test_pipeline_records_the_running_provider(client, auth_session):
    """End to end: the suite runs on the mock provider, so a completed analysis
    must say so rather than naming the Gemini model in settings."""
    with open("fixtures/01_clean_rental_agreement.pdf", "rb") as handle:
        upload = client.post(
            "/api/v1/documents",
            files={"file": ("agreement.pdf", handle, "application/pdf")},
            headers=auth_session["headers"],
        )
    assert upload.status_code == 201
    document_id = upload.json()["document_id"]

    started = client.post(
        f"/api/v1/documents/{document_id}/analyze",
        json={"language": "en"},
        headers=auth_session["headers"],
    )
    assert started.status_code == 202

    result = client.get(
        f"/api/v1/documents/{document_id}/analysis",
        headers=auth_session["headers"],
    )
    assert result.status_code == 200

    model_version = result.json()["source_metadata"]["model_version"]
    assert model_version == "mock:fixture"
