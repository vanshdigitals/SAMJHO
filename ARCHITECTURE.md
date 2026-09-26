# Samjo: Architecture Diagrams

## 1. System architecture

```mermaid
flowchart TB
    subgraph Client
        UI[React SPA<br/>TypeScript, Vite, Tailwind]
    end

    subgraph Edge
        TLS[Reverse proxy<br/>TLS, CORS, rate limit]
    end

    subgraph Backend[FastAPI]
        API[API layer v1]
        APP[Application services]
        DOM[Domain rules<br/>urgency, safety, verification]
        WORK[Analysis worker]
    end

    subgraph Infra
        DB[(SQLite<br/>Postgres-ready)]
        FS[Temp file store<br/>TTL purge]
        OCR[OCR engine]
    end

    LLM[LLM API<br/>constrained JSON]

    UI -->|HTTPS| TLS --> API --> APP
    APP --> DOM
    APP --> WORK
    APP --> DB
    APP --> FS
    WORK --> OCR
    WORK -->|untrusted text as data| LLM
    WORK --> DOM
    WORK --> DB
```

The LLM is the only external dependency. It receives document text as a delimited data parameter and never as instructions.

## 2. User journey

```mermaid
flowchart TD
    A[Document or worry arrives] --> B{Landing}
    B -->|I have a document| C[Upload]
    B -->|Something happened| S1[Guided intake]

    C --> D{Valid?}
    D -->|No| E[Named error + retry]
    E --> C
    D -->|Yes| F[Extract, OCR if needed]
    F --> G{Legal document?}
    G -->|No| S1
    G -->|Yes| H[Analyze]

    H --> I[Briefing]
    I --> J[Urgency first]
    J --> K[What this is / must do / watch out / money / dates]
    K --> L[Tap item]
    L --> M[Evidence: says vs interprets vs verify]
    K --> N[Questions to ask]
    N --> O{High risk?}
    O -->|Yes| P[Professional help, foregrounded]
    O -->|No| Q[Next steps]
    P --> R[Lawyer prep checklist]
    Q --> R
    R --> T[Export or Delete]

    S1 --> S2[What we know / what's missing]
    S2 --> S3[Conservative next steps]
    S3 --> S4{Have a document?}
    S4 -->|Yes| C
    S4 -->|No| R
```

## 3. Document analysis pipeline

```mermaid
flowchart TD
    U[Upload] --> V[Validate: ext, MIME, magic bytes, size, pages, encryption]
    V -->|reject| VE[Typed error]
    V --> X{Text layer?}
    X -->|Yes| TX[PyMuPDF / python-docx<br/>text + page + offsets]
    X -->|No| OC[OCR + confidence]
    OC --> OW{conf >= threshold?}
    OW -->|No| OWARN[Flag: verify extracted text]
    OW -->|Yes| TX
    OWARN --> TX
    TX --> SAN[Sanitise: strip hidden, zero-width, off-page text]
    SAN --> CH[Characterize type + confidence]
    CH -->|not legal| NL[Offer situation flow]
    CH --> DET[Deterministic: dates, money, %, notice periods]
    DET --> LLM[Structured LLM analysis<br/>temp 0, JSON schema]
    LLM --> MAP[Map each quote to page + offsets]
    MAP --> VER{Span verified?}
    VER -->|No| DROP[Drop item, increment counter]
    VER -->|Yes| SAFE[Safety: high risk, no external law, refusals]
    SAFE --> URG[Urgency from evidence]
    URG --> OUT[Validated JSON]
    OUT --> FE[Render]
```

## 4. Backend request flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant S as DocumentService
    participant W as Worker
    participant L as LLM
    participant D as DB

    C->>A: POST /documents (file, session token)
    A->>S: validate + own
    S->>D: insert document (status=uploaded)
    S-->>C: 201 {document_id}

    C->>A: POST /documents/{id}/analyze
    A->>S: ownership check
    S->>W: enqueue job
    S-->>C: 202 {job_id, status=extracting}

    loop poll 1.5s
        C->>A: GET /documents/{id}/analysis
        A->>D: read job stage
        A-->>C: 200 {status, stage} or 425
    end

    W->>W: extract, sanitise, characterize, deterministic
    W->>L: analyze(system, untrusted_document, known_facts, schema)
    L-->>W: JSON
    W->>W: verify spans, drop failures, safety, urgency
    W->>D: persist analysis + items + spans
    C->>A: GET /documents/{id}/analysis
    A-->>C: 200 AnalysisResponse
```

## 5. Database ER

```mermaid
erDiagram
    SESSIONS ||--o{ DOCUMENTS : owns
    SESSIONS ||--o{ SITUATIONS : owns
    DOCUMENTS ||--o{ DOCUMENT_PAGES : has
    DOCUMENTS ||--|| EXTRACTIONS : produces
    DOCUMENTS ||--o{ ANALYSES : produces
    ANALYSES ||--o{ ANALYSIS_ITEMS : contains
    ANALYSIS_ITEMS ||--o| SOURCE_SPANS : cites
    ANALYSES ||--o{ QUESTIONS : suggests
    ANALYSES ||--o{ EXPORTS : renders
    SESSIONS ||--o{ AUDIT_EVENTS : records

    SESSIONS {
        uuid id PK
        string language_pref
        datetime created_at
        datetime expires_at
    }
    DOCUMENTS {
        uuid id PK
        uuid session_id FK
        string mime_type
        int page_count
        bool ocr_used
        float ocr_confidence
        string status
        datetime delete_after
    }
    EXTRACTIONS {
        uuid id PK
        uuid document_id FK
        text content_encrypted
        bool sanitised
    }
    ANALYSIS_ITEMS {
        uuid id PK
        uuid analysis_id FK
        string type
        text title
        text explanation
        float confidence
        bool verification_required
    }
    SOURCE_SPANS {
        uuid id PK
        uuid item_id FK
        text quoted_text
        int page
        int start_offset
        int end_offset
    }
```

## 6. AI safety boundary

```mermaid
flowchart LR
    subgraph Trusted["Trusted: authored by us, versioned"]
        SYS[System instructions]
        SCHEMA[Output schema]
        FACTS[Deterministic facts]
    end

    subgraph Untrusted["Untrusted: never instructions"]
        DOC[Document text]
        USERQ[User question]
    end

    SYS --> CALL[LLM call]
    SCHEMA --> CALL
    FACTS --> CALL
    DOC -->|delimited data parameter| CALL
    USERQ -->|delimited data parameter| CALL

    CALL --> OUT[Model output]
    OUT --> G1{Schema valid?}
    G1 -->|No| RETRY[Retry once, then fail visibly]
    G1 -->|Yes| G2{Every span verified?}
    G2 -->|No| DROPPED[Drop unverified items]
    G2 -->|Yes| G3{Asserts law not in document?}
    G3 -->|Yes| STRIP[Strip assertion]
    G3 -->|No| G4{High-risk or advice request?}
    G4 -->|Yes| ESC[Reframe + escalate to professional]
    G4 -->|No| RENDER[Render]
    DROPPED --> G3
    STRIP --> G4
```

Secrets never enter the prompt, so there is nothing for a system-prompt-leak attack to retrieve beyond authored instructions.

## 7. Session and authorization flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as DB

    C->>A: POST /sessions
    A->>D: create anonymous session
    A-->>C: signed session token (httpOnly cookie)

    C->>A: GET /documents/{id}/analysis (cookie)
    A->>A: verify signature, check expiry
    A->>D: SELECT ... WHERE id=? AND session_id=?
    alt owned
        D-->>A: row
        A-->>C: 200
    else not owned or missing
        D-->>A: none
        A-->>C: 404 (never 403)
    end
```

Ownership is enforced in the service layer on every read, write and delete. Client-supplied document ids are never trusted.

## 8. Export flow

```mermaid
flowchart TD
    E1[User taps Export] --> E2[Load persisted analysis]
    E2 --> E3[Render: type, summary, urgency, must do,<br/>watch out, money, dates, questions, sources]
    E3 --> E4[Stamp: AI-generated information for understanding purposes.<br/>Not legal advice.]
    E4 --> E5[Visual treatment deliberately unlike an official document<br/>no seals, no letterhead, no signature block]
    E5 --> E6[Generate PDF]
    E6 --> E7[Download]
    E7 --> E8{Delete now?}
    E8 -->|Yes| E9[Purge file, extraction, analysis, items, spans]
    E8 -->|No| E10[Auto-purge at TTL]
```

## 9. Rate Limiting, TTL and Data Lifecycle

### Rate Limiter Architecture (MVP Specification)
The MVP uses an in-memory sliding-window rate limiter (`backend.app.core.ratelimit.InMemoryRateLimiter`) enforcing per-session and per-IP quotas:
- `POST /sessions`: 20/hour/IP
- `POST /documents`: 10/hour/session
- `POST /documents/{id}/analyze`: 15/hour/session (cost centre)
- `POST /situations`: 10/hour/session
- Reads & Polling: 600/hour/session (headroom for 1.5s client polling)
- `DELETE /documents/{id}`: 30/hour/session
- Concurrency: Maximum 1 concurrent analysis per session, maximum 3 concurrent analyses per process.

**MVP Limitation Note:**
Because this rate limiter is held in memory, counters reset whenever the application process restarts or deploys. For the MVP deployment on a single Render instance, this provides robust protection against abusive loops and runaway Gemini billing without introducing external infrastructure. In a multi-instance production environment, this in-memory layer can be swapped for a Redis-backed distributed token bucket without altering the FastAPI route dependency contracts.

### Data Lifecycle & TTL Rules
- **Document TTL:** Every uploaded document is assigned a hard expiration timestamp (`delete_after = created_at + 24 hours`).
- **Session TTL:** Sessions expire after 72 hours (`SESSION_TTL_HOURS = 72`).
- **Background Reaper:** A lightweight asynchronous background task runs every 30 seconds:
  1. Reaps stuck analysis jobs running > 120 seconds, transitioning them to `failed` (`ANALYSIS_TIMEOUT`) to prevent zombie client polling.
  2. Purges expired documents past `delete_after`.
  3. Purges expired sessions and orphaned resources.
- **Immediate Deletion & Cascades:** When a user clicks "Delete it now" (`DELETE /documents/{id}`):
  - Database foreign-key cascades (`ON DELETE CASCADE`) immediately purge the document, its encrypted extraction, decrypted pages, analysis result, and source spans.
  - Ephemeral disk files (if any remain) are purged immediately.
  - Subsequent requests return HTTP 404.

