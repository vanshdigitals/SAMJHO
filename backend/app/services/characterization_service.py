from backend.app.core.errors import SamjoError
from backend.app.core.logging import get_logger
from backend.app.prompts import CHARACTERIZATION_SYSTEM_PROMPT
from backend.app.schemas.ai import CharacterizationResult
from backend.app.services.llm.base import LLMProvider

logger = get_logger("samjo.characterization")


class CharacterizationService:
    """
    Runs quick classification on the first 2,000 characters of the document.
    Rejects non-legal uploads BEFORE invoking the expensive analysis stage.
    """

    SYSTEM_PROMPT = CHARACTERIZATION_SYSTEM_PROMPT

    async def characterize(
        self,
        llm: LLMProvider,
        extracted_text: str,
    ) -> CharacterizationResult:
        first_2000 = extracted_text[:2000].strip()

        try:
            result = await llm.generate_structured_output(
                system_instructions=self.SYSTEM_PROMPT,
                untrusted_input=first_2000,
                schema=CharacterizationResult,
            )
        except SamjoError:
            # A provider failure means Samjo does not know what this document
            # is. Substituting "Residential Rental Agreement" here would put a
            # fabricated document type on the reader's briefing, which is the
            # one thing this product must never do. Let it surface as a typed
            # failure instead.
            raise
        except Exception as e:
            logger.warning(
                "Characterization failed",
                extra={"extra_data": {"event": "characterization_error", "error": type(e).__name__}},
            )
            # Non-provider failure (offline fixtures, parsing edge cases):
            # proceed with a low-confidence, clearly-marked classification
            # rather than blocking the pipeline.
            result = CharacterizationResult(
                document_type="Unclassified document",
                is_legal_document=True,
                confidence=0.0,
                reason="Samjo could not classify this document.",
            )

        if not result.is_legal_document:
            raise SamjoError.not_legal_document(
                f"Document does not appear to be a rental agreement or housing notice. {result.reason}"
            )

        return result


characterization_service = CharacterizationService()
