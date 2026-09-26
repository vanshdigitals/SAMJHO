from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class Urgency(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class SourceSpan(BaseModel):
    """A verbatim quote from the document. Verified after generation."""
    source_id: str | None = None
    quoted_text: str = Field(min_length=1, max_length=1200)
    page: int = Field(ge=1, default=1)
    start_offset: int | None = None
    end_offset: int | None = None
    verified: bool = False


class AnalysisItem(BaseModel):
    id: str = "item-id"
    title: str = Field(max_length=200, default="")
    what_document_says: SourceSpan
    # Required, with no default. AI_SCHEMAS.md's whole thesis is that "what the
    # document says" and "what Samjo reads into it" are separate states that the
    # UI never merges. A default of "" makes the field optional in the JSON
    # schema handed to the model, so the model is free to omit it — and a
    # briefing item with a quote and no interpretation has quietly collapsed the
    # two states back into one.
    ai_interpretation: str = Field(min_length=1, max_length=1000)
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    needs_verification: bool = False

    @field_validator("ai_interpretation")
    @classmethod
    def no_statute_assertion(cls, v: str) -> str:
        return v


class Obligation(AnalysisItem):
    who: str = "you"  # "you" | "other_party"
    when: str | None = None


class Risk(AnalysisItem):
    severity: Severity = Severity.MEDIUM
    why_it_matters: str = Field(max_length=600, default="")


class MoneyItem(AnalysisItem):
    label: str = "detail"  # security_deposit, monthly_rent, penalty, etc.
    amount_text: str = ""  # verbatim text: "Rs. 25,000/-"
    amount_value: float | None = None
    currency: str = "INR"


class Deadline(AnalysisItem):
    label: str = "date"
    date_text: str = ""  # verbatim text: "within 30 days of receipt"
    resolved_date: date | None = None
    is_relative: bool = False
    needs_verification: bool = True  # Every deadline carries needs_verification regardless


class Question(BaseModel):
    id: str
    text: str = Field(max_length=300)
    rationale: str = Field(max_length=400, default="")


class NextStep(BaseModel):
    id: str
    step: str = Field(max_length=300)
    type: str = "information"  # information | prepare | see_professional
    is_advice: bool = False


class UrgencyAssessment(BaseModel):
    level: Urgency = Urgency.LOW
    reason: str = Field(max_length=400, default="")
    deadline_date: date | None = None
    evidence: SourceSpan | None = None


class ProfessionalHelp(BaseModel):
    recommended: bool = False
    reason: str | None = None
    pathways: list[str] = Field(default_factory=list)


class SafetyFlags(BaseModel):
    is_high_risk: bool = False
    high_risk_category: str | None = None
    involves_minor: bool = False
    refused_requests: list[str] = Field(default_factory=list)


class Conflict(BaseModel):
    id: str = "conflict-id"
    description: str = ""
    spans: list[SourceSpan] = Field(default_factory=list)
    note: str = "These parts appear to conflict. Worth checking with a professional."


class SourceMetadata(BaseModel):
    page_count: int = 1
    ocr_used: bool = False
    ocr_confidence: float | None = None
    extraction_char_count: int = 0
    dropped_item_count: int = 0
    model_version: str = "mock"
    prompt_version: str = "v1.0"


class DeterministicFacts(BaseModel):
    amounts: list[dict] = Field(default_factory=list)
    dates: list[dict] = Field(default_factory=list)
    percentages: list[dict] = Field(default_factory=list)
    notice_periods: list[str] = Field(default_factory=list)


class CharacterizationResult(BaseModel):
    document_type: str = "Residential Rental Agreement"
    is_legal_document: bool = True
    confidence: float = 0.9
    reason: str = ""


class AnalysisResponse(BaseModel):
    document_id: str = "doc-id"
    language: str = "en"
    document_type: str = "Residential Tenancy Document"
    type_confidence: float = 0.95
    summary: str = ""
    urgency: UrgencyAssessment
    what_this_is: AnalysisItem | None = None
    obligations: list[Obligation] = Field(default_factory=list)
    risks: list[Risk] = Field(default_factory=list)
    money_items: list[MoneyItem] = Field(default_factory=list)
    deadlines: list[Deadline] = Field(default_factory=list)
    questions: list[Question] = Field(default_factory=list)
    next_steps: list[NextStep] = Field(default_factory=list)
    uncertainty: list[str] = Field(default_factory=list)
    conflicts: list[Conflict] = Field(default_factory=list)
    professional_help: ProfessionalHelp = Field(default_factory=ProfessionalHelp)
    safety: SafetyFlags = Field(default_factory=SafetyFlags)
    source_metadata: SourceMetadata = Field(default_factory=SourceMetadata)
    delete_after: datetime | None = None
    disclaimer: str = (
        "Samjo gives legal information to help you understand your document and prepare. "
        "It is not legal advice and not a substitute for a lawyer."
    )
