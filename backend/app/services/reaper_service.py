from datetime import datetime, timedelta, timezone

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.logging import get_logger
from backend.app.models.entities import DocumentModel, JobModel, SessionModel

logger = get_logger("samjo.reaper")


class ReaperService:
    """
    Background maintenance tasks:
    1. Processing Reaper: Marks any job processing > 120s as 'failed' (prevents infinite spinners).
    2. TTL Cleaner: Purges documents past delete_after (24h default).
    3. Session Cleaner: Purges sessions past SESSION_TTL_HOURS (72h default).
    """

    def reap_stuck_jobs(self, db: Session) -> int:
        now = datetime.now(timezone.utc)
        timeout_cutoff = now - timedelta(seconds=120)

        stmt = select(JobModel).where(
            and_(
                JobModel.status == "processing",
                JobModel.created_at < timeout_cutoff,
            )
        )
        stuck_jobs = db.execute(stmt).scalars().all()
        count = 0
        for job in stuck_jobs:
            job.status = "failed"
            job.error_code = "ANALYSIS_TIMEOUT"
            job.error_message = "Analysis timed out after 120 seconds."
            job.updated_at = now
            count += 1

        if count > 0:
            db.commit()
            logger.warning(
                "Reaper reaped stuck jobs",
                extra={"extra_data": {"event": "jobs_reaped", "count": count}},
            )
        return count

    def purge_expired_documents(self, db: Session) -> int:
        now = datetime.now(timezone.utc)
        stmt = select(DocumentModel).where(DocumentModel.delete_after <= now)
        expired_docs = db.execute(stmt).scalars().all()
        count = len(expired_docs)
        for doc in expired_docs:
            db.delete(doc)

        if count > 0:
            db.commit()
            logger.info(
                "Reaper purged expired documents",
                extra={"extra_data": {"event": "documents_purged", "count": count}},
            )
        return count

    def purge_expired_sessions(self, db: Session) -> int:
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(hours=settings.SESSION_TTL_HOURS)
        stmt = select(SessionModel).where(SessionModel.created_at < cutoff)
        expired_sessions = db.execute(stmt).scalars().all()
        count = len(expired_sessions)
        for s in expired_sessions:
            db.delete(s)

        if count > 0:
            db.commit()
            logger.info(
                "Reaper purged expired sessions",
                extra={"extra_data": {"event": "sessions_purged", "count": count}},
            )
        return count


reaper_service = ReaperService()
