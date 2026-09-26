import uuid

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from backend.app.api.deps import get_current_session
from backend.app.models.entities import SessionModel

router = APIRouter(prefix="/documents", tags=["Exports"])


@router.post(
    "/{document_id}/export",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
)
async def export_document_pdf(
    document_id: uuid.UUID,
    session: SessionModel = Depends(get_current_session),
):
    """
    POST /documents/{id}/export
    NOT YET IMPLEMENTED: No PDF renderer has been decided in specs (RESOURCE_AUDIT §1.1).
    """
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "error_code": "NOT_IMPLEMENTED",
            "message": "PDF export renderer is not yet configured pending spec decision.",
        },
    )
