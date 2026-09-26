from typing import Any, TypeVar

import anthropic
from pydantic import BaseModel

from ...core.config import settings
from ...core.errors import RateLimitedError, SchemaInvalidError
from ...schemas.ai import DeterministicFacts
from .base import LLMProvider, ProviderHealth

T = TypeVar("T", bound=BaseModel)


class ClaudeProvider(LLMProvider):
    """Fallback LLM provider using Anthropic Claude Sonnet 5 (RESOURCE_AUDIT §19)."""

    def __init__(self, api_key: str = "", model_name: str = ""):
        effective_key = api_key or settings.LLM_FALLBACK_API_KEY or settings.LLM_API_KEY
        self.client = anthropic.AsyncAnthropic(api_key=effective_key) if effective_key else None
        self.model_name = model_name or settings.LLM_FALLBACK_MODEL

    @property
    def model_id(self) -> str:
        return f"claude:{self.model_name}"

    async def health_check(self) -> ProviderHealth:
        if not self.client:
            return ProviderHealth(provider="claude", status="missing_key")
        return ProviderHealth(provider="claude", status="configured")

    async def analyze(
        self,
        *,
        system_instructions: str,
        untrusted_document: str,
        known_facts: DeterministicFacts,
        schema: type[T],
    ) -> T:
        if not self.client:
            raise SchemaInvalidError("Claude fallback API key is not configured.")

        # Use tool-use pattern for structured JSON output
        tool_name = "emit_briefing"
        tool_def = {
            "name": tool_name,
            "description": "Emit structured legal briefing matching schema",
            "input_schema": schema.model_json_schema(),
        }

        user_content = f"""
Known Verified Facts:
- Currency amounts: {known_facts.amounts}
- Dates: {known_facts.dates}
- Notice periods: {known_facts.notice_periods}

--- BEGIN UNTRUSTED DOCUMENT CONTENT ---
{untrusted_document}
--- END UNTRUSTED DOCUMENT CONTENT ---
"""

        client_messages: Any = self.client.messages
        try:
            response = await client_messages.create(
                model=self.model_name,
                max_tokens=settings.LLM_MAX_OUTPUT_TOKENS,
                system=system_instructions,
                messages=[{"role": "user", "content": user_content}],
                tools=[tool_def],
                tool_choice={"type": "tool", "name": tool_name},
                temperature=settings.LLM_TEMPERATURE,
            )

            for block in response.content:
                if block.type == "tool_use" and block.name == tool_name:
                    return schema.model_validate(block.input)

            raise SchemaInvalidError("Claude did not return required structured tool call.")
        except anthropic.RateLimitError:
            raise RateLimitedError("Claude rate limit exceeded.")
        except Exception as e:
            raise SchemaInvalidError(f"Claude analysis failed: {e!s}")

    async def generate_structured_output(
        self,
        *,
        system_instructions: str,
        untrusted_input: str,
        schema: type[T],
    ) -> T:
        if not self.client:
            raise SchemaInvalidError("Claude fallback API key is not configured.")

        tool_name = "emit_structured_output"
        tool_def = {
            "name": tool_name,
            "description": "Emit structured output matching schema",
            "input_schema": schema.model_json_schema(),
        }

        client_messages: Any = self.client.messages
        try:
            response = await client_messages.create(
                model=self.model_name,
                max_tokens=2000,
                system=system_instructions,
                messages=[{"role": "user", "content": untrusted_input}],
                tools=[tool_def],
                tool_choice={"type": "tool", "name": tool_name},
                temperature=0.0,
            )

            for block in response.content:
                if block.type == "tool_use" and block.name == tool_name:
                    return schema.model_validate(block.input)

            raise SchemaInvalidError("Claude did not return structured output.")
        except anthropic.RateLimitError:
            raise RateLimitedError("Claude rate limit exceeded.")
        except Exception as e:
            raise SchemaInvalidError(f"Claude structured output failed: {e!s}")
