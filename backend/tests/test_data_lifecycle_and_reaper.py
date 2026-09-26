import uuid
from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy import select

from backend.app.core.errors import SamjoError
from backend.app.core.ratelimit import InMemoryRateLimiter
from backend.app.models.base import SessionLocal
from backend.app.models.entities import (
    AnalysisModel,
    DocumentModel,
    DocumentPageModel,
    ExtractionModel,
    JobModel,
    SessionModel,
)
from backend.app.services.document_service import document_service
from backend.app.services.reaper_service import reaper_service


def test_cascade_deletion_purges_all_related_data():
    db = SessionLocal()
    try:
        session_id = uuid.uuid4()
        now = datetime.now(timezone.utc)
        sess = SessionModel(
            id=session_id,
            expires_at=now + timedelta(hours=72),
        )
        db.add(sess)
        db.commit()

        # Create document
        doc_id = uuid.uuid4()
        doc = DocumentModel(
            id=doc_id,
            session_id=session_id,
            internal_filename=f"doc_{doc_id.hex}",
            mime_type="application/pdf",
            size_bytes=1024,
            page_count=2,
            delete_after=now + timedelta(hours=24),
            created_at=now,
        )
        db.add(doc)

        # Create extraction
        ext = ExtractionModel(
            id=uuid.uuid4(),
            document_id=doc_id,
            content_encrypted=b"encrypted_content_bytes",
            char_count=100,
            sanitised=True,
            injection_flags=[],
        )
        db.add(ext)

        # Create page
        page = DocumentPageModel(
            id=uuid.uuid4(),
            document_id=doc_id,
            page_number=1,
            char_start=0,
            char_end=100,
        )
        db.add(page)

        # Create analysis
        analysis = AnalysisModel(
            id=uuid.uuid4(),
            document_id=doc_id,
            language="en",
            summary="Test summary",
            urgency_level="LOW",
            urgency_reason="No urgency",
            model_version="gemini-2.5-flash",
            prompt_version="1.0.0",
            status="complete",
            result_json={"obligations": [], "risks": [], "money_items": [], "deadlines": []},
            created_at=now,
        )
        db.add(analysis)

        # Create job
        job = JobModel(
            id=uuid.uuid4(),
            document_id=doc_id,
            status="complete",
            stage="complete",
            created_at=now,
        )
        db.add(job)
        db.commit()

        # Verify they exist
        assert db.execute(select(DocumentModel).where(DocumentModel.id == doc_id)).scalar_one_or_none() is not None
        assert db.execute(select(ExtractionModel).where(ExtractionModel.document_id == doc_id)).scalar_one_or_none() is not None
        assert db.execute(select(DocumentPageModel).where(DocumentPageModel.document_id == doc_id)).scalars().all()
        assert db.execute(select(AnalysisModel).where(AnalysisModel.document_id == doc_id)).scalar_one_or_none() is not None
        assert db.execute(select(JobModel).where(JobModel.document_id == doc_id)).scalar_one_or_none() is not None

        # Execute cascade deletion
        document_service.delete_document(db, doc_id, session_id)

        # Verify ALL child records are gone
        assert db.execute(select(DocumentModel).where(DocumentModel.id == doc_id)).scalar_one_or_none() is None
        assert db.execute(select(ExtractionModel).where(ExtractionModel.document_id == doc_id)).scalar_one_or_none() is None
        assert len(db.execute(select(DocumentPageModel).where(DocumentPageModel.document_id == doc_id)).scalars().all()) == 0
        assert db.execute(select(AnalysisModel).where(AnalysisModel.document_id == doc_id)).scalar_one_or_none() is None
        assert db.execute(select(JobModel).where(JobModel.document_id == doc_id)).scalar_one_or_none() is None

    finally:
        db.close()


def test_reaper_purges_expired_documents_and_reaps_stuck_jobs():
    db = SessionLocal()
    try:
        session_id = uuid.uuid4()
        now = datetime.now(timezone.utc)
        sess = SessionModel(
            id=session_id,
            expires_at=now + timedelta(hours=72),
        )
        db.add(sess)
        db.commit()

        # 1. Expired document
        expired_doc_id = uuid.uuid4()
        expired_doc = DocumentModel(
            id=expired_doc_id,
            session_id=session_id,
            internal_filename="expired",
            mime_type="application/pdf",
            size_bytes=500,
            delete_after=now - timedelta(minutes=10),
            created_at=now - timedelta(hours=25),
        )
        db.add(expired_doc)

        # 2. Stuck job (>120s processing)
        stuck_job_id = uuid.uuid4()
        stuck_job = JobModel(
            id=stuck_job_id,
            document_id=expired_doc_id,
            status="processing",
            stage="analyzing",
            created_at=now - timedelta(seconds=150),
        )
        db.add(stuck_job)
        db.commit()

        # Run reaper
        reaped_count = reaper_service.reap_stuck_jobs(db)
        assert reaped_count >= 1

        db.refresh(stuck_job)
        assert stuck_job.status == "failed"
        assert stuck_job.error_code == "ANALYSIS_TIMEOUT"

        purged_docs = reaper_service.purge_expired_documents(db)
        assert purged_docs >= 1

        assert db.execute(select(DocumentModel).where(DocumentModel.id == expired_doc_id)).scalar_one_or_none() is None

    finally:
        db.close()


@pytest.mark.asyncio
async def test_rate_limiter_concurrency_and_quotas():
    limiter = InMemoryRateLimiter()
    limiter.ROUTE_LIMITS["uploads"] = 2

    sid = uuid.uuid4()
    ip = "192.168.1.100"

    # Route limits: 2 allowed, 3rd fails
    limiter.check_rate_limit(sid, ip, "uploads")
    limiter.check_rate_limit(sid, ip, "uploads")

    with pytest.raises(SamjoError) as exc_info:
        limiter.check_rate_limit(sid, ip, "uploads")
    assert exc_info.value.code == "RATE_LIMITED"
    assert exc_info.value.status_code == 429

    # Concurrency limit: max 1 per session
    await limiter.acquire_concurrency(sid)
    with pytest.raises(SamjoError) as exc_concur:
        await limiter.acquire_concurrency(sid)
    assert exc_concur.value.code == "RATE_LIMITED"
    assert "already running" in exc_concur.value.message

    # Release concurrency
    limiter.release_concurrency(sid)
    # Now acquire should succeed again
    await limiter.acquire_concurrency(sid)
    limiter.release_concurrency(sid)
