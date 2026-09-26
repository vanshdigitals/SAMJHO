import asyncio
import logging
import random
import time
from typing import Any, TypeVar

from google import genai
from google.genai import types
from google.genai.errors import APIError
from pydantic import BaseModel, ValidationError

from ...core.config import settings
from ...core.errors import (
    ProviderTimeoutError,
    ProviderUnavailableError,
    QuotaExhaustedError,
    RateLimitedError,
    SchemaInvalidError,
)
from ...schemas.ai import DeterministicFacts
from .base import LLMProvider, ProviderHealth

logger = logging.getLogger("samjo.llm.gemini")

T = TypeVar("T", bound=BaseModel)

# Transport-level retries are separate from the schema retry budget. A model
# that answered badly and a provider that did not answer at all are different
# failures and are not allowed to share a budget (RESOURCE_AUDIT §22).
MAX_TRANSPORT_ATTEMPTS = 3
BASE_BACKOFF_SECONDS = 1.5
MAX_BACKOFF_SECONDS = 8.0

_RETRYABLE_STATUS = {500, 502, 503, 504}


def _violation_details(err: APIError) -> list[dict[str, Any]]:
    """The provider's structured error details, wherever the SDK put them."""
    raw: Any = getattr(err, "details", None) or {}
    if isinstance(raw, dict):
        inner = raw.get("error", raw)
        if isinstance(inner, dict):
            items = inner.get("details")
            if isinstance(items, list):
                return [i for i in items if isinstance(i, dict)]
    return []


def _retry_after_seconds(err: APIError) -> float | None:
    """Honour the provider's own advice when it gives any."""
    for item in _violation_details(err):
        delay = item.get("retryDelay")
        if isinstance(delay, str) and delay.endswith("s"):
            try:
                return float(delay[:-1])
            except ValueError:
                return None
    return None


def _is_daily_quota(err: APIError) -> bool:
    """Tell a per-day allowance apart from a per-minute rate limit.

    Both arrive as 429. Only one of them clears if you wait a moment, so
    telling someone to "try again in a minute" when the day's allowance is
    gone is simply false. Google names the metric in the QuotaFailure detail,
    which is the only reliable signal — the message text mentions both "quota"
    and a rate-limits URL, so matching on words gets it wrong.
    """
    for item in _violation_details(err):
        for violation in item.get("violations", []) or []:
            quota_id = str(violation.get("quotaId", ""))
            if "PerDay" in quota_id:
                return True
    return False


def _backoff(attempt: int, hinted: float | None) -> float:
    if hinted is not None:
        return min(hinted, MAX_BACKOFF_SECONDS)
    # Full jitter, so concurrent jobs do not retry in lockstep.
    ceiling = min(BASE_BACKOFF_SECONDS * (2**attempt), MAX_BACKOFF_SECONDS)
    return random.uniform(BASE_BACKOFF_SECONDS / 2, ceiling)


class GeminiProvider(LLMProvider):
    """Primary provider: Gemini 3.8 Flash via google-genai.

    Two things this class is careful about.

    Error classification. The provider's failure modes are not
    interchangeable: a 429 means wait, a 503 means the model is overloaded, a
    400 means the request will never work, and a schema violation means the
    model answered and the answer did not fit the contract. Collapsing these
    into one error tells the reader to retry something that cannot succeed, or
    to abandon something that would have worked a minute later.

    Message hygiene. The provider's own error strings never reach the reader.
    They are logged as a status code and an exception type — both on the log
    allowlist — and the reader gets the approved copy from UX_FLOWS §6.
    """

    def __init__(self, api_key: str = "", model_name: str = ""):
        effective_key = api_key or settings.LLM_API_KEY
        # The key is held by the client and never logged, echoed or serialised.
        self.client = genai.Client(api_key=effective_key) if effective_key else None
        self.model_name = model_name or settings.LLM_MODEL

    @property
    def model_id(self) -> str:
        return f"gemini:{self.model_name}"

    # ── transport ────────────────────────────────────────────────────────
    async def _generate(self, *, model: str, contents: str, config: Any) -> Any:
        """One model call, with bounded retries on transient transport failures.

        Never retries a permanent 4xx, and never retries more than
        MAX_TRANSPORT_ATTEMPTS times, so a provider outage cannot turn into a
        retry storm against an already-struggling endpoint.
        """
        if not self.client:
            raise ProviderUnavailableError()

        last_status: int | None = None

        for attempt in range(MAX_TRANSPORT_ATTEMPTS):
            try:
                return await asyncio.wait_for(
                    self.client.aio.models.generate_content(
                        model=model, contents=contents, config=config
                    ),
                    timeout=settings.LLM_TIMEOUT_SECONDS,
                )

            except asyncio.TimeoutError:
                logger.warning(
                    "Provider call timed out",
                    extra={"model_name": model, "error_code": "AI_TIMEOUT", "timeout": settings.LLM_TIMEOUT_SECONDS},
                )
                raise ProviderTimeoutError() from None

            except APIError as err:
                status = getattr(err, "code", None)
                last_status = status

                # Quota is not a rate limit. One clears on its own; the other
                # does not, and telling someone to "try again in a minute" when
                # the daily allowance is gone is simply false.
                if status == 429:
                    if _is_daily_quota(err):
                        logger.warning(
                            "Provider quota exhausted",
                            extra={"model_name": model, "error_code": "QUOTA_EXHAUSTED", "status_code": 429},
                        )
                        raise QuotaExhaustedError() from None

                    if attempt + 1 < MAX_TRANSPORT_ATTEMPTS:
                        delay = _backoff(attempt, _retry_after_seconds(err))
                        logger.info(
                            "Provider rate limited, backing off",
                            extra={"model_name": model, "error_code": "RATE_LIMITED", "status_code": 429},
                        )
                        await asyncio.sleep(delay)
                        continue
                    raise RateLimitedError() from None

                if status in _RETRYABLE_STATUS:
                    if attempt + 1 < MAX_TRANSPORT_ATTEMPTS:
                        delay = _backoff(attempt, _retry_after_seconds(err))
                        logger.info(
                            "Provider unavailable, backing off",
                            extra={"model_name": model, "error_code": "AI_UNAVAILABLE", "status_code": status},
                        )
                        await asyncio.sleep(delay)
                        continue
                    logger.warning(
                        "Provider unavailable after retries",
                        extra={"model_name": model, "error_code": "AI_UNAVAILABLE", "status_code": status},
                    )
                    raise ProviderUnavailableError() from None

                # Permanent: a malformed request, a rejected schema, a bad key.
                # Retrying cannot change the outcome, so it is not retried.
                logger.error(
                    "Provider rejected the request",
                    extra={"model_name": model, "error_code": "SCHEMA_INVALID", "status_code": status},
                )
                raise SchemaInvalidError() from None

            except (ProviderTimeoutError, ProviderUnavailableError, RateLimitedError, QuotaExhaustedError):
                raise

            except Exception as exc:  # transport-level, not an API response
                if attempt + 1 < MAX_TRANSPORT_ATTEMPTS:
                    await asyncio.sleep(_backoff(attempt, None))
                    continue
                logger.warning(
                    "Provider call failed",
                    extra={"model_name": model, "error_code": "AI_UNAVAILABLE", "error_type": type(exc).__name__},
                )
                raise ProviderUnavailableError() from None

        logger.warning(
            "Provider exhausted transport attempts",
            extra={"model_name": model, "error_code": "AI_UNAVAILABLE", "status_code": last_status},
        )
        raise ProviderUnavailableError()

    # ── health ───────────────────────────────────────────────────────────
    async def health_check(self) -> ProviderHealth:
        if not self.client:
            return ProviderHealth(provider="gemini", status="missing_key")
        try:
            start = time.time()
            await asyncio.wait_for(
                self.client.aio.models.generate_content(
                    model=self.model_name,
                    contents="ping",
                    config=types.GenerateContentConfig(max_output_tokens=8, temperature=0.0),
                ),
                timeout=20,
            )
            return ProviderHealth(
                provider="gemini", status="ok", latency_ms=(time.time() - start) * 1000.0
            )
        except Exception as exc:
            # The provider's message is not returned; only its class.
            return ProviderHealth(provider="gemini", status=f"error:{type(exc).__name__}")

    # ── analysis ─────────────────────────────────────────────────────────
    async def analyze(
        self,
        *,
        system_instructions: str,
        untrusted_document: str,
        known_facts: DeterministicFacts,
        schema: type[T],
    ) -> T:
        if not self.client:
            raise ProviderUnavailableError()

        facts_summary = (
            "Known Verified Facts (Parsed Deterministically):\n"
            f"- Currency amounts: {known_facts.amounts}\n"
            f"- Dates: {known_facts.dates}\n"
            f"- Notice periods: {known_facts.notice_periods}\n"
        )

        # The document is fenced as data. It is carried in `contents`, never in
        # `system_instruction`, so an instruction inside the document is
        # content to analyse rather than an instruction to follow.
        prompt_content = (
            f"{facts_summary}\n"
            "<<<UNTRUSTED_DOCUMENT_CONTENT>>>\n"
            f"{untrusted_document}\n"
            "<<<END_UNTRUSTED_DOCUMENT_CONTENT>>>\n"
        )

        thinking_budget = 1024 if settings.LLM_THINKING_LEVEL == "low" else 2048
        config = types.GenerateContentConfig(
            system_instruction=system_instructions,
            response_mime_type="application/json",
            response_schema=schema,
            temperature=settings.LLM_TEMPERATURE,
            max_output_tokens=settings.LLM_MAX_OUTPUT_TOKENS,
            thinking_config=types.ThinkingConfig(thinking_budget=thinking_budget),
        )

        # The schema budget: one retry, then fail visibly (TRD §6). Transport
        # failures have already been handled and re-raised by _generate.
        for attempt in range(settings.LLM_MAX_RETRIES + 1):
            response = await self._generate(
                model=self.model_name, contents=prompt_content, config=config
            )
            text = getattr(response, "text", None)
            if not text:
                if attempt < settings.LLM_MAX_RETRIES:
                    continue
                logger.warning(
                    "Model returned no content",
                    extra={"model_name": self.model_name, "error_code": "SCHEMA_INVALID"},
                )
                raise SchemaInvalidError()
            try:
                return schema.model_validate_json(text)
            except ValidationError:
                if attempt < settings.LLM_MAX_RETRIES:
                    logger.info(
                        "Model output failed validation, retrying once",
                        extra={"model_name": self.model_name, "error_code": "SCHEMA_INVALID"},
                    )
                    continue
                # The invalid payload is NOT logged — it is derived from the document.
                logger.warning(
                    "Model output failed validation after retry",
                    extra={"model_name": self.model_name, "error_code": "SCHEMA_INVALID"},
                )
                raise SchemaInvalidError() from None

        raise SchemaInvalidError()

    # ── characterization and situation intake ────────────────────────────
    async def generate_structured_output(
        self,
        *,
        system_instructions: str,
        untrusted_input: str,
        schema: type[T],
    ) -> T:
        if not self.client:
            raise ProviderUnavailableError()

        prompt_content = (
            "--- BEGIN UNTRUSTED INPUT ---\n"
            f"{untrusted_input}\n"
            "--- END UNTRUSTED INPUT ---\n"
        )
        config = types.GenerateContentConfig(
            system_instruction=system_instructions,
            response_mime_type="application/json",
            response_schema=schema,
            temperature=0.0,
            max_output_tokens=2000,
        )
        model = settings.CHARACTERIZATION_MODEL or self.model_name

        response = await self._generate(model=model, contents=prompt_content, config=config)
        text = getattr(response, "text", None)
        if not text:
            logger.warning(
                "Model returned no content",
                extra={"model_name": model, "error_code": "SCHEMA_INVALID"},
            )
            raise SchemaInvalidError()
        try:
            return schema.model_validate_json(text)
        except ValidationError:
            logger.warning(
                "Structured output failed validation",
                extra={"model_name": model, "error_code": "SCHEMA_INVALID"},
            )
            raise SchemaInvalidError() from None
