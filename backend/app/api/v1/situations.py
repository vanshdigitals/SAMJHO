import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.api.deps import check_rate_limit, get_current_session
from backend.app.models.base import get_db
from backend.app.models.entities import SessionModel
from backend.app.schemas.api import (
    SituationAnalyzeResponse,
    SituationAnswerRequest,
    SituationCreateRequest,
    SituationCreateResponse,
)
from backend.app.services.situation_service import situation_service

router = APIRouter(prefix="/situations", tags=["Situations"])


@router.post(
    "",
    response_model=SituationCreateResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(check_rate_limit("situations"))],
)
async def create_situation(
    body: SituationCreateRequest,
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    return await situation_service.create_situation(
        db=db,
        session_id=session.id,
        req=body,
    )


@router.post(
    "/{situation_id}/analyze",
    response_model=SituationAnalyzeResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(check_rate_limit("situations"))],
)
async def analyze_situation(
    situation_id: uuid.UUID,
    body: SituationAnswerRequest,
    session: SessionModel = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    return await situation_service.analyze_situation(
        db=db,
        situation_id=situation_id,
        session_id=session.id,
        req=body,
    )
