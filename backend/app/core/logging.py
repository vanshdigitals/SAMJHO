import json
import logging
from typing import Any

# Strictly allowlisted keys for operational logging.
# Anything not on this list is dropped, structurally preventing document text,
# PII, prompts, filenames, or model responses from ever being written.
LOG_ALLOWLIST = {
    "timestamp",
    "level",
    "logger",
    "message",
    "request_id",
    "session_id",
    "document_id",
    "situation_id",
    "job_id",
    "duration_ms",
    "stage",
    "error_code",
    "error_type",
    "error",
    "status_code",
    "document_type",
    "page_count",
    "ocr_used",
    "ocr_confidence",
    "dropped_item_count",
    "dropped_items",
    "model_name",
    "method",
    "path",
    "client_ip",
    "event",
    "count",
    "timeout",
}


class AllowlistJsonFormatter(logging.Formatter):
    """Structured JSON formatter enforcing the log allowlist (SECURITY.md §6)."""

    def format(self, record: logging.LogRecord) -> str:
        data: dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Check direct record attributes
        for key, val in record.__dict__.items():
            if key in LOG_ALLOWLIST and key not in data:
                data[key] = val

        # Check if record has extra_data dict
        extra_data = getattr(record, "extra_data", None)
        if isinstance(extra_data, dict):
            for k, v in extra_data.items():
                if k in LOG_ALLOWLIST:
                    data[k] = v

        return json.dumps(data)


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(AllowlistJsonFormatter())
    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(level.upper())


setup_root_logger = configure_logging


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
