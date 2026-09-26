import os

import pytest

from backend.app.core.errors import SamjoError
from backend.app.services.extraction_service import extraction_service

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "fixtures")


def test_renamed_exe_rejected_on_magic_bytes():
    fake_exe_path = os.path.join(FIXTURES_DIR, "fake_binary.pdf")
    with open(fake_exe_path, "rb") as f:
        data = f.read()

    with pytest.raises(SamjoError) as exc_info:
        extraction_service.validate_file_bytes(
            raw_bytes=data,
            declared_filename="agreement.pdf",
            declared_mime="application/pdf",
        )
    assert exc_info.value.code == "UNSUPPORTED_TYPE"


def test_encrypted_pdf_rejected():
    enc_path = os.path.join(FIXTURES_DIR, "encrypted_agreement.pdf")
    with open(enc_path, "rb") as f:
        data = f.read()

    with pytest.raises(SamjoError) as exc_info:
        extraction_service.validate_file_bytes(
            raw_bytes=data,
            declared_filename="encrypted_agreement.pdf",
            declared_mime="application/pdf",
        )
    assert exc_info.value.code == "FILE_ENCRYPTED"


@pytest.mark.asyncio
async def test_empty_document_raises_extraction_empty():
    empty_path = os.path.join(FIXTURES_DIR, "06_empty_or_truncated.pdf")
    with open(empty_path, "rb") as f:
        data = f.read()

    with pytest.raises(SamjoError) as exc_info:
        await extraction_service.extract_and_clean(data, "application/pdf")
    assert exc_info.value.code == "EXTRACTION_EMPTY"


def test_file_too_large_rejected():
    oversized_data = b"0" * (10 * 1024 * 1024 + 1)
    with pytest.raises(SamjoError) as exc_info:
        extraction_service.validate_file_bytes(
            raw_bytes=oversized_data,
            declared_filename="big.pdf",
            declared_mime="application/pdf",
        )
    assert exc_info.value.code == "FILE_TOO_LARGE"
    assert exc_info.value.status_code == 413


def test_wrong_file_type_rejected():
    with pytest.raises(SamjoError) as exc_info:
        extraction_service.validate_file_bytes(
            raw_bytes=b"sample text content",
            declared_filename="document.txt",
            declared_mime="text/plain",
        )
    assert exc_info.value.code == "UNSUPPORTED_TYPE"


def test_corrupted_pdf_rejected():
    with pytest.raises(SamjoError) as exc_info:
        extraction_service.validate_file_bytes(
            raw_bytes=b"%PDF-1.4 corrupted incomplete stream \x00\x01\x02",
            declared_filename="corrupted.pdf",
            declared_mime="application/pdf",
        )
    assert exc_info.value.code == "UNSUPPORTED_TYPE"


def test_page_count_over_30_rejected():
    import fitz
    doc = fitz.open()
    for _ in range(35):
        doc.new_page()
    pdf_bytes = doc.tobytes()
    doc.close()

    with pytest.raises(SamjoError) as exc_info:
        extraction_service.validate_file_bytes(
            raw_bytes=pdf_bytes,
            declared_filename="oversized_pages.pdf",
            declared_mime="application/pdf",
        )
    assert exc_info.value.code == "FILE_TOO_LARGE"
    assert "35 pages" in exc_info.value.message

