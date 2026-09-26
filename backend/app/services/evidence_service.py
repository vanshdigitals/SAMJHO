import re
import uuid

from backend.app.schemas.ai import SourceSpan


class EvidenceVerificationService:
    """
    Verifies quotes against extracted document text with strict adherence to safety rules:
    - Rule 1: Exact match first.
    - Rule 2: Normalised match (whitespace and quote characters only).
    - Rule 3: STRICTLY NO FUZZY MATCHING.
    - Rule 4: If quote is not found, verification fails and the item is dropped.
    """

    QUOTE_CHAR_MAP = {
        ord("“"): '"',
        ord("”"): '"',
        ord("„"): '"',
        ord("«"): '"',
        ord("»"): '"',
        ord("‘"): "'",
        ord("’"): "'",
        ord("`"): "'",
        ord("–"): "-",
        ord("—"): "-",
    }

    def verify_span(
        self,
        quoted_text: str,
        document_text: str,
        pages_metadata: list[dict] | None = None,
    ) -> tuple[bool, SourceSpan | None]:
        """
        Attempts to verify quoted_text in document_text.
        Returns (is_verified, updated_source_span_or_none).
        """
        if not quoted_text or not quoted_text.strip() or not document_text:
            return False, None

        raw_quote = quoted_text.strip()

        # Gate 1: Exact match
        idx = document_text.find(raw_quote)
        if idx != -1:
            start_offset = idx
            end_offset = idx + len(raw_quote)
            page_number = self._find_page_number(start_offset, pages_metadata)
            return True, SourceSpan(
                source_id=str(uuid.uuid4()),
                page=page_number,
                start_offset=start_offset,
                end_offset=end_offset,
                quoted_text=raw_quote,
                verified=True,
            )

        # Gate 2: Normalised match (whitespace & quotes only)
        # We build a regex from the normalized words of raw_quote
        normalized_quote = self._normalize_chars(raw_quote)
        words = re.split(r"\s+", normalized_quote)
        if not words or all(not w for w in words):
            return False, None

        # Build regex matching these words separated by any whitespace or newline
        escaped_words = [re.escape(w) for w in words if w]
        pattern_str = r"\s+".join(escaped_words)

        # Also normalize document text for matching
        norm_doc = self._normalize_chars(document_text)
        match = re.search(pattern_str, norm_doc, flags=re.IGNORECASE)
        if match:
            start_offset = match.start()
            end_offset = match.end()
            # Extract actual text from original document at these offsets
            actual_quote = document_text[start_offset:end_offset]
            page_number = self._find_page_number(start_offset, pages_metadata)
            return True, SourceSpan(
                source_id=str(uuid.uuid4()),
                page=page_number,
                start_offset=start_offset,
                end_offset=end_offset,
                quoted_text=actual_quote,
                verified=True,
            )

        # Gate 3: NO FUZZY MATCHING. Failed verification.
        return False, None

    def get_bounded_context(
        self,
        document_text: str,
        start_offset: int,
        end_offset: int,
        radius: int = 150,
    ) -> str:
        """
        Returns a bounded context window around [start_offset, end_offset].
        Caps context to radius before and radius after.
        """
        if not document_text:
            return ""

        doc_len = len(document_text)
        start_offset = max(0, min(start_offset, doc_len))
        end_offset = max(start_offset, min(end_offset, doc_len))

        ctx_start = max(0, start_offset - radius)
        ctx_end = min(doc_len, end_offset + radius)

        # Prepend / append ellipsis if truncated
        prefix = "..." if ctx_start > 0 else ""
        suffix = "..." if ctx_end < doc_len else ""

        snippet = document_text[ctx_start:ctx_end]
        return f"{prefix}{snippet}{suffix}"

    def _normalize_chars(self, text: str) -> str:
        """Replace typographic quotes and hyphens."""
        return text.translate(self.QUOTE_CHAR_MAP)

    def _find_page_number(
        self,
        offset: int,
        pages_metadata: list[dict] | None,
    ) -> int:
        if not pages_metadata:
            return 1
        for page in pages_metadata:
            start = page.get("char_start", 0)
            end = page.get("char_end", 0)
            if start <= offset <= end:
                return page.get("page_number", 1)
        return 1


evidence_service = EvidenceVerificationService()
