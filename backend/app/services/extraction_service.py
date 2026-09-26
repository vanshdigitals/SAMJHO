import asyncio
import glob
import io
import os
import re
import uuid
import zipfile
from typing import Any

import fitz  # PyMuPDF
from docx import Document as DocxDocument

from backend.app.core.config import settings
from backend.app.core.errors import SamjoError
from backend.app.core.logging import get_logger
from backend.app.services.ocr_service import ocr_service

logger = get_logger("samjo.extraction")

# Prompt injection heuristic patterns to flag (PATTERN NAMES ONLY recorded)
INJECTION_HEURISTICS = {
    "prompt_injection_ignore_instructions": re.compile(
        r"ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions", re.IGNORECASE
    ),
    "prompt_injection_reveal_prompt": re.compile(
        r"(?:reveal|print|output|display)\s+(?:your\s+)?(?:system\s+prompt|instructions)", re.IGNORECASE
    ),
    "prompt_injection_developer_mode": re.compile(
        r"(?:developer\s+mode|jailbreak|DAN\s+mode)", re.IGNORECASE
    ),
}

# Control characters to strip (keep \t, \n, \r)
CONTROL_CHAR_REGEX = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")

# Zero-width characters
ZERO_WIDTH_REGEX = re.compile(r"[\u200B-\u200D\uFEFF\u00AD]")


class DocumentExtractionService:
    """
    Validates, extracts, sanitizes document text and retains page-character offsets.
    Implements:
    - 7-step validation: size -> ext -> MIME -> magic bytes -> page count -> encryption -> macros
    - Safe extraction: PyMuPDF for PDF, python-docx for DOCX, OCR for images / scanned docs
    - Sanitisation: zero-width, near-zero font, white-on-white, off-mediabox, control chars
    - Prompt injection detection: records pattern names ONLY, never content
    - Immediate file cleanup in try/finally
    """

    def validate_file_bytes(
        self,
        raw_bytes: bytes,
        declared_filename: str,
        declared_mime: str,
    ) -> str:
        """
        Validates the file bytes in strict order:
        1. Size cap
        2. Extension
        3. Declared MIME
        4. Magic bytes (authoritative)
        5. Encryption
        6. Office macros
        7. Page count (for PDF)
        Returns the detected authoritative MIME type.
        """
        # 1. Size cap
        if len(raw_bytes) > settings.MAX_UPLOAD_BYTES:
            raise SamjoError.file_too_large()

        # 2. Extension
        ext = os.path.splitext(declared_filename)[1].lower()
        valid_exts = {".pdf", ".docx", ".jpg", ".jpeg", ".png"}
        if ext not in valid_exts:
            raise SamjoError.unsupported_type(f"File extension '{ext}' is not supported.")

        # 3. Declared MIME check
        if declared_mime not in settings.allowed_mimes_list:
            raise SamjoError.unsupported_type(f"MIME type '{declared_mime}' is not permitted.")

        # 4. Authoritative Magic Bytes check
        detected_mime = self._detect_magic_mime(raw_bytes)
        if not detected_mime or detected_mime not in settings.allowed_mimes_list:
            raise SamjoError.unsupported_type("File content does not match allowed document types.")

        # Ensure declared ext/mime roughly matches magic bytes
        if detected_mime == "application/pdf" and ext != ".pdf":
            raise SamjoError.unsupported_type("File extension mismatch.")
        if detected_mime.startswith("image/") and ext not in {".jpg", ".jpeg", ".png"}:
            raise SamjoError.unsupported_type("File extension mismatch for image.")

        # 5. Office Macros & ZIP validation for DOCX
        if detected_mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            self._validate_docx_macros_and_integrity(raw_bytes)

        # 6 & 7. Page count & encryption for PDF
        if detected_mime == "application/pdf":
            self._validate_pdf_integrity(raw_bytes)

        return detected_mime

    def _detect_magic_mime(self, data: bytes) -> str | None:
        if len(data) < 8:
            return None
        # PDF: %PDF-
        if data.startswith(b"%PDF-"):
            return "application/pdf"
        # PNG: \x89PNG\r\n\x1a\n
        if data.startswith(b"\x89PNG\r\n\x1a\n"):
            return "image/png"
        # JPEG: \xFF\xD8\xFF
        if data.startswith(b"\xFF\xD8\xFF"):
            return "image/jpeg"
        # DOCX / ZIP: PK\x03\x04
        if data.startswith(b"PK\x03\x04"):
            try:
                with zipfile.ZipFile(io.BytesIO(data)) as zf:
                    names = zf.namelist()
                    if "word/document.xml" in names:
                        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            except Exception:
                return None
        return None

    def _validate_docx_macros_and_integrity(self, data: bytes) -> None:
        try:
            with zipfile.ZipFile(io.BytesIO(data)) as zf:
                names = zf.namelist()
                for name in names:
                    if "vbaProject.bin" in name or name.endswith((".vba", ".macro")):
                        raise SamjoError.unsupported_type("Macro-bearing Office documents are not permitted.")
        except SamjoError:
            raise
        except Exception:
            raise SamjoError.unsupported_type("Corrupted or invalid DOCX document.")

    def _validate_pdf_integrity(self, data: bytes) -> None:
        try:
            doc = fitz.open(stream=data, filetype="pdf")
            if doc.is_encrypted:
                doc.close()
                raise SamjoError.file_encrypted()
            page_count = doc.page_count
            doc.close()
            if page_count > settings.MAX_PAGE_COUNT:
                raise SamjoError.file_too_large(
                    f"This document is {page_count} pages. Samjo reads documents up to {settings.MAX_PAGE_COUNT} pages. Try uploading just the relevant pages."
                )
        except SamjoError:
            raise
        except Exception:
            raise SamjoError.unsupported_type("Corrupted or unreadable PDF document.")

    async def extract_and_clean(
        self,
        raw_bytes: bytes,
        mime_type: str,
    ) -> dict[str, Any]:
        """
        Extracts document text with character offsets and sanitizes content.
        Guarantees that files written to disk are purged immediately in try/finally.
        Returns:
            {
                "full_text": str,
                "pages": [{"page_number": int, "char_start": int, "char_end": int, "text": str}],
                "page_count": int,
                "ocr_used": bool,
                "ocr_confidence": Optional[float],
                "injection_flags": list[str],
            }
        """
        temp_file_path = os.path.join(
            settings.UPLOAD_TMP_DIR, f"upload_{uuid.uuid4().hex}.tmp"
        )

        try:
            injection_flags: list[str] = []
            ocr_used = False
            ocr_confidence: float | None = None
            pages_data: list[dict] = []
            full_text = ""

            if mime_type == "application/pdf":
                res = await self._extract_pdf(temp_file_path, raw_bytes)
                pages_data = res["pages"]
                full_text = res["full_text"]
                ocr_used = res["ocr_used"]
                ocr_confidence = res["ocr_confidence"]
                injection_flags.extend(res.get("injection_flags", []))

            elif mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                res = await asyncio.to_thread(self._extract_docx, temp_file_path, raw_bytes)
                pages_data = res["pages"]
                full_text = res["full_text"]

            elif mime_type in ["image/jpeg", "image/png"]:
                if not ocr_service.is_available():
                    raise SamjoError.ocr_unavailable()
                ocr_used = True
                text, conf = await ocr_service.ocr_image_bytes(raw_bytes)
                ocr_confidence = conf
                clean_t = self._sanitize_text(text)
                pages_data = [{
                    "page_number": 1,
                    "char_start": 0,
                    "char_end": len(clean_t),
                    "text": clean_t,
                }]
                full_text = clean_t

            # Check prompt injection patterns on the full text
            for flag_name, pat in INJECTION_HEURISTICS.items():
                if pat.search(full_text):
                    if flag_name not in injection_flags:
                        injection_flags.append(flag_name)

            # Cap extraction chars
            if len(full_text) > settings.MAX_EXTRACTION_CHARS:
                full_text = full_text[:settings.MAX_EXTRACTION_CHARS]

            if not full_text or len(full_text.strip()) < 10:
                raise SamjoError.extraction_empty()

            ocr_low_confidence = bool(
                ocr_used
                and ocr_confidence is not None
                and ocr_confidence < settings.OCR_MIN_CONFIDENCE
            )
            if ocr_low_confidence:
                logger.warning(
                    "Low OCR confidence detected",
                    extra={
                        "extra_data": {
                            "event": "low_ocr_confidence",
                            "confidence": ocr_confidence,
                            "threshold": settings.OCR_MIN_CONFIDENCE,
                        }
                    },
                )

            return {
                "full_text": full_text,
                "pages": pages_data,
                "page_count": max(1, len(pages_data)),
                "ocr_used": ocr_used,
                "ocr_confidence": ocr_confidence,
                "ocr_low_confidence": ocr_low_confidence,
                "injection_flags": injection_flags,
            }

        except SamjoError:
            raise
        except Exception as e:
            logger.error(
                "Document extraction failure",
                extra={"extra_data": {"event": "extraction_failure", "error_type": type(e).__name__}},
            )
            raise SamjoError.extraction_empty()

        finally:
            # ALWAYS delete temporary file immediately
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except Exception:
                    pass

    def _extract_pdf_sync(
        self, file_path: str, raw_bytes: bytes | None = None
    ) -> tuple[str, list[dict], list[str]]:
        if raw_bytes is not None:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(raw_bytes)

        doc = fitz.open(file_path)
        pages_data = []
        full_text_pieces = []
        current_offset = 0
        injection_flags = []

        try:
            for p_idx in range(doc.page_count):
                page = doc[p_idx]
                page_text = ""
                rect = page.rect

                # Inspect text spans for near-zero font, white-on-white, off-mediabox
                blocks = page.get_text("dict").get("blocks", [])
                for b in blocks:
                    if b.get("type") == 0:  # text block
                        for line in b.get("lines", []):
                            for span in line.get("spans", []):
                                txt = span.get("text", "")
                                bbox = fitz.Rect(span.get("bbox", (0, 0, 0, 0)))
                                size = span.get("size", 10.0)
                                color = span.get("color", 0)

                                # Near-zero font size
                                if size < 1.0 and txt.strip():
                                    if "near_zero_font_size" not in injection_flags:
                                        injection_flags.append("near_zero_font_size")
                                    continue

                                # White on white (RGB = 16777215 or 0xFFFFFF)
                                if color in (16777215, 0xFFFFFF) and txt.strip():
                                    if "white_on_white_text" not in injection_flags:
                                        injection_flags.append("white_on_white_text")
                                    continue

                                # Off-mediabox text
                                if not rect.intersects(bbox) and txt.strip():
                                    if "off_mediabox_text" not in injection_flags:
                                        injection_flags.append("off_mediabox_text")
                                    continue

                                page_text += txt + " "
                        page_text += "\n"

                cleaned_page = self._sanitize_text(page_text)
                if len(cleaned_page.strip()) > 0:
                    p_len = len(cleaned_page)
                    pages_data.append({
                        "page_number": p_idx + 1,
                        "char_start": current_offset,
                        "char_end": current_offset + p_len,
                        "text": cleaned_page,
                    })
                    current_offset += p_len + 1  # account for page separation
                    full_text_pieces.append(cleaned_page)
        finally:
            doc.close()

        full_extracted = "\n".join(full_text_pieces)
        return full_extracted, pages_data, injection_flags

    async def _extract_pdf(self, file_path: str, raw_bytes: bytes) -> dict[str, Any]:
        # Offload file write and synchronous PyMuPDF dict parsing to worker thread to avoid blocking event loop
        full_extracted, pages_data, injection_flags = await asyncio.to_thread(
            self._extract_pdf_sync, file_path, raw_bytes
        )

        # Scanned PDF check: if very little text across pages, fallback to OCR
        ocr_used = False
        ocr_confidence = None

        if len(full_extracted.strip()) < 30:
            if not ocr_service.is_available():
                raise SamjoError.ocr_unavailable(
                    "This PDF appears to be a scan with no text layer, and OCR is currently unavailable. "
                    "Try uploading a text-searchable PDF or Word document."
                )
            ocr_used = True
            doc_ocr = fitz.open(file_path)
            ocr_text_pieces = []
            ocr_pages = []
            current_offset = 0
            confidences = []

            for p_idx in range(doc_ocr.page_count):
                page = doc_ocr[p_idx]
                pix = page.get_pixmap(dpi=150)
                img_bytes = pix.tobytes("png")
                text, conf = await ocr_service.ocr_image_bytes(img_bytes)
                confidences.append(conf)
                clean_ocr = self._sanitize_text(text)
                p_len = len(clean_ocr)
                ocr_pages.append({
                    "page_number": p_idx + 1,
                    "char_start": current_offset,
                    "char_end": current_offset + p_len,
                    "text": clean_ocr,
                })
                current_offset += p_len + 1
                ocr_text_pieces.append(clean_ocr)

            doc_ocr.close()
            full_extracted = "\n".join(ocr_text_pieces)
            pages_data = ocr_pages
            ocr_confidence = (sum(confidences) / len(confidences)) if confidences else 0.0

        return {
            "full_text": full_extracted,
            "pages": pages_data,
            "ocr_used": ocr_used,
            "ocr_confidence": ocr_confidence,
            "injection_flags": injection_flags,
        }

    def _extract_docx(
        self, file_path: str, raw_bytes: bytes | None = None
    ) -> dict[str, Any]:
        if raw_bytes is not None:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(raw_bytes)

        doc = DocxDocument(file_path)
        paragraphs = []
        for p in doc.paragraphs:
            if p.text.strip():
                paragraphs.append(self._sanitize_text(p.text))
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                if row_text:
                    paragraphs.append(self._sanitize_text(row_text))

        full_text = "\n".join(paragraphs)
        pages_data = [{
            "page_number": 1,
            "char_start": 0,
            "char_end": len(full_text),
            "text": full_text,
        }]

        return {
            "full_text": full_text,
            "pages": pages_data,
            "ocr_used": False,
            "ocr_confidence": None,
            "injection_flags": [],
        }

    def _sanitize_text(self, text: str) -> str:
        """
        Strips control characters, zero-width characters, and normalizes space.
        """
        if not text:
            return ""
        # 1. Strip zero-width characters
        cleaned = ZERO_WIDTH_REGEX.sub("", text)
        # 2. Strip control characters
        cleaned = CONTROL_CHAR_REGEX.sub(" ", cleaned)
        # 3. Normalize multiple spaces / linebreaks
        cleaned = re.sub(r"[ \t]+", " ", cleaned)
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
        return cleaned.strip()

    @staticmethod
    def cleanup_orphaned_uploads() -> None:
        """
        Sweeps UPLOAD_TMP_DIR for any orphaned temp files on startup.
        """
        if not os.path.exists(settings.UPLOAD_TMP_DIR):
            return
        pattern = os.path.join(settings.UPLOAD_TMP_DIR, "upload_*.tmp")
        for f in glob.glob(pattern):
            try:
                os.remove(f)
                logger.info(
                    "Cleaned up orphaned upload file",
                    extra={"extra_data": {"event": "orphan_cleaned"}},
                )
            except Exception:
                pass


extraction_service = DocumentExtractionService()
