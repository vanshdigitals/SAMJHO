
from backend.app.core.config import settings
from backend.app.services.llm.base import LLMProvider
from backend.app.services.llm.claude import ClaudeProvider
from backend.app.services.llm.gemini import GeminiProvider
from backend.app.services.llm.groq import GroqProvider
from backend.app.services.llm.mock import MockProvider


def get_llm_provider() -> LLMProvider:
    provider = settings.LLM_PROVIDER.lower()
    if provider == "groq":
        return GroqProvider(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
        )
    elif provider == "gemini":
        return GeminiProvider(
            api_key=settings.LLM_API_KEY,
            model_name=settings.LLM_MODEL,
        )
    elif provider == "claude":
        return ClaudeProvider(
            api_key=settings.LLM_API_KEY,
            model_name=settings.LLM_MODEL,
        )
    else:
        return MockProvider()


def get_fallback_llm_provider() -> LLMProvider | None:
    provider = settings.LLM_FALLBACK_PROVIDER.lower().strip()
    if not provider:
        return None
    if provider == "groq":
        return GroqProvider(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
        )
    if provider == "claude":
        return ClaudeProvider(
            api_key=settings.LLM_FALLBACK_API_KEY or settings.LLM_API_KEY,
            model_name=settings.LLM_FALLBACK_MODEL,
        )
    elif provider == "gemini":
        return GeminiProvider(
            api_key=settings.LLM_FALLBACK_API_KEY or settings.LLM_API_KEY,
            model_name=settings.LLM_MODEL,
        )
    return None
