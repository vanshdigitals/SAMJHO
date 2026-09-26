import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.errors import SamjoError
from backend.app.core.logging import get_logger
from backend.app.core.security import decrypt_bytes, encrypt_bytes
from backend.app.models.entities import AuditEventModel, SituationModel
from backend.app.schemas.api import (
    ClarifyingQuestion,
    SituationAnalyzeResponse,
    SituationAnswerRequest,
    SituationCreateRequest,
    SituationCreateResponse,
)
from backend.app.services.llm.factory import get_llm_provider

logger = get_logger("samjo.situation")


class SituationLLMOutput(BaseModel):
    characterization: dict[str, Any] = Field(
        default_factory=lambda: {"summary": "Residential housing situation orientation.", "confidence": 0.75}
    )
    what_we_know: list[str] = Field(default_factory=list)
    what_is_missing: list[str] = Field(default_factory=list)
    possible_next_steps: list[dict[str, Any]] = Field(default_factory=list)
    questions_for_professional: list[str] = Field(default_factory=list)
    professional_help: dict[str, Any] = Field(
        default_factory=lambda: {
            "recommended": True,
            "reason": "Verbal or informal disputes benefit from legal clarity before escalating.",
        }
    )


class SituationService:
    """
    Handles situation-first intake.
    CRITICAL CONTRACT RULE:
    A situation with no document produces NO obligations, NO deadlines, and NO money items.
    The response schema structurally omits them.
    """

    DEFAULT_QUESTIONS_EN = [
        ClarifyingQuestion(
            id="q1",
            question="Do you have a written rental agreement, or was your arrangement verbal?",
        ),
        ClarifyingQuestion(
            id="q2",
            question="Has the landlord or tenant given any written notice, email, or message with a deadline?",
        ),
        ClarifyingQuestion(
            id="q3",
            question="Is there a security deposit involved, and what is its status?",
        ),
        ClarifyingQuestion(
            id="q4",
            question="Has anyone threatened eviction, police intervention, or formal legal action?",
        ),
    ]

    DEFAULT_QUESTIONS_HI = [
        ClarifyingQuestion(
            id="q1",
            question="क्या आपके पास लिखित किराया समझौता है, या यह मौखिक बातचीत थी?",
        ),
        ClarifyingQuestion(
            id="q2",
            question="क्या मकान मालिक या किरायेदार ने कोई लिखित नोटिस, ईमेल या संदेश भेजा है?",
        ),
        ClarifyingQuestion(
            id="q3",
            question="क्या सुरक्षा राशि (सिक्योरिटी डिपॉजिट) का कोई विवाद है?",
        ),
        ClarifyingQuestion(
            id="q4",
            question="क्या किसी ने बेदखली या कानूनी कार्रवाई की चेतावनी दी है?",
        ),
    ]

    async def create_situation(
        self,
        db: Session,
        session_id: uuid.UUID,
        req: SituationCreateRequest,
    ) -> SituationCreateResponse:
        sit_id = uuid.uuid4()
        now = datetime.now(timezone.utc)

        # Encrypt situation description with Fernet
        encrypted_desc = encrypt_bytes(req.description.encode("utf-8"))

        delete_after = now + timedelta(hours=settings.SESSION_TTL_HOURS)
        situation = SituationModel(
            id=sit_id,
            session_id=session_id,
            description_encrypted=encrypted_desc,
            language=req.language,
            delete_after=delete_after,
            created_at=now,
        )
        db.add(situation)

        audit = AuditEventModel(
            id=uuid.uuid4(),
            session_id=session_id,
            event_type="situation_created",
            created_at=now,
        )
        db.add(audit)
        db.commit()

        questions = self.DEFAULT_QUESTIONS_HI if req.language == "hi" else self.DEFAULT_QUESTIONS_EN
        return SituationCreateResponse(
            situation_id=str(sit_id),
            clarifying_questions=questions,
        )

    async def analyze_situation(
        self,
        db: Session,
        situation_id: uuid.UUID,
        session_id: uuid.UUID,
        req: SituationAnswerRequest,
    ) -> SituationAnalyzeResponse:
        # Ownership check: return 404 NOT FOUND (never 403)
        stmt = select(SituationModel).where(SituationModel.id == situation_id)
        situation = db.execute(stmt).scalar_one_or_none()
        if not situation or situation.session_id != session_id:
            raise SamjoError.not_found("Situation not found.")

        # Decrypt description
        desc_bytes = decrypt_bytes(situation.description_encrypted)
        description = desc_bytes.decode("utf-8")

        # Combine description and answers
        answers_summary = "\n".join(
            [f"- {a.question_id}: {a.answer}" for a in req.answers if a.answer.strip()]
        )

        llm = get_llm_provider()

        system_prompt = """
You are SAMJO, an India-first legal information orientation assistant for housing situations.
The user has provided a situation description and answers to clarifying questions, but NO document.

Provide an orientation briefing strictly adhering to:
1. Characterization: summary and confidence (0.0 to 1.0)
2. What we know: key factual points described by the user
3. What is missing: critical missing information or documents needed to understand rights
4. Possible next steps: practical, non-advice steps (type: information | prepare | see_professional)
5. Questions for professional: list of specific questions to ask a lawyer
6. Professional help: whether recommended (true/false) and why

CRITICAL RULES:
- NEVER give legal advice or predict outcomes.
- NEVER invent obligations, deadlines, or money claims.
"""

        prompt = f"User situation description:\n{description}\n\nUser answers:\n{answers_summary}"

        try:
            # We request structured JSON from LLM
            output = await llm.generate_structured_output(
                system_instructions=system_prompt,
                untrusted_input=prompt,
                schema=SituationLLMOutput,
            )
            return SituationAnalyzeResponse(
                situation_id=str(situation_id),
                characterization=output.characterization,
                what_we_know=output.what_we_know if output.what_we_know else [description[:100]],
                what_is_missing=(
                    output.what_is_missing
                    if output.what_is_missing
                    else ["Written agreement clauses", "Specific dates of formal notice"]
                ),
                possible_next_steps=(
                    output.possible_next_steps
                    if output.possible_next_steps
                    else [
                        {"step": "Collect all payment receipts and bank records", "type": "prepare"},
                        {"step": "Keep copies of all communication in writing", "type": "prepare"},
                    ]
                ),
                questions_for_professional=(
                    output.questions_for_professional
                    if output.questions_for_professional
                    else ["What is the standard notice period in this jurisdiction without a written lease?"]
                ),
                professional_help=output.professional_help,
                disclaimer=(
                    "Samjo provides legal information to help you understand your situation. "
                    "It is not legal advice and does not substitute for a lawyer."
                ),
            )
        except Exception:
            pass

        # Robust structured fallback response
        return SituationAnalyzeResponse(
            situation_id=str(situation_id),
            characterization={
                "summary": "Residential tenancy or housing query based on user-provided situation.",
                "confidence": 0.70,
            },
            what_we_know=[
                "User reported an ongoing tenancy matter without an uploaded document.",
                f"Core concern: {description[:120]}...",
            ],
            what_is_missing=[
                "Exact written rental agreement terms",
                "Formal written notice dates and documented receipts",
            ],
            possible_next_steps=[
                {
                    "step": "Gather any existing rent receipts, bank transaction statements, and messages",
                    "type": "prepare",
                },
                {
                    "step": "Keep all further discussions with the other party in writing",
                    "type": "prepare",
                },
                {
                    "step": "Consult a local legal aid clinic or civil advocate for specific jurisdiction advice",
                    "type": "see_professional",
                },
            ],
            questions_for_professional=[
                "What protections apply to verbal or unwritten tenancies in this city?",
                "What is the required notice period before demanding premises be vacated?",
            ],
            professional_help={
                "recommended": True,
                "reason": "Housing disputes without formal contracts depend heavily on local statutory tenancies and civil procedure.",
            },
            disclaimer=(
                "Samjo provides legal information to help you understand your situation. "
                "It is not legal advice and does not substitute for a lawyer."
            ),
        )


situation_service = SituationService()
