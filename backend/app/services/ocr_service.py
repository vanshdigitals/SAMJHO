import asyncio
import io
import os
import shutil
from typing import Any

import pytesseract
from PIL import Image

from backend.app.core.config import settings
from backend.app.core.errors import SamjoError
from backend.app.core.logging import get_logger

logger = get_logger("samjo.ocr")


class OCRService:
    """
    Performs OCR fallback using pytesseract with:
    - Bounded execution time (OCR_TIMEOUT_SECONDS)
    - Multilingual support (hin+eng)
    - Confidence calculation
    - Capability verification (never silently report OCR unavailability as EXTRACTION_EMPTY)
    """

    def __init__(self):
        self.enabled = settings.OCR_ENABLED
        self.languages = settings.OCR_LANGUAGES
        self.timeout = settings.OCR_TIMEOUT_SECONDS
        self.min_confidence = settings.OCR_MIN_CONFIDENCE
        self._configured_cmd: str | None = None
        self._init_tesseract_path()

    def _init_tesseract_path(self) -> None:
        """Locates and configures the tesseract executable and tessdata prefix."""
        candidates = []

        # 1. Configured setting
        if settings.TESSERACT_CMD:
            candidates.append(settings.TESSERACT_CMD)

        # 2. System PATH
        which_path = shutil.which("tesseract") or shutil.which("tesseract.exe")
        if which_path:
            candidates.append(which_path)

        # 3. Local workspace path (var/tesseract/tesseract.exe)
        workspace_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../../var/tesseract")
        )
        candidates.append(os.path.join(workspace_dir, "tesseract.exe"))

        # 4. User local AppData (Windows)
        local_app_data = os.environ.get("LOCALAPPDATA")
        if local_app_data:
            candidates.append(
                os.path.join(local_app_data, "Programs", "Tesseract-OCR", "tesseract.exe")
            )

        # 5. Program Files (Windows)
        candidates.append(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
        candidates.append(r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe")

        # 6. Linux / container standard paths
        candidates.append("/usr/bin/tesseract")
        candidates.append("/usr/local/bin/tesseract")

        for cand in candidates:
            if cand and os.path.isfile(cand):
                self._configured_cmd = os.path.abspath(cand)
                pytesseract.pytesseract.tesseract_cmd = self._configured_cmd
                break

        # Configure TESSDATA_PREFIX if not already set
        if settings.TESSDATA_PREFIX and os.path.isdir(settings.TESSDATA_PREFIX):
            os.environ["TESSDATA_PREFIX"] = settings.TESSDATA_PREFIX
        elif self._configured_cmd:
            cmd_dir = os.path.dirname(self._configured_cmd)
            adjacent_tessdata = os.path.join(cmd_dir, "tessdata")
            if os.path.isdir(adjacent_tessdata) and "TESSDATA_PREFIX" not in os.environ:
                os.environ["TESSDATA_PREFIX"] = adjacent_tessdata

    def check_capabilities(self) -> dict[str, Any]:
        """
        Verifies OCR engine availability, version, and language support.
        Catches any failures without raising.
        """
        if not self.enabled:
            return {
                "available": False,
                "enabled": False,
                "tesseract_cmd": self._configured_cmd,
                "version": None,
                "languages": [],
                "has_eng": False,
                "has_hin": False,
                "error": "OCR is disabled in configuration (OCR_ENABLED=False).",
            }

        self._init_tesseract_path()

        if not self._configured_cmd or not os.path.isfile(self._configured_cmd):
            return {
                "available": False,
                "enabled": True,
                "tesseract_cmd": None,
                "version": None,
                "languages": [],
                "has_eng": False,
                "has_hin": False,
                "error": "Tesseract binary not found in system PATH or known paths.",
            }

        try:
            version_str = str(pytesseract.get_tesseract_version())
            languages = pytesseract.get_languages()
            has_eng = "eng" in languages
            has_hin = "hin" in languages

            return {
                "available": True,
                "enabled": True,
                "tesseract_cmd": self._configured_cmd,
                "tessdata_prefix": os.environ.get("TESSDATA_PREFIX"),
                "version": version_str,
                "languages": languages,
                "has_eng": has_eng,
                "has_hin": has_hin,
                "error": None,
            }
        except Exception as e:
            return {
                "available": False,
                "enabled": True,
                "tesseract_cmd": self._configured_cmd,
                "version": None,
                "languages": [],
                "has_eng": False,
                "has_hin": False,
                "error": f"Failed executing Tesseract: {type(e).__name__}: {e}",
            }

    def is_available(self) -> bool:
        """Returns True if Tesseract is enabled and working."""
        status = self.check_capabilities()
        return bool(status.get("available"))

    async def ocr_image_bytes(
        self, image_bytes: bytes, languages: str | None = None
    ) -> tuple[str, float]:
        """
        Runs OCR on raw image bytes.
        Returns (extracted_text, average_confidence).
        Raises SamjoError.ocr_unavailable() if Tesseract is missing, disabled, or times out.
        """
        if not self.enabled:
            raise SamjoError.ocr_unavailable("OCR processing is disabled.")

        if not self.is_available():
            raise SamjoError.ocr_unavailable(
                "Optical character recognition is temporarily unavailable. "
                "Try uploading a text-searchable PDF or Word document."
            )

        try:
            return await asyncio.wait_for(
                asyncio.to_thread(self._sync_ocr, image_bytes, languages),
                timeout=float(self.timeout),
            )
        except asyncio.TimeoutError:
            logger.warning(
                "OCR timeout exceeded",
                extra={"extra_data": {"event": "ocr_timeout", "timeout": self.timeout}},
            )
            raise SamjoError.ocr_unavailable(
                "OCR processing timed out. Please try uploading a smaller or clearer image."
            )
        except SamjoError:
            raise
        except Exception as e:
            logger.warning(
                "OCR execution failed",
                extra={"extra_data": {"event": "ocr_failed", "error_type": type(e).__name__}},
            )
            raise SamjoError.ocr_unavailable(
                "OCR execution failed. Try uploading a text-searchable PDF or Word document."
            )

    def _sync_ocr(
        self, image_bytes: bytes, languages: str | None = None
    ) -> tuple[str, float]:
        try:
            # Image.open returns ImageFile; every conversion below returns a
            # plain Image, so the name is typed as the wider one.
            image: Image.Image = Image.open(io.BytesIO(image_bytes))

            # Convert RGBA/palette to RGB if necessary for OCR compatibility
            if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
                background = Image.new("RGB", image.size, (255, 255, 255))
                if image.mode == "P":
                    image = image.convert("RGBA")
                background.paste(image, mask=image.split()[-1] if image.mode == "RGBA" else None)
                image = background
            elif image.mode != "RGB" and image.mode != "L":
                image = image.convert("RGB")

            # Determine language combination
            requested_langs = languages or self.languages
            # Validate languages against available
            try:
                available_langs = set(pytesseract.get_languages())
            except Exception:
                available_langs = {"eng"}

            langs_to_use = []
            for lang in requested_langs.split("+"):
                lang = lang.strip()
                if lang in available_langs:
                    langs_to_use.append(lang)

            lang_str = "+".join(langs_to_use) if langs_to_use else "eng"

            # Retrieve text and word-level data for confidence calculation
            data = pytesseract.image_to_data(
                image,
                lang=lang_str,
                output_type=pytesseract.Output.DICT,
            )

            text_pieces = []
            confidences = []

            for i in range(len(data["text"])):
                word = data["text"][i].strip()
                conf = float(data["conf"][i])
                if word:
                    text_pieces.append(word)
                    if conf >= 0:
                        confidences.append(conf)

            full_text = " ".join(text_pieces)
            avg_conf = (sum(confidences) / len(confidences) / 100.0) if confidences else 0.0

            return full_text, avg_conf

        except pytesseract.TesseractNotFoundError:
            raise SamjoError.ocr_unavailable(
                "Optical character recognition engine was not found on the system."
            )
        except Exception as e:
            logger.warning(
                "OCR inner execution error",
                extra={"extra_data": {"event": "ocr_inner_error", "error": type(e).__name__}},
            )
            raise SamjoError.ocr_unavailable(
                f"OCR extraction failed: {type(e).__name__}"
            )


ocr_service = OCRService()
