# Samjo: Database

SQLite for the MVP, designed so a Postgres swap is a connection-string change. UUID primary keys, `created_at` and `updated_at` on every table, no SQLite-specific SQL anywhere.

## What is stored, and what is not

The strongest privacy control is not encryption, it is not holding the data. Samjo stores the minimum needed to render a briefing the user came back for, and deletes it on a short clock.

**Stored:** session metadata, document metadata, encrypted extracted text, the structured analysis, verified spans, operational audit events.

**Not stored:** the original uploaded file beyond the TTL window, names, phone numbers, email addresses, any identity document content, any account credentials, and any log line containing document text.

## Tables

### sessions
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| language_pref | text | `en` or `hi` |
| created_at, updated_at | datetime | |
| expires_at | datetime | `SESSION_TTL_HOURS` |

Anonymous by default. No email, no name, no account.

### documents
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| session_id | uuid FK → sessions | Ownership boundary. Indexed. |
| internal_filename | text | Generated. The user's filename is discarded. |
| mime_type | text | Validated, not client-declared |
| size_bytes | integer | |
| page_count | integer | |
| ocr_used | boolean | |
| ocr_confidence | float | Null when no OCR |
| document_type | text | From characterization |
| type_confidence | float | |
| status | text | uploaded, extracting, analyzing, analyzed, failed |
| delete_after | datetime | `DOCUMENT_TTL_HOURS`. Indexed for the purge job. |

### document_pages
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| document_id | uuid FK | |
| page_number | integer | |
| char_start, char_end | integer | Offsets into the extraction, which is how a span resolves to a page |

### extractions
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| document_id | uuid FK, unique | |
| content_encrypted | blob | Application-level encryption with `ENCRYPTION_KEY` |
| char_count | integer | |
| sanitised | boolean | Hidden and zero-width text removed |
| injection_flags | json | What the sanitiser found, for observability. Patterns only, no content. |

Encrypting at the application layer rather than relying on disk encryption means a leaked database file is not a leaked pile of tenancy agreements.

### analyses
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| document_id | uuid FK | |
| language | text | |
| summary | text | |
| urgency_level | text | LOW, MEDIUM, HIGH, CRITICAL |
| urgency_reason | text | |
| urgency_date | date | Nullable |
| is_high_risk | boolean | |
| high_risk_category | text | Nullable |
| model_version | text | Reproducibility |
| prompt_version | text | Prompts are versioned like code |
| dropped_item_count | integer | Items that failed span verification |
| status | text | complete, partial, failed |

`dropped_item_count` is a quality signal. A rising value means the extraction prompt is drifting and needs attention before users notice.

### analysis_items
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| analysis_id | uuid FK | |
| type | text | obligation, risk, money, deadline, next_step |
| title | text | |
| explanation | text | The interpretation, labelled as such in the UI |
| severity | text | Risks only |
| confidence | float | 0 to 1 |
| verification_required | boolean | |
| display_order | integer | |

### source_spans
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| item_id | uuid FK, unique | |
| quoted_text | text | Verbatim from the document |
| page | integer | |
| start_offset, end_offset | integer | |
| verified | boolean | Always true when persisted |

A row here exists only if verification passed. Unverified claims are dropped in the service layer and never reach the database, so an unsourced claim cannot be rendered even by a frontend bug.

### questions
| id | uuid PK |
| analysis_id | uuid FK |
| text | text |
| rationale | text |
| display_order | integer |

### situations
| id | uuid PK | session_id | uuid FK | description | text (encrypted) | characterization | text | status | text |

### exports
| id | uuid PK | analysis_id | uuid FK | language | text | created_at | datetime |

Metadata only. The rendered PDF is streamed and not retained.

### audit_events
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| session_id | uuid FK | |
| action | text | upload, analyze, export, delete, rate_limited, injection_flagged |
| document_id | uuid | Nullable |
| created_at | datetime | |

Identifiers and action names only. This table must remain safe to read in full.

## Retention

An hourly job deletes documents past `delete_after` and cascades to pages, extractions, analyses, items, spans and questions. Sessions past `expires_at` cascade to everything they own. `DELETE /documents/{id}` performs the same cascade immediately.

Deletion is real deletion, not a soft flag. A soft-deleted tenancy agreement is still a tenancy agreement sitting in a database.

## Indexes

`documents(session_id)`, `documents(delete_after)`, `analysis_items(analysis_id, display_order)`, `source_spans(item_id)`, `sessions(expires_at)`.

## Migration to Postgres

`uuid` maps from text to native uuid, `blob` to bytea, `json` to jsonb. SQLAlchemy handles all three through type decorators already in the model layer. No application code changes.
