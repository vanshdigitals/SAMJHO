import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Response,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from backend.app.api.deps import check_rate_limit, get_current_session
from backend.app.core.config import settings
from backend.app.models.base import get_db
from backend.app.models.entities import SessionModel
from backend.app.schemas.api import (
    DocumentMetadataResponse,
    DocumentUpdateTextRequest,
    DocumentUploadResponse,
)
from backend.app.services.document_service import document_service

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post(
    "",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(check_rate_limit("uploads"))],
)
async def upload_document(
    file: UploadFile = File(...),
    situation_context: str | None = Form(None),
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    # Read file bytes in memory (under 10MB budget)
    file_bytes = await file.read()
    filename = file.filename or "uploaded_document"
    content_type = file.content_type or "application/octet-stream"

    doc = await document_service.create_document(
        db=db,
        session_id=session.id,
        file_bytes=file_bytes,
        filename=filename,
        declared_mime=content_type,
        situation_context=situation_context,
    )

    ocr_low_conf = bool(
        doc.ocr_used
        and doc.ocr_confidence is not None
        and doc.ocr_confidence < settings.OCR_MIN_CONFIDENCE
    )
    doc_text = None
    if ocr_low_conf:
        doc_text, _ = document_service.get_decrypted_document_text(db, doc.id)

    return DocumentUploadResponse(
        document_id=str(doc.id),
        status="uploaded",
        page_count=doc.page_count,
        mime_type=doc.mime_type,
        delete_after=doc.delete_after,
        ocr_used=doc.ocr_used,
        ocr_confidence=doc.ocr_confidence,
        ocr_low_confidence=ocr_low_conf,
        extracted_text=doc_text,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentMetadataResponse,
    dependencies=[Depends(check_rate_limit("reads"))],
)
async def get_document_metadata(
    document_id: uuid.UUID,
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    doc = document_service.get_document_with_ownership_check(db, document_id, session.id)
    doc_text, extraction = document_service.get_decrypted_document_text(db, document_id)
    ocr_low_conf = bool(
        doc.ocr_used
        and doc.ocr_confidence is not None
        and doc.ocr_confidence < settings.OCR_MIN_CONFIDENCE
    )

    return DocumentMetadataResponse(
        document_id=str(doc.id),
        status="uploaded",
        page_count=doc.page_count,
        document_type=None,
        ocr_used=doc.ocr_used,
        ocr_confidence=doc.ocr_confidence,
        ocr_low_confidence=ocr_low_conf,
        extracted_text=doc_text if ocr_low_conf else None,
        delete_after=doc.delete_after,
    )


@router.patch(
    "/{document_id}/text",
    response_model=DocumentMetadataResponse,
    dependencies=[Depends(check_rate_limit("uploads"))],
)
async def update_document_text(
    document_id: uuid.UUID,
    body: DocumentUpdateTextRequest,
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    doc = document_service.update_document_text(
        db=db,
        document_id=document_id,
        session_id=session.id,
        new_text=body.text,
    )
    return DocumentMetadataResponse(
        document_id=str(doc.id),
        status="uploaded",
        page_count=doc.page_count,
        document_type=None,
        ocr_used=doc.ocr_used,
        ocr_confidence=1.0,
        ocr_low_confidence=False,
        extracted_text=body.text,
        delete_after=doc.delete_after,
    )


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(check_rate_limit("deletes"))],
)
async def delete_document(
    document_id: uuid.UUID,
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    document_service.delete_document(db, document_id, session.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
