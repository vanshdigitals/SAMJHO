import re
from typing import Any

from backend.app.schemas.ai import DeterministicFacts


class DeterministicFactExtractor:
    """
    Extracts structured, deterministic facts before LLM interpretation:
    - Currency amounts (Rs., INR, ₹ with Indian number grouping)
    - Dates (various Indian and international formats)
    - Percentages
    - Notice periods (days, months)
    """

    # Currency patterns matching:
    # ₹ 25,000 | Rs. 25,000/- | Rs 25000 | INR 2,50,000 | ₹2,50,000.00
    CURRENCY_REGEX = re.compile(
        r"(?:₹|Rs\.?|INR)\s*([0-9]{1,2}(?:,[0-9]{2})*(?:,[0-9]{3})(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(?:/-)?",
        re.IGNORECASE,
    )

    # Date patterns:
    # 01/05/2024, 01-05-2024, 2024-05-01, 1st May 2024, 15 August 2024
    DATE_REGEX_DMY = re.compile(
        r"\b([0-3]?[0-9])[/\-.]([0-1]?[0-9])[/\-.](20\d\d|19\d\d)\b"
    )
    DATE_REGEX_WORDS = re.compile(
        r"\b([0-3]?[0-9])(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d\d|19\d\d)\b",
        re.IGNORECASE,
    )
    DATE_REGEX_ISO = re.compile(
        r"\b(20\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b"
    )

    # Percentage patterns: 10%, 10.5 %, 5 percent
    PERCENT_REGEX = re.compile(
        r"\b([0-9]+(?:\.[0-9]+)?)\s*(?:%|percent)\b",
        re.IGNORECASE,
    )

    # Notice period patterns: 30 days, 1 month, 3 months, 60 days
    NOTICE_REGEX = re.compile(
        r"\b([0-9]+|one|two|three|six)\s*(days?|months?)\s+(?:prior\s+)?notice\b",
        re.IGNORECASE,
    )

    MONTH_MAP = {
        "january": "01", "february": "02", "march": "03", "april": "04",
        "may": "05", "june": "06", "july": "07", "august": "08",
        "september": "09", "october": "10", "november": "11", "december": "12"
    }

    WORD_TO_NUM = {
        "one": "1", "two": "2", "three": "3", "six": "6"
    }

    def extract(self, text: str) -> DeterministicFacts:
        amounts: list[dict[str, Any]] = []
        dates: list[dict[str, Any]] = []
        percentages: list[dict[str, Any]] = []
        notice_periods: list[str] = []

        # 1. Amounts
        for match in self.CURRENCY_REGEX.finditer(text):
            raw_str = match.group(0).strip()
            num_str = match.group(1).replace(",", "")
            try:
                val = float(num_str)
                amounts.append({
                    "raw": raw_str,
                    "value": val,
                    "currency": "INR",
                    "span": [match.start(), match.end()],
                })
            except ValueError:
                continue

        # 2. Dates
        # Check ISO
        for match in self.DATE_REGEX_ISO.finditer(text):
            dates.append({
                "raw": match.group(0),
                "iso": match.group(0),
                "span": [match.start(), match.end()],
            })

        # Check DMY numeric
        for match in self.DATE_REGEX_DMY.finditer(text):
            d, m, y = match.group(1), match.group(2), match.group(3)
            iso = f"{y}-{int(m):02d}-{int(d):02d}"
            dates.append({
                "raw": match.group(0),
                "iso": iso,
                "span": [match.start(), match.end()],
            })

        # Check textual dates (e.g., 1st May 2024)
        for match in self.DATE_REGEX_WORDS.finditer(text):
            d = match.group(1)
            month_name = match.group(2).lower()
            m = self.MONTH_MAP.get(month_name, "01")
            y = match.group(3)
            iso = f"{y}-{m}-{int(d):02d}"
            dates.append({
                "raw": match.group(0),
                "iso": iso,
                "span": [match.start(), match.end()],
            })

        # 3. Percentages
        for match in self.PERCENT_REGEX.finditer(text):
            raw_str = match.group(0).strip()
            val_str = match.group(1)
            try:
                percentages.append({
                    "raw": raw_str,
                    "value": float(val_str),
                    "span": [match.start(), match.end()],
                })
            except ValueError:
                continue

        # 4. Notice periods
        for match in self.NOTICE_REGEX.finditer(text):
            count_str = match.group(1).lower()
            unit_str = match.group(2).lower()
            count = self.WORD_TO_NUM.get(count_str, count_str)
            notice_periods.append(f"{count} {unit_str}")

        return DeterministicFacts(
            amounts=amounts,
            dates=dates,
            percentages=percentages,
            notice_periods=notice_periods,
        )


deterministic_extractor = DeterministicFactExtractor()
