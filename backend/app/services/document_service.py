import asyncio
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.errors import SamjoError
from backend.app.core.logging import get_logger
from backend.app.core.security import decrypt_bytes, encrypt_bytes
from backend.app.models.entities import (
    AuditEventModel,
    DocumentModel,
    DocumentPageModel,
    ExtractionModel,
)
from backend.app.services.extraction_service import extraction_service

logger = get_logger("samjo.document")


class DocumentService:
    """
    Manages document ingestion, storage, retrieval, ownership checks, and cascade purges.
    Enforces that ownership failures return 404 NOT FOUND (never 403).
    """

    async def create_document(
        self,
        db: Session,
        session_id: uuid.UUID,
        file_bytes: bytes,
        filename: str,
        declared_mime: str,
        situation_context: str | None = None,
    ) -> DocumentModel:
        # 1. Validate file bytes in strict sequence
        detected_mime = extraction_service.validate_file_bytes(
            raw_bytes=file_bytes,
            declared_filename=filename,
            declared_mime=declared_mime,
        )

        doc_id = uuid.uuid4()
        now = datetime.now(timezone.utc)
        delete_after = now + timedelta(hours=settings.DOCUMENT_TTL_HOURS)

        # 2. Extract and sanitize (file is deleted immediately inside extraction_service)
        extraction_res = await extraction_service.extract_and_clean(
            raw_bytes=file_bytes,
            mime_type=detected_mime,
        )

        full_text = extraction_res["full_text"]
        pages_data = extraction_res["pages"]
        page_count = extraction_res["page_count"]
        ocr_used = extraction_res["ocr_used"]
        ocr_confidence = extraction_res["ocr_confidence"]
        injection_flags = extraction_res["injection_flags"]

        # 3. Create Document record
        # Note: We NEVER store the original user filename or file content in plain text.
        document = DocumentModel(
            id=doc_id,
            session_id=session_id,
            internal_filename=f"doc_{doc_id.hex}",
            mime_type=detected_mime,
            size_bytes=len(file_bytes),
            page_count=page_count,
            ocr_used=ocr_used,
            ocr_confidence=ocr_confidence,
            status="uploaded",
            situation_context=situation_context[:500] if situation_context else None,
            delete_after=delete_after,
            created_at=now,
            updated_at=now,
        )
        db.add(document)

        # 4. Create Document Pages
        for p in pages_data:
            page_model = DocumentPageModel(
                id=uuid.uuid4(),
                document_id=doc_id,
                page_number=p["page_number"],
                char_start=p["char_start"],
                char_end=p["char_end"],
            )
            db.add(page_model)

        # 5. Encrypt extracted text with Fernet before writing to database
        encrypted_text = await asyncio.to_thread(encrypt_bytes, full_text.encode("utf-8"))

        extraction = ExtractionModel(
            id=uuid.uuid4(),
            document_id=doc_id,
            content_encrypted=encrypted_text,
            char_count=len(full_text),
            sanitised=True,
            injection_flags=injection_flags,
        )
        db.add(extraction)

        # 6. Audit event
        audit = AuditEventModel(
            id=uuid.uuid4(),
            session_id=session_id,
            event_type="document_uploaded",
            created_at=now,
        )
        db.add(audit)

        db.commit()
        db.refresh(document)

        logger.info(
            "Document created successfully",
            extra={
                "extra_data": {
                    "event": "document_created",
                    "page_count": page_count,
                    "ocr_used": ocr_used,
                }
            },
        )
        return document

    def get_document_with_ownership_check(
        self,
        db: Session,
        document_id: uuid.UUID,
        session_id: uuid.UUID,
    ) -> DocumentModel:
        """
        Retrieves a document. If it doesn't exist OR belongs to another session,
        returns 404 NOT FOUND (NEVER 403).
        """
        stmt = select(DocumentModel).where(DocumentModel.id == document_id)
        doc = db.execute(stmt).scalar_one_or_none()
        if not doc or doc.session_id != session_id:
            raise SamjoError.not_found("Document not found.")
        return doc

    def get_decrypted_document_text(
        self,
        db: Session,
        document_id: uuid.UUID,
    ) -> tuple[str, ExtractionModel]:
        """
        Retrieves and decrypts extracted text for a document.
        """
        stmt = select(ExtractionModel).where(ExtractionModel.document_id == document_id)
        extraction = db.execute(stmt).scalar_one_or_none()
        if not extraction:
            raise SamjoError.extraction_empty("No extracted content available for document.")

        raw_bytes = decrypt_bytes(extraction.content_encrypted)
        return raw_bytes.decode("utf-8"), extraction

    def get_document_pages(
        self,
        db: Session,
        document_id: uuid.UUID,
    ) -> list[dict]:
        stmt = select(DocumentPageModel).where(
            DocumentPageModel.document_id == document_id
        ).order_by(DocumentPageModel.page_number)
        pages = db.execute(stmt).scalars().all()
        return [
            {
                "page_number": p.page_number,
                "char_start": p.char_start,
                "char_end": p.char_end,
            }
            for p in pages
        ]

    def delete_document(
        self,
        db: Session,
        document_id: uuid.UUID,
        session_id: uuid.UUID,
    ) -> None:
        """
        Cascades purge for document. Idempotent. Returns 204.
        """
        stmt = select(DocumentModel).where(DocumentModel.id == document_id)
        doc = db.execute(stmt).scalar_one_or_none()
        if not doc:
            return  # Idempotent
        if doc.session_id != session_id:
            # Enforce 404 on ownership failure
            raise SamjoError.not_found("Document not found.")

        # Delete all child items explicitly or rely on cascades
        db.delete(doc)

        audit = AuditEventModel(
            id=uuid.uuid4(),
            session_id=session_id,
            event_type="document_deleted",
            created_at=datetime.now(timezone.utc),
        )
        db.add(audit)
        db.commit()

        logger.info(
            "Document cascade deleted",
            extra={"extra_data": {"event": "document_deleted"}},
        )


    def update_document_text(
        self,
        db: Session,
        document_id: uuid.UUID,
        session_id: uuid.UUID,
        new_text: str,
    ) -> DocumentModel:
        """
        Updates the extracted text for a document after user review/confirmation.
        Re-encrypts the text, updates page offsets, and updates the document record.
        """
        doc = self.get_document_with_ownership_check(db, document_id, session_id)
        cleaned = extraction_service._sanitize_text(new_text)
        if len(cleaned.strip()) < 10:
            raise SamjoError.extraction_empty("Updated document text cannot be empty.")

        stmt = select(ExtractionModel).where(ExtractionModel.document_id == document_id)
        extraction = db.execute(stmt).scalar_one_or_none()
        if not extraction:
            raise SamjoError.not_found("Extraction not found.")

        encrypted_text = encrypt_bytes(cleaned.encode("utf-8"))
        extraction.content_encrypted = encrypted_text
        extraction.char_count = len(cleaned)

        # Update page mappings to match confirmed text
        stmt_pages = select(DocumentPageModel).where(DocumentPageModel.document_id == document_id)
        existing_pages = db.execute(stmt_pages).scalars().all()
        for p in existing_pages:
            db.delete(p)

        page_model = DocumentPageModel(
            id=uuid.uuid4(),
            document_id=document_id,
            page_number=1,
            char_start=0,
            char_end=len(cleaned),
        )
        db.add(page_model)
        doc.page_count = 1
        doc.updated_at = datetime.now(timezone.utc)

        audit = AuditEventModel(
            id=uuid.uuid4(),
            session_id=session_id,
            event_type="document_text_confirmed",
            created_at=datetime.now(timezone.utc),
        )
        db.add(audit)
        db.commit()
        db.refresh(doc)
        return doc


document_service = DocumentService()
