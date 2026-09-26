import io
import os
import uuid
from typing import Any

import fitz
import pytest
from PIL import Image, ImageDraw, ImageFont

from backend.app.core.errors import OcrUnavailableError, SamjoError
from backend.app.schemas.ai import (
    AnalysisResponse,
    DeterministicFacts,
    Obligation,
    SourceMetadata,
    SourceSpan,
    Urgency,
    UrgencyAssessment,
)
from backend.app.services.extraction_service import extraction_service
from backend.app.services.ocr_service import ocr_service
from backend.app.services.safety_service import safety_service


def create_test_image(text: str, is_hindi: bool = False) -> bytes:
    """Creates a high-contrast image containing test text."""
    img = Image.new("RGB", (900, 200), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    # truetype() and load_default() return different font classes; the name
    # holds whichever one the machine actually has.
    font: Any = None
    if is_hindi:
        for font_path in [
            r"C:\Windows\Fonts\Nirmala.ttc",
            r"C:\Windows\Fonts\mangal.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]:
            if os.path.exists(font_path):
                try:
                    font = ImageFont.truetype(font_path, 32)
                    break
                except Exception:
                    pass

    if font is None:
        try:
            font = ImageFont.truetype("arial.ttf", 30)
        except Exception:
            font = ImageFont.load_default()

    draw.text((30, 60), text, fill=(0, 0, 0), font=font)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def create_scanned_pdf(text: str) -> bytes:
    """Creates a PDF with NO digital text layer, only an embedded image of text."""
    img_bytes = create_test_image(text)
    doc = fitz.open()
    page = doc.new_page(width=600, height=300)
    page.insert_image(fitz.Rect(20, 20, 580, 280), stream=img_bytes)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def create_digital_pdf(text: str) -> bytes:
    """Creates a digital PDF with a native text layer."""
    doc = fitz.open()
    page = doc.new_page(width=600, height=300)
    page.insert_text(fitz.Point(50, 70), text, fontsize=14)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


# 1. Test Tesseract Available & Capabilities Check
def test_tesseract_available():
    caps = ocr_service.check_capabilities()
    assert caps["available"] is True
    assert caps["enabled"] is True
    assert caps["version"] is not None
    assert "eng" in caps["languages"]
    assert "hin" in caps["languages"]
    assert caps["has_eng"] is True
    assert caps["has_hin"] is True
    assert caps["error"] is None
    assert ocr_service.is_available() is True


# 2. Test Tesseract Unavailable Behaviour (No silent empty extraction, raises OCR_UNAVAILABLE)
@pytest.mark.asyncio
async def test_tesseract_unavailable(monkeypatch):
    monkeypatch.setattr(ocr_service, "is_available", lambda: False)

    # Calling ocr_image_bytes must raise OcrUnavailableError
    with pytest.raises(OcrUnavailableError) as exc_info:
        await ocr_service.ocr_image_bytes(b"fake_image_bytes")
    assert exc_info.value.code == "OCR_UNAVAILABLE"
    assert exc_info.value.status_code == 503

    # Image extraction must raise OCR_UNAVAILABLE, NOT EXTRACTION_EMPTY
    dummy_img = create_test_image("Tenant rent obligation notice")
    with pytest.raises(SamjoError) as exc_info2:
        await extraction_service.extract_and_clean(dummy_img, "image/png")
    assert exc_info2.value.code == "OCR_UNAVAILABLE"

    # Scanned PDF extraction must raise OCR_UNAVAILABLE, NOT EXTRACTION_EMPTY
    scanned_pdf = create_scanned_pdf("Notice to vacate premise")
    with pytest.raises(SamjoError) as exc_info3:
        await extraction_service.extract_and_clean(scanned_pdf, "application/pdf")
    assert exc_info3.value.code == "OCR_UNAVAILABLE"


# 3. Test OCR Extraction on English Image
@pytest.mark.asyncio
async def test_ocr_extraction_english_image():
    english_notice = "Residential Rental Agreement: The monthly rent is Rs 25000 payable on 1st."
    img_bytes = create_test_image(english_notice)

    text, conf = await ocr_service.ocr_image_bytes(img_bytes)
    assert len(text.strip()) > 0
    assert any(term in text.lower() for term in ["rental", "agreement", "rent", "25000"])
    assert conf > 0.50


# 4. Test Hindi OCR
@pytest.mark.asyncio
async def test_ocr_extraction_hindi():
    hindi_notice = "किराया समझौता नोटिस"
    img_bytes = create_test_image(hindi_notice, is_hindi=True)

    text, conf = await ocr_service.ocr_image_bytes(img_bytes, languages="hin+eng")
    assert len(text.strip()) > 0
    assert conf > 0.0


# 5. Test Low Confidence Surface & Safety Verification Trigger
def test_ocr_low_confidence_forces_verification():
    # Construct an analysis where OCR confidence is below threshold (0.50 < 0.60)
    analysis = AnalysisResponse(
        document_id=str(uuid.uuid4()),
        language="en",
        document_type="rental_agreement",
        type_confidence=0.8,
        summary="Briefing summary",
        urgency=UrgencyAssessment(level=Urgency.LOW, reason="Routine lease"),
        obligations=[
            Obligation(
                id="ob-1",
                title="Pay rent",
                what_document_says=SourceSpan(source_id="s1", page=1, quoted_text="rent"),
                ai_interpretation="Monthly payment required",
                needs_verification=False,
                confidence=0.9,
            )
        ],
        source_metadata=SourceMetadata(
            page_count=1,
            ocr_used=True,
            ocr_confidence=0.45,  # Below OCR_MIN_CONFIDENCE (0.60)
        ),
    )

    facts = DeterministicFacts()
    processed = safety_service.apply_safety_and_reconciliation(
        analysis=analysis,
        document_text="rent notice",
        facts=facts,
    )

    # Every item must have needs_verification forced to True
    assert processed.obligations[0].needs_verification is True


# 6. Test Image Upload via API
def test_image_upload_api(client, auth_session):
    img_bytes = create_test_image("Notice of tenancy termination: vacate within 30 days.")

    files = {"file": ("notice.png", img_bytes, "image/png")}
    response = client.post(
        "/api/v1/documents",
        files=files,
        headers=auth_session["headers"],
    )

    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "uploaded"
    assert data["page_count"] == 1
    assert data["ocr_used"] is True
    assert data["ocr_confidence"] is not None

    # Retrieve metadata
    doc_id = data["document_id"]
    get_resp = client.get(
        f"/api/v1/documents/{doc_id}",
        headers=auth_session["headers"],
    )
    assert get_resp.status_code == 200
    meta = get_resp.json()
    assert meta["ocr_used"] is True


# 7. Test Scanned PDF Pipeline (Image inside PDF routes to OCR)
@pytest.mark.asyncio
async def test_scanned_pdf_pipeline():
    scanned_pdf = create_scanned_pdf("Notice to Vacate: Tenant must leave premises by end of month.")
    res = await extraction_service.extract_and_clean(scanned_pdf, "application/pdf")

    assert res["ocr_used"] is True
    assert res["ocr_confidence"] is not None
    assert any(term in res["full_text"].lower() for term in ["notice", "tenant", "month", "vacate"])


# 8. Test Digital PDF Preserves Native Text Layer (OCR is NOT used)
@pytest.mark.asyncio
async def test_digital_pdf_preserves_native_extraction():
    digital_text = (
        "Standard Residential Tenancy Agreement. The Tenant shall maintain the premises "
        "in good order and pay the electricity bill every month."
    )
    pdf_bytes = create_digital_pdf(digital_text)
    res = await extraction_service.extract_and_clean(pdf_bytes, "application/pdf")

    assert res["ocr_used"] is False
    assert res["ocr_confidence"] is None
    assert "Standard Residential Tenancy Agreement" in res["full_text"]


# 9. Test Document Text Update & Confirmation API
def test_document_text_update_api(client, auth_session):
    img_bytes = create_test_image("Tenant Notice Rs 25000")
    upload_resp = client.post(
        "/api/v1/documents",
        files={"file": ("scan.png", img_bytes, "image/png")},
        headers=auth_session["headers"],
    )
    assert upload_resp.status_code == 201
    doc_id = upload_resp.json()["document_id"]

    # User confirms / corrects the extracted text
    confirmed_text = "Corrected Notice: The tenant must pay Rs 25000 before the 5th."
    patch_resp = client.patch(
        f"/api/v1/documents/{doc_id}/text",
        json={"text": confirmed_text},
        headers=auth_session["headers"],
    )
    assert patch_resp.status_code == 200
    patch_data = patch_resp.json()
    assert patch_data["ocr_confidence"] == 1.0
    assert patch_data["ocr_low_confidence"] is False
    assert patch_data["extracted_text"] == confirmed_text
