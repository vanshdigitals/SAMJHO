import re
from datetime import date, timedelta

from backend.app.core.config import settings
from backend.app.schemas.ai import (
    AnalysisResponse,
    DeterministicFacts,
    SafetyFlags,
    Urgency,
)


class SafetyService:
    """
    Enforces the AI Safety boundary and validation gates 3 & 4:
    - Gate 3: Safety enforcement, statute stripping, high-risk detection, refusal checks
    - Gate 4: Deterministic reconciliation (parser wins, needs_verification flags)
    - Confidence mapping (>=0.85 High, 0.65-0.85 Medium, <0.65 Low + forced needs_verification)
    """

    STATUTE_PATTERNS = [
        re.compile(r"\bsection\s+\d+[a-zA-Z]*(?:\s+of\s+the\s+[A-Za-z\s]+Act)?\b", re.IGNORECASE),
        re.compile(r"\b(?:transfer\s+of\s+property\s+act|rent\s+control\s+act|ipc|crpc|cpc|indian\s+penal\s+code)\b", re.IGNORECASE),
        re.compile(r"\b\d+\s+scc\s+\d+\b", re.IGNORECASE),
        re.compile(r"\bair\s+\d{4}\s+[a-zA-Z]+\s+\d+\b", re.IGNORECASE),
    ]

    HIGH_RISK_KEYWORDS = {
        "eviction": ["evict", "eviction", "vacate within", "possession of premises", "quit notice"],
        "court_summons": ["summons", "warrant", "subpoena", "appear before the court", "court of the civil judge"],
        "criminal": ["police complaint", "fir", "cognizable", "penal code", "criminal"],
        "minor": ["minor", "child", "under 18", "guardian"],
    }

    def sanitize_statutes_and_case_law(self, text: str, document_text: str) -> str:
        """
        Strips or neutralizes assertions about statutes or case law not found in the original document.
        """
        if not text:
            return ""

        sanitized = text
        for pat in self.STATUTE_PATTERNS:
            for match in pat.finditer(text):
                matched_str = match.group(0)
                # If the matched statutory citation is NOT present in the extracted document, strip it
                if matched_str.lower() not in document_text.lower():
                    sanitized = sanitized.replace(
                        matched_str, "applicable general legal rules"
                    )
        return sanitized

    def apply_safety_and_reconciliation(
        self,
        analysis: AnalysisResponse,
        document_text: str,
        facts: DeterministicFacts,
        situation_context: str | None = None,
    ) -> AnalysisResponse:
        """
        Runs Gate 3 (Safety) and Gate 4 (Deterministic Reconciliation).
        """
        combined_text = (document_text + " " + (situation_context or "")).lower()

        # An item whose interpretation is empty after sanitisation is not a
        # three-state item any more. It is not dropped — the quote is real and
        # losing it would lose information the reader needs — but it is marked
        # for a professional to confirm rather than presented as settled.
        for group in (
            analysis.obligations,
            analysis.risks,
            analysis.money_items,
            analysis.deadlines,
        ):
            for entry in group:
                if not (entry.ai_interpretation or "").strip():
                    entry.needs_verification = True

        # Low-confidence OCR forces needs_verification across all items (PRD §9.2, §11)
        if (
            analysis.source_metadata
            and analysis.source_metadata.ocr_used
            and analysis.source_metadata.ocr_confidence is not None
            and analysis.source_metadata.ocr_confidence < settings.OCR_MIN_CONFIDENCE
        ):
            for group in (
                analysis.obligations,
                analysis.risks,
                analysis.money_items,
                analysis.deadlines,
            ):
                for entry in group:
                    entry.needs_verification = True

        # Authored strings are authored. The disclaimer is a fixed sentence from
        # AI_SCHEMAS.md, and `professional_help.pathways` is a curated list —
        # but both sit in the schema handed to the model, so the model is free
        # to write over them, and does. Overwriting them back is the only thing
        # that makes "verbatim" true.
        analysis.disclaimer = (
            "Samjo gives legal information to help you understand your document and prepare. "
            "It is not legal advice and not a substitute for a lawyer."
        )
        analysis.professional_help.pathways = []

        # ---------------- Gate 3: Safety Enforcement ---------------- #
        # 1. Ensure next_steps NEVER has is_advice = True
        for step in analysis.next_steps:
            step.is_advice = False

        # 2. Strip external statute assertions
        analysis.summary = self.sanitize_statutes_and_case_law(analysis.summary, document_text)
        analysis.urgency.reason = self.sanitize_statutes_and_case_law(analysis.urgency.reason, document_text)

        for ob in analysis.obligations:
            ob.ai_interpretation = self.sanitize_statutes_and_case_law(ob.ai_interpretation, document_text)
            self._apply_confidence_rules(ob)

        for rk in analysis.risks:
            rk.ai_interpretation = self.sanitize_statutes_and_case_law(rk.ai_interpretation, document_text)
            rk.why_it_matters = self.sanitize_statutes_and_case_law(rk.why_it_matters, document_text)
            self._apply_confidence_rules(rk)

        for q in analysis.questions:
            q.text = self.sanitize_statutes_and_case_law(q.text, document_text)
            q.rationale = self.sanitize_statutes_and_case_law(q.rationale, document_text)

        # 3. High-Risk Detection
        is_high_risk = False
        high_risk_cat: str | None = None
        involves_minor = False

        # Check for eviction, court summons, criminal, minor
        for cat, keywords in self.HIGH_RISK_KEYWORDS.items():
            if any(kw in combined_text for kw in keywords):
                is_high_risk = True
                high_risk_cat = cat
                if cat == "minor":
                    involves_minor = True
                break

        # Check for urgent deadlines (< 7 days)
        today = date.today()
        seven_days_from_now = today + timedelta(days=7)

        for dl in analysis.deadlines:
            if dl.resolved_date and today <= dl.resolved_date <= seven_days_from_now:
                is_high_risk = True
                if not high_risk_cat:
                    high_risk_cat = "urgent_deadline"

        # Update safety flags
        analysis.safety = SafetyFlags(
            is_high_risk=is_high_risk,
            high_risk_category=high_risk_cat,
            involves_minor=involves_minor,
            refused_requests=analysis.safety.refused_requests if analysis.safety else [],
        )

        # High-risk escalations
        if is_high_risk:
            analysis.professional_help.recommended = True
            if high_risk_cat == "eviction":
                analysis.professional_help.reason = (
                    "This document involves eviction or notice to vacate. Immediate legal advice is strongly recommended."
                )
                analysis.professional_help.pathways = [
                    "Consult a tenant rights advocate or local civil lawyer immediately",
                    "Verify the statutory notice period required in your jurisdiction",
                ]
            elif high_risk_cat == "court_summons":
                analysis.professional_help.reason = (
                    "This appears to be a court summons or official proceeding. Consult an advocate to prepare an appearance or response."
                )
                analysis.professional_help.pathways = [
                    "Engage a qualified advocate to examine the court docket",
                    "Never ignore a formal court summons or proceeding",
                ]
            elif high_risk_cat == "minor":
                analysis.professional_help.reason = (
                    "This matter concerns or mentions a minor. A parent, guardian, or trusted adult should be directly involved."
                )
                analysis.professional_help.pathways = [
                    "Involve a parent or legal guardian immediately",
                    "Consult a family or civil advocate",
                ]
            else:
                analysis.professional_help.reason = (
                    "This document contains high-urgency timelines or significant legal consequences. Professional consultation recommended."
                )
                analysis.professional_help.pathways = [
                    "Consult an independent lawyer or legal aid clinic",
                ]

            if analysis.urgency.level in [Urgency.LOW, Urgency.MEDIUM]:
                analysis.urgency.level = Urgency.HIGH

        # ---------------- Gate 4: Deterministic Reconciliation ---------------- #
        # Reconcile Money Items
        for item in analysis.money_items:
            item.ai_interpretation = self.sanitize_statutes_and_case_law(item.ai_interpretation, document_text)
            self._apply_confidence_rules(item)

            # Match with extracted facts
            matched_amount = self._match_currency_amount(item.amount_text, facts.amounts)
            if matched_amount is not None:
                if item.amount_value is not None and abs(item.amount_value - matched_amount) > 0.01:
                    # Parser wins!
                    item.amount_value = matched_amount
                    item.needs_verification = True
                else:
                    item.amount_value = matched_amount

        # Reconcile Deadlines
        for dl in analysis.deadlines:
            dl.ai_interpretation = self.sanitize_statutes_and_case_law(dl.ai_interpretation, document_text)
            # Every deadline carries needs_verification regardless
            dl.needs_verification = True

            matched_date = self._match_date(dl.date_text, facts.dates)
            if matched_date:
                try:
                    iso_date = date.fromisoformat(matched_date)
                    if dl.resolved_date and dl.resolved_date != iso_date:
                        # Parser wins!
                        dl.resolved_date = iso_date
                        dl.needs_verification = True
                    else:
                        dl.resolved_date = iso_date
                except ValueError:
                    pass

        return analysis

    def _apply_confidence_rules(self, item) -> None:
        """
        Confidence < 0.65 forces needs_verification = True.
        """
        if item.confidence < 0.65:
            item.needs_verification = True

    def _match_currency_amount(self, text: str, parsed_amounts: list[dict]) -> float | None:
        if not text or not parsed_amounts:
            return None
        clean_text = text.replace(",", "").replace("/-", "").strip().lower()
        for amt in parsed_amounts:
            val_str = str(int(amt["value"])) if amt["value"].is_integer() else str(amt["value"])
            if val_str in clean_text or amt["raw"].lower() in text.lower():
                return float(amt["value"])
        # If single amount in facts and text is generic, consider first
        if len(parsed_amounts) == 1:
            return float(parsed_amounts[0]["value"])
        return None

    def _match_date(self, text: str, parsed_dates: list[dict]) -> str | None:
        if not text or not parsed_dates:
            return None
        text_lower = text.lower()
        for d in parsed_dates:
            if d["raw"].lower() in text_lower or d["iso"] in text_lower:
                return d["iso"]
        return None


safety_service = SafetyService()
