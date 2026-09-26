import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import GUID, Base, utc_now


class SessionModel(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    language_pref: Mapped[str] = mapped_column(String(10), default="en")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)

    # Relationships
    documents: Mapped[list["DocumentModel"]] = relationship(
        "DocumentModel", back_populates="session", cascade="all, delete-orphan", passive_deletes=True
    )
    situations: Mapped[list["SituationModel"]] = relationship(
        "SituationModel", back_populates="session", cascade="all, delete-orphan", passive_deletes=True
    )
    audit_events: Mapped[list["AuditEventModel"]] = relationship(
        "AuditEventModel", back_populates="session", cascade="all, delete-orphan", passive_deletes=True
    )


class DocumentModel(Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("sessions.id", ondelete="CASCADE"), index=True, nullable=False
    )
    internal_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    page_count: Mapped[int] = mapped_column(Integer, default=1)
    ocr_used: Mapped[bool] = mapped_column(Boolean, default=False)
    ocr_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    document_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    type_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="uploaded", index=True)
    situation_context: Mapped[str | None] = mapped_column(String(500), nullable=True)
    delete_after: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    session: Mapped["SessionModel"] = relationship("SessionModel", back_populates="documents")
    pages: Mapped[list["DocumentPageModel"]] = relationship(
        "DocumentPageModel", back_populates="document", cascade="all, delete-orphan", passive_deletes=True
    )
    extraction: Mapped[Optional["ExtractionModel"]] = relationship(
        "ExtractionModel", back_populates="document", uselist=False, cascade="all, delete-orphan", passive_deletes=True
    )
    analyses: Mapped[list["AnalysisModel"]] = relationship(
        "AnalysisModel", back_populates="document", cascade="all, delete-orphan", passive_deletes=True
    )
    jobs: Mapped[list["JobModel"]] = relationship(
        "JobModel", back_populates="document", cascade="all, delete-orphan", passive_deletes=True
    )


class DocumentPageModel(Base):
    __tablename__ = "document_pages"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("documents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    page_number: Mapped[int] = mapped_column(Integer, nullable=False)
    char_start: Mapped[int] = mapped_column(Integer, nullable=False)
    char_end: Mapped[int] = mapped_column(Integer, nullable=False)

    document: Mapped["DocumentModel"] = relationship("DocumentModel", back_populates="pages")


class ExtractionModel(Base):
    __tablename__ = "extractions"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("documents.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    content_encrypted: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    char_count: Mapped[int] = mapped_column(Integer, default=0)
    sanitised: Mapped[bool] = mapped_column(Boolean, default=True)
    injection_flags: Mapped[list] = mapped_column(JSON, default=list)

    document: Mapped["DocumentModel"] = relationship("DocumentModel", back_populates="extraction")


class AnalysisModel(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("documents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    language: Mapped[str] = mapped_column(String(10), default="en")
    summary: Mapped[str] = mapped_column(String(1000), default="")
    urgency_level: Mapped[str] = mapped_column(String(20), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    urgency_reason: Mapped[str] = mapped_column(String(500), default="")
    urgency_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_high_risk: Mapped[bool] = mapped_column(Boolean, default=False)
    high_risk_category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    model_version: Mapped[str] = mapped_column(String(100), default="mock")
    prompt_version: Mapped[str] = mapped_column(String(50), default="v1.0")
    dropped_item_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="complete")  # complete, partial, failed
    uncertainty: Mapped[list] = mapped_column(JSON, default=list)
    result_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    document: Mapped["DocumentModel"] = relationship("DocumentModel", back_populates="analyses")
    items: Mapped[list["AnalysisItemModel"]] = relationship(
        "AnalysisItemModel", back_populates="analysis", cascade="all, delete-orphan", passive_deletes=True
    )


class AnalysisItemModel(Base):
    __tablename__ = "analysis_items"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    analysis_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("analyses.id", ondelete="CASCADE"), index=True, nullable=False
    )
    type: Mapped[str] = mapped_column(String(50), index=True)  # obligation, risk, money, deadline, next_step, what_this_is
    title: Mapped[str] = mapped_column(String(255), default="")
    explanation: Mapped[str] = mapped_column(String(1000), default="")
    severity: Mapped[str | None] = mapped_column(String(20), nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=1.0)
    verification_required: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    extra_data: Mapped[dict] = mapped_column(JSON, default=dict)

    analysis: Mapped["AnalysisModel"] = relationship("AnalysisModel", back_populates="items")
    source_span: Mapped[Optional["SourceSpanModel"]] = relationship(
        "SourceSpanModel", back_populates="item", uselist=False, cascade="all, delete-orphan", passive_deletes=True
    )


class SourceSpanModel(Base):
    __tablename__ = "source_spans"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    item_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("analysis_items.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    quoted_text: Mapped[str] = mapped_column(String(2000), nullable=False)
    page: Mapped[int] = mapped_column(Integer, default=1)
    start_offset: Mapped[int | None] = mapped_column(Integer, nullable=True)
    end_offset: Mapped[int | None] = mapped_column(Integer, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)

    item: Mapped["AnalysisItemModel"] = relationship("AnalysisItemModel", back_populates="source_span")


class SituationModel(Base):
    __tablename__ = "situations"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("sessions.id", ondelete="CASCADE"), index=True, nullable=False
    )
    language: Mapped[str] = mapped_column(String(10), default="en")
    description_encrypted: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    clarifying_questions: Mapped[list] = mapped_column(JSON, default=list)
    answers: Mapped[list] = mapped_column(JSON, default=list)
    result: Mapped[dict] = mapped_column(JSON, default=dict)
    delete_after: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    session: Mapped["SessionModel"] = relationship("SessionModel", back_populates="situations")


class AuditEventModel(Base):
    __tablename__ = "audit_events"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID, ForeignKey("sessions.id", ondelete="CASCADE"), index=True, nullable=True
    )
    event_type: Mapped[str] = mapped_column(String(50), index=True)
    details: Mapped[dict] = mapped_column(JSON, default=dict)  # Metadata only! Never content
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)

    session: Mapped[Optional["SessionModel"]] = relationship("SessionModel", back_populates="audit_events")


class JobModel(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("documents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    status: Mapped[str] = mapped_column(String(30), default="processing", index=True)
    stage: Mapped[str] = mapped_column(String(50), default="extracting")
    error_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    error_message: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    document: Mapped["DocumentModel"] = relationship("DocumentModel", back_populates="jobs")
