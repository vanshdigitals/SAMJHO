from typing import Literal

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Application
    APP_ENV: Literal["development", "production", "test"] = "development"
    LOG_LEVEL: str = "INFO"
    API_BASE_URL: str = "http://localhost:8000"
    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"

    # Database
    DATABASE_URL: str = "sqlite:///./samjo.db"

    # LLM Provider
    LLM_PROVIDER: Literal["mock", "gemini", "claude", "groq"] = "mock"
    LLM_MODEL: str = "gemini-3.8-flash"
    LLM_API_KEY: str = Field(
        default="",
        validation_alias=AliasChoices("LLM_API_KEY", "GEMINI_API_KEY"),
    )
    LLM_FALLBACK_PROVIDER: str = ""
    LLM_FALLBACK_API_KEY: str = ""
    LLM_FALLBACK_MODEL: str = "claude-sonnet-5"
    LLM_THINKING_LEVEL: Literal["low", "medium", "high"] = "low"
    CHARACTERIZATION_MODEL: str = "gemini-3.8-flash"
    LLM_TIMEOUT_SECONDS: int = 90
    LLM_MAX_OUTPUT_TOKENS: int = 8000
    LLM_TEMPERATURE: float = 0.0
    LLM_MAX_RETRIES: int = 1
    GEMINI_BILLING_CONFIRMED: bool = False

    # Groq. A separate key and model rather than reusing LLM_API_KEY, so that
    # switching LLM_PROVIDER between gemini and groq needs no key shuffling
    # and neither key is ever sent to the wrong endpoint.
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    # File Handling & Ingestion
    MAX_UPLOAD_BYTES: int = 10 * 1024 * 1024  # 10 MB
    MAX_PAGE_COUNT: int = 30
    MAX_EXTRACTION_CHARS: int = 120000
    ALLOWED_MIME_TYPES: str = (
        "application/pdf,"
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document,"
        "image/jpeg,"
        "image/png"
    )
    UPLOAD_TMP_DIR: str = "./var/uploads"

    # OCR
    OCR_ENABLED: bool = True
    OCR_MIN_CONFIDENCE: float = 0.60
    OCR_TIMEOUT_SECONDS: int = 30
    OCR_LANGUAGES: str = "hin+eng"
    TESSERACT_CMD: str = ""
    TESSDATA_PREFIX: str = ""

    # Retention
    DOCUMENT_TTL_HOURS: int = 24
    SESSION_TTL_HOURS: int = 72

    # Rate Limiting
    RATE_LIMIT_UPLOADS_PER_HOUR: int = 10
    RATE_LIMIT_ANALYSES_PER_HOUR: int = 15
    RATE_LIMIT_SITUATIONS_PER_HOUR: int = 10
    RATE_LIMIT_QUESTIONS_PER_HOUR: int = 40  # Unused - C3 blocked pending decision

    # Security Keys
    SESSION_SIGNING_KEY: str = "dev-insecure-session-signing-key-for-local-development-only"
    ENCRYPTION_KEY: str = "32-byte-fernet-key-placeholder-dev-only-not-for-prod="

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def allowed_mimes_list(self) -> list[str]:
        return [m.strip() for m in self.ALLOWED_MIME_TYPES.split(",") if m.strip()]

    @property
    def sqlalchemy_url(self) -> str:
        """The connection string, with the driver SQLAlchemy will actually find.

        Supabase and every other managed host hand out a plain
        `postgresql://` URI. SQLAlchemy reads that as psycopg2, which is not
        installed — psycopg 3 is. Rewriting the scheme here means the URI can
        be pasted from the dashboard unedited, which is how it will be pasted.
        """
        url = self.DATABASE_URL
        if url.startswith("postgres://"):  # some hosts still emit the old form
            url = "postgresql://" + url[len("postgres://") :]
        if url.startswith("postgresql://"):
            url = "postgresql+psycopg://" + url[len("postgresql://") :]
        return url

    def validate_production_invariants(self) -> None:
        """Enforce strict production invariants as required by RESOURCE_AUDIT and SECURITY.md."""
        if self.APP_ENV == "production":
            if not self.SESSION_SIGNING_KEY or self.SESSION_SIGNING_KEY.startswith("dev-"):
                raise RuntimeError(
                    "Production startup rejected: SESSION_SIGNING_KEY must be a secure secret."
                )
            if not self.ENCRYPTION_KEY or self.ENCRYPTION_KEY.startswith("32-byte-"):
                raise RuntimeError(
                    "Production startup rejected: ENCRYPTION_KEY must be a valid Fernet key."
                )
            if self.LLM_PROVIDER == "gemini" and not self.GEMINI_BILLING_CONFIRMED:
                raise RuntimeError(
                    "Production startup rejected: RESOURCE_AUDIT §0.1 forbids free tier Gemini "
                    "with real user documents. GEMINI_BILLING_CONFIRMED=true is required."
                )


settings = Settings()
settings.validate_production_invariants()
