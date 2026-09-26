import json
import logging

from backend.app.core.logging import AllowlistJsonFormatter


def test_logging_allowlist_drops_forbidden_fields():
    formatter = AllowlistJsonFormatter()
    record = logging.LogRecord(
        name="samjo.test",
        level=logging.INFO,
        pathname="test.py",
        lineno=10,
        msg="Document operation completed",
        args=(),
        exc_info=None,
    )
    # Attach extra data with both allowed and forbidden fields
    record.extra_data = {
        "event": "test_event",
        "page_count": 3,
        "document_text": "Secret rental terms that should NEVER be logged",
        "user_amount": "Rs. 50,000/-",
        "original_filename": "private_tenancy_agreement.pdf",
    }

    formatted = formatter.format(record)
    log_dict = json.loads(formatted)

    assert "event" in log_dict
    assert "page_count" in log_dict
    # Non-allowlisted sensitive fields must be completely dropped
    assert "document_text" not in log_dict
    assert "user_amount" not in log_dict
    assert "original_filename" not in log_dict
    assert "Secret rental terms" not in formatted
