import uuid

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.api.deps import check_rate_limit, get_current_session
from backend.app.core.errors import SamjoError
from backend.app.models.base import get_db
from backend.app.models.entities import (
    AnalysisItemModel,
    AnalysisModel,
    JobModel,
    SessionModel,
    SourceSpanModel,
)
from backend.app.schemas.api import (
    AnalyzeRequest,
    JobStatusResponse,
    SourceSpanDetailResponse,
)
from backend.app.services.analysis_service import analysis_service
from backend.app.services.document_service import document_service

router = APIRouter(prefix="/documents", tags=["Analysis"])


@router.post(
    "/{document_id}/analyze",
    response_model=JobStatusResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(check_rate_limit("analyses"))],
)
async def analyze_document(
    document_id: uuid.UUID,
    body: AnalyzeRequest = AnalyzeRequest(),
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    if body.confirmed_text:
        document_service.update_document_text(
            db=db,
            document_id=document_id,
            session_id=session.id,
            new_text=body.confirmed_text,
        )

    job = await analysis_service.start_analysis_job(
        db=db,
        document_id=document_id,
        session_id=session.id,
        language=body.language,
    )

    return JobStatusResponse(
        job_id=str(job.id),
        status=job.status,
        stage=job.stage,
    )


@router.get(
    "/{document_id}/analysis",
    dependencies=[Depends(check_rate_limit("reads"))],
)
async def get_document_analysis(
    document_id: uuid.UUID,
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    # Verify document ownership (404 on failure)
    doc = document_service.get_document_with_ownership_check(db, document_id, session.id)

    # Check for active or completed job
    stmt_job = select(JobModel).where(
        JobModel.document_id == document_id
    ).order_by(JobModel.created_at.desc())
    job = db.execute(stmt_job).scalars().first()

    if not job:
        raise SamjoError.not_found("No analysis job found for this document.")

    if job.status == "processing":
        # 425 Too Early while processing, returning verbatim current stage
        return JSONResponse(
            status_code=425,
            content={
                "status": "processing",
                "stage": job.stage,
            },
        )

    if job.status == "failed":
        return JSONResponse(
            status_code=500,
            content={
                "status": "failed",
                "error_code": job.error_code or "PROCESSING_FAILED",
                "error_message": job.error_message or "Analysis failed.",
            },
        )

    # Job is complete: fetch AnalysisModel
    stmt_analysis = select(AnalysisModel).where(
        AnalysisModel.document_id == document_id
    ).order_by(AnalysisModel.created_at.desc())
    analysis = db.execute(stmt_analysis).scalars().first()

    if not analysis:
        raise SamjoError.not_found("Analysis result not found.")

    if analysis.result_json:
        return analysis.result_json

    return JSONResponse(
        status_code=200,
        content={
            "summary": analysis.summary,
            "document_type": "Residential Rental Agreement",
            "type_confidence": 0.9,
            "jurisdiction_assumed": "India (verify)",
            "language": analysis.language,
            "urgency": {
                "level": analysis.urgency_level,
                "reason": analysis.urgency_reason,
                "deadline_date": analysis.urgency_date.isoformat() if analysis.urgency_date else None,
            },
            "obligations": [],
            "risks": [],
            "money_items": [],
            "deadlines": [],
            "conflicts": [],
            "questions": [],
            "next_steps": [],
            "uncertainty": analysis.uncertainty,
            "professional_help": {"recommended": analysis.is_high_risk},
            "safety": {
                "is_high_risk": analysis.is_high_risk,
                "high_risk_category": analysis.high_risk_category,
            },
            "source_metadata": {
                "page_count": doc.page_count,
                "ocr_used": False,
                "extraction_char_count": 0,
                "dropped_item_count": analysis.dropped_item_count,
                "model_version": analysis.model_version,
                "prompt_version": analysis.prompt_version,
            },
            "disclaimer": (
                "Samjo gives legal information to help you understand your document and prepare. It is not legal advice and not a substitute for a lawyer."
            ),
        },
    )


@router.get(
    "/{document_id}/source/{source_id}",
    response_model=SourceSpanDetailResponse,
    dependencies=[Depends(check_rate_limit("reads"))],
)
async def get_source_span(
    document_id: str,
    source_id: str,
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    try:
        doc_uuid = uuid.UUID(str(document_id))
    except (ValueError, TypeError, AttributeError):
        raise SamjoError.not_found("Document not found.")

    try:
        source_uuid = uuid.UUID(str(source_id))
    except (ValueError, TypeError, AttributeError):
        raise SamjoError.not_found("Source span not found.")

    # Verify document ownership (raises 404 NOT FOUND if deleted or belongs to another session)
    _ = document_service.get_document_with_ownership_check(db, doc_uuid, session.id)

    # Verify span exists and belongs to this document
    stmt = (
        select(SourceSpanModel)
        .join(AnalysisItemModel, SourceSpanModel.item_id == AnalysisItemModel.id)
        .join(AnalysisModel, AnalysisItemModel.analysis_id == AnalysisModel.id)
        .where(
            SourceSpanModel.id == source_uuid,
            AnalysisModel.document_id == doc_uuid,
        )
    )
    span = db.execute(stmt).scalar_one_or_none()
    if not span:
        raise SamjoError.not_found("Source span not found.")

    doc_text, _ = document_service.get_decrypted_document_text(db, doc_uuid)

    # Generate bounded context window (up to 150 chars before and after)
    doc_len = len(doc_text)
    start_off = max(0, min(span.start_offset if span.start_offset is not None else 0, doc_len))
    end_off = max(
        start_off,
        min(
            span.end_offset if span.end_offset is not None else (start_off + len(span.quoted_text)),
            doc_len,
        ),
    )

    ctx_start = max(0, start_off - 150)
    ctx_end = min(doc_len, end_off + 150)

    context_before = doc_text[ctx_start:start_off]
    context_after = doc_text[end_off:ctx_end]

    return SourceSpanDetailResponse(
        source_id=str(span.id),
        quoted_text=span.quoted_text,
        page=span.page,
        start_offset=span.start_offset,
        end_offset=span.end_offset,
        context_before=context_before,
        context_after=context_after,
        verified=span.verified,
    )
