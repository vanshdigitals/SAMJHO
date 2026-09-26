from datetime import datetime

from pydantic import BaseModel, Field


class SessionCreateRequest(BaseModel):
    language: str = Field(default="en", pattern="^(en|hi)$")


class SessionResponse(BaseModel):
    session_id: str
    expires_at: datetime


class DocumentUploadResponse(BaseModel):
    document_id: str
    status: str = "uploaded"
    page_count: int
    mime_type: str
    delete_after: datetime
    ocr_used: bool = False
    ocr_confidence: float | None = None
    ocr_low_confidence: bool = False
    extracted_text: str | None = None


class DocumentMetadataResponse(BaseModel):
    document_id: str
    status: str
    page_count: int
    document_type: str | None = None
    ocr_used: bool = False
    ocr_confidence: float | None = None
    ocr_low_confidence: bool = False
    extracted_text: str | None = None
    delete_after: datetime


class DocumentUpdateTextRequest(BaseModel):
    text: str = Field(min_length=10, max_length=120000)


class AnalyzeRequest(BaseModel):
    language: str = Field(default="en", pattern="^(en|hi)$")
    confirmed_text: str | None = None


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    stage: str


class SourceSpanDetailResponse(BaseModel):
    source_id: str
    quoted_text: str
    page: int
    start_offset: int | None = None
    end_offset: int | None = None
    context_before: str = ""
    context_after: str = ""
    verified: bool = True


class SituationCreateRequest(BaseModel):
    description: str = Field(min_length=1, max_length=2000)
    language: str = Field(default="en", pattern="^(en|hi)$")


class ClarifyingQuestion(BaseModel):
    id: str
    question: str


class SituationCreateResponse(BaseModel):
    situation_id: str
    clarifying_questions: list[ClarifyingQuestion]


class SituationAnswerItem(BaseModel):
    question_id: str
    answer: str


class SituationAnswerRequest(BaseModel):
    answers: list[SituationAnswerItem]


class SituationAnalyzeResponse(BaseModel):
    situation_id: str
    characterization: dict
    what_we_know: list[str]
    what_is_missing: list[str]
    possible_next_steps: list[dict]
    questions_for_professional: list[str]
    professional_help: dict
    disclaimer: str


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"
    llm_provider: str
