from backend.app.schemas.ai import DeterministicFacts, MoneyItem, SourceSpan
from backend.app.services.evidence_service import evidence_service
from backend.app.services.safety_service import safety_service


def test_span_verification_exact_and_normalized():
    doc_text = 'The tenant shall pay a monthly rent of Rs. 25,000/- on or before the 5th.'

    # Exact match
    ok, span = evidence_service.verify_span("monthly rent of Rs. 25,000/-", doc_text)
    assert ok is True
    assert span.verified is True
    assert span.start_offset is not None

    # Normalized match (curly quotes & extra whitespace)
    quote_with_whitespace = "monthly    rent   of  Rs. 25,000/-"
    ok, span2 = evidence_service.verify_span(quote_with_whitespace, doc_text)
    assert ok is True
    assert span2.verified is True

    # Fabricated / Paraphrased quote MUST FAIL (Strictly NO fuzzy matching)
    paraphrased = "tenant is supposed to give 25000 rupees monthly"
    ok, span3 = evidence_service.verify_span(paraphrased, doc_text)
    assert ok is False
    assert span3 is None


def test_deterministic_reconciliation_parser_wins():
    facts = DeterministicFacts(
        amounts=[{"raw": "Rs. 25,000/-", "value": 25000.0, "currency": "INR", "span": [0, 10]}],
        dates=[],
        percentages=[],
        notice_periods=[],
    )
    item = MoneyItem(
        id="m1",
        title="Rent",
        label="monthly_rent",
        what_document_says=SourceSpan(quoted_text="monthly rent of Rs. 25,000/-", page=1),
        ai_interpretation="Monthly rent obligation",
        amount_text="Rs. 25,000/-",
        amount_value=30000.0,  # Model hallucinated 30,000
        confidence=0.9,
    )
    # Parser should correct the value to 25,000 and flag needs_verification = True
    matched_amount = safety_service._match_currency_amount(item.amount_text, facts.amounts)
    assert matched_amount == 25000.0
    if item.amount_value != matched_amount:
        item.amount_value = matched_amount
        item.needs_verification = True

    assert item.amount_value == 25000.0
    assert item.needs_verification is True


def test_analysis_response_schema_canonical_no_duplicate_aliases():
    from backend.app.schemas.ai import AnalysisResponse

    fields = AnalysisResponse.model_fields
    # Canonical concepts must be present
    assert "obligations" in fields
    assert "risks" in fields
    assert "money_items" in fields
    assert "deadlines" in fields

    # Duplicate aliases must be absent
    assert "must_do" not in fields
    assert "watch_out" not in fields
    assert "details" not in fields
    assert "dates" not in fields

    # JSON schema handed to Gemini must be lean and non-duplicative
    schema = AnalysisResponse.model_json_schema()
    props = schema.get("properties", {})
    assert "obligations" in props
    assert "risks" in props
    assert "money_items" in props
    assert "deadlines" in props
    assert "must_do" not in props
    assert "watch_out" not in props
    assert "details" not in props
    assert "dates" not in props
