import os

import pytest

from backend.app.services.deterministic_service import deterministic_extractor
from backend.app.services.extraction_service import extraction_service

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "fixtures")


@pytest.mark.asyncio
async def test_pymupdf_extraction_offsets():
    pdf_path = os.path.join(FIXTURES_DIR, "01_clean_rental_agreement.pdf")
    with open(pdf_path, "rb") as f:
        data = f.read()

    result = await extraction_service.extract_and_clean(data, "application/pdf")
    assert result["page_count"] >= 1
    assert "RESIDENTIAL RENTAL AGREEMENT" in result["full_text"]
    assert len(result["pages"]) >= 1
    assert result["pages"][0]["char_start"] == 0
    assert result["pages"][0]["char_end"] > 0


@pytest.mark.asyncio
async def test_docx_extraction():
    docx_path = os.path.join(FIXTURES_DIR, "02_confusing_rental_agreement.docx")
    with open(docx_path, "rb") as f:
        data = f.read()

    result = await extraction_service.extract_and_clean(
        data, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    assert "INDENTURE OF LEASE" in result["full_text"]


def test_currency_and_indian_numbering():
    text = "Rent is Rs. 25,000/- and deposit is ₹2,50,000. Another fee is INR 500."
    facts = deterministic_extractor.extract(text)
    vals = [a["value"] for a in facts.amounts]
    assert 25000.0 in vals
    assert 250000.0 in vals  # Indian grouping ₹2,50,000
    assert 500.0 in vals


def test_date_and_notice_parsing():
    text = "Agreement dated 1st May 2024. Either party may give 30 days notice to vacate."
    facts = deterministic_extractor.extract(text)
    assert any("2024-05-01" in d["iso"] for d in facts.dates)
    assert any("30 days" in n for n in facts.notice_periods)
