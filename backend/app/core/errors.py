from typing import Any, Optional

from fastapi import Request
from fastapi.responses import JSONResponse


class SamjoError(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        retryable: bool = False,
    ):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.retryable = retryable

    def to_dict(self) -> dict[str, Any]:
        return {
            "error_code": self.code,
            "message": self.message,
            "retryable": self.retryable,
        }

    @classmethod
    def file_too_large(cls, msg: Optional[str] = None) -> "FileTooLargeError":
        return FileTooLargeError(msg) if msg else FileTooLargeError()

    @classmethod
    def unsupported_type(cls, msg: Optional[str] = None) -> "UnsupportedTypeError":
        return UnsupportedTypeError(msg) if msg else UnsupportedTypeError()

    @classmethod
    def file_encrypted(cls, msg: Optional[str] = None) -> "FileEncryptedError":
        return FileEncryptedError(msg) if msg else FileEncryptedError()

    @classmethod
    def extraction_empty(cls, msg: Optional[str] = None) -> "ExtractionEmptyError":
        return ExtractionEmptyError(msg) if msg else ExtractionEmptyError()

    @classmethod
    def not_legal_document(cls, msg: Optional[str] = None) -> "NotLegalDocumentError":
        return NotLegalDocumentError(msg) if msg else NotLegalDocumentError()

    @classmethod
    def already_processing(cls, msg: Optional[str] = None) -> "AlreadyProcessingError":
        return AlreadyProcessingError(msg) if msg else AlreadyProcessingError()

    @classmethod
    def schema_invalid(cls, msg: Optional[str] = None) -> "SchemaInvalidError":
        return SchemaInvalidError(msg) if msg else SchemaInvalidError()

    @classmethod
    def rate_limited(cls, msg: Optional[str] = None) -> "RateLimitedError":
        return RateLimitedError(msg) if msg else RateLimitedError()

    @classmethod
    def provider_config(cls, msg: Optional[str] = None) -> "ProviderConfigError":
        return ProviderConfigError(msg) if msg else ProviderConfigError()

    @classmethod
    def provider_unavailable(cls, msg: Optional[str] = None) -> "ProviderUnavailableError":
        return ProviderUnavailableError(msg) if msg else ProviderUnavailableError()

    @classmethod
    def provider_timeout(cls, msg: Optional[str] = None) -> "ProviderTimeoutError":
        return ProviderTimeoutError(msg) if msg else ProviderTimeoutError()

    @classmethod
    def quota_exhausted(cls, msg: Optional[str] = None) -> "QuotaExhaustedError":
        return QuotaExhaustedError(msg) if msg else QuotaExhaustedError()

    @classmethod
    def not_found(cls, msg: Optional[str] = None) -> "NotFoundError":
        return NotFoundError(msg) if msg else NotFoundError()

    @classmethod
    def csrf_error(cls, msg: Optional[str] = None) -> "CsrfError":
        return CsrfError(msg) if msg else CsrfError()

    @classmethod
    def unauthorized(cls, msg: Optional[str] = None) -> "UnauthorizedError":
        return UnauthorizedError(msg) if msg else UnauthorizedError()

    @classmethod
    def ocr_unavailable(cls, msg: Optional[str] = None) -> "OcrUnavailableError":
        return OcrUnavailableError(msg) if msg else OcrUnavailableError()


class FileTooLargeError(SamjoError):
    def __init__(self, message: str = "This file is over 10 MB. Try uploading just the pages that matter."):
        super().__init__(code="FILE_TOO_LARGE", message=message, status_code=413, retryable=False)


class UnsupportedTypeError(SamjoError):
    def __init__(self, message: str = "Samjo reads PDF, Word and photos. This file is a different type."):
        super().__init__(code="UNSUPPORTED_TYPE", message=message, status_code=415, retryable=False)


class FileEncryptedError(SamjoError):
    def __init__(self, message: str = "This PDF is password-protected, so Samjo can't open it. Remove the password and upload it again."):
        super().__init__(code="FILE_ENCRYPTED", message=message, status_code=422, retryable=False)


class OcrUnavailableError(SamjoError):
    def __init__(self, message: str = "Optical character recognition is temporarily unavailable. Try uploading a text-searchable PDF or Word document."):
        super().__init__(code="OCR_UNAVAILABLE", message=message, status_code=503, retryable=True)


class ExtractionEmptyError(SamjoError):
    def __init__(self, message: str = "Samjo couldn't read this document. It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF."):
        super().__init__(code="EXTRACTION_EMPTY", message=message, status_code=422, retryable=False)


class NotLegalDocumentError(SamjoError):
    def __init__(self, message: str = "This doesn't look like a legal document. If something has happened and you want help thinking it through, tell us about it instead."):
        super().__init__(code="NOT_LEGAL_DOCUMENT", message=message, status_code=422, retryable=False)


class AlreadyProcessingError(SamjoError):
    def __init__(self, message: str = "Analysis is already in progress for this document."):
        super().__init__(code="ALREADY_PROCESSING", message=message, status_code=409, retryable=True)


class SchemaInvalidError(SamjoError):
    def __init__(self, message: str = "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again."):
        super().__init__(code="SCHEMA_INVALID", message=message, status_code=502, retryable=True)


class RateLimitedError(SamjoError):
    def __init__(self, message: str = "Samjo is busy right now. Try again in a minute."):
        super().__init__(code="RATE_LIMITED", message=message, status_code=429, retryable=True)


class ProviderUnavailableError(SamjoError):
    """The provider is reachable but failing (5xx / UNAVAILABLE / overloaded).

    Distinct from SCHEMA_INVALID, which means the model answered and the answer
    did not fit the contract. Conflating them tells the reader to retry a
    document that will never validate, and tells them to give up on one that
    would have worked a minute later (RESOURCE_AUDIT §22)."""

    def __init__(self, message: str = "Samjo is busy right now. Try again in a minute."):
        super().__init__(code="AI_UNAVAILABLE", message=message, status_code=503, retryable=True)


class ProviderConfigError(SamjoError):
    """The provider rejected our credentials or our request shape (401/403/400).

    Distinct from AI_UNAVAILABLE because retrying cannot help: a bad key stays
    bad, and a malformed request stays malformed. Retrying either one just
    burns the rate limit on a call that will never succeed. The reader gets the
    same neutral copy as any other failure — nothing about keys or providers
    reaches the browser.
    """

    def __init__(self, message: str = "Samjo couldn't reach its analysis service. Your file is still here. Try again shortly."):
        super().__init__(code="AI_CONFIG_ERROR", message=message, status_code=503, retryable=False)


class ProviderTimeoutError(SamjoError):
    def __init__(self, message: str = "Samjo took too long reading this document. Your file is still here. Try again."):
        super().__init__(code="AI_TIMEOUT", message=message, status_code=504, retryable=True)


class QuotaExhaustedError(SamjoError):
    def __init__(self, message: str = "Samjo daily processing limit reached. Please try again tomorrow."):
        super().__init__(code="QUOTA_EXHAUSTED", message=message, status_code=429, retryable=False)


class NotFoundError(SamjoError):
    def __init__(self, message: str = "Not found."):
        super().__init__(code="NOT_FOUND", message=message, status_code=404, retryable=False)


class CsrfError(SamjoError):
    def __init__(self, message: str = "Missing or invalid session header."):
        super().__init__(code="CSRF_ERROR", message=message, status_code=403, retryable=False)


class UnauthorizedError(SamjoError):
    def __init__(self, message: str = "Session expired or invalid."):
        super().__init__(code="UNAUTHORIZED", message=message, status_code=401, retryable=True)


async def samjo_error_handler(request: Request, exc: SamjoError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=exc.to_dict())
