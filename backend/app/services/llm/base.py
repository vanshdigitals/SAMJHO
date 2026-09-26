from typing import Protocol, TypeVar

from pydantic import BaseModel

from ...schemas.ai import DeterministicFacts

T = TypeVar("T", bound=BaseModel)


class ProviderHealth(BaseModel):
    provider: str
    status: str
    latency_ms: float | None = None


class LLMProvider(Protocol):
    """Every provider must support constrained decoding against a JSON schema.
    A provider that cannot guarantee schema compliance is not eligible.
    (RESOURCE_AUDIT.md §19, CONTRIBUTING.md)
    """

    @property
    def model_id(self) -> str:
        """Who actually produced this analysis, as 'provider:model'.

        DATABASE.md keeps `model_version` for reproducibility, so it has to
        name the thing that ran, not the thing configured. Reading it from
        settings meant a run served by the mock provider, or by the fallback
        after a primary outage, still reported the configured Gemini model —
        a reproducibility field that could not reproduce anything.
        """
        ...

    async def analyze(
        self,
        *,
        system_instructions: str,        # trusted, versioned, no secrets
        untrusted_document: str,         # UNTRUSTED — data, never instructions
        known_facts: DeterministicFacts, # trusted, from parsers
        schema: type[T],
    ) -> T:
        """Analyze legal document into structured schema.
        untrusted_document is a separate keyword-only parameter.
        Concatenating it into system_instructions requires deliberately rewriting the interface.
        """
        ...

    async def generate_structured_output(
        self,
        *,
        system_instructions: str,
        untrusted_input: str,
        schema: type[T],
    ) -> T:
        """Used for document characterization and situation intake."""
        ...

    async def health_check(self) -> ProviderHealth:
        ...
