import asyncio
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import and_, select, update
from sqlalchemy.orm import Session

from backend.app.core.errors import SamjoError
from backend.app.core.logging import get_logger
from backend.app.core.ratelimit import rate_limiter
from backend.app.models.base import SessionLocal
from backend.app.models.entities import (
    AnalysisItemModel,
    AnalysisModel,
    JobModel,
    SourceSpanModel,
)
from backend.app.prompts import PROMPT_VERSION, SYSTEM_ANALYSIS_INSTRUCTIONS
from backend.app.schemas.ai import (
    AnalysisResponse,
    Conflict,
    Deadline,
    DeterministicFacts,
    MoneyItem,
    Obligation,
    Risk,
    SourceMetadata,
    SourceSpan,
)
from backend.app.services.characterization_service import characterization_service
from backend.app.services.deterministic_service import deterministic_extractor
from backend.app.services.document_service import document_service
from backend.app.services.evidence_service import evidence_service
from backend.app.services.llm.base import LLMProvider
from backend.app.services.llm.factory import get_fallback_llm_provider, get_llm_provider
from backend.app.services.safety_service import safety_service

logger = get_logger("samjo.analysis")


class AnalysisService:
    """
    Coordinates the document analysis lifecycle:
    Stages: extracting -> ocr -> characterizing -> extracting_facts -> analyzing -> verifying -> complete.
    """

    async def start_analysis_job(
        self,
        db: Session,
        document_id: uuid.UUID,
        session_id: uuid.UUID,
        language: str = "en",
    ) -> JobModel:
        # Check document ownership
        _ = document_service.get_document_with_ownership_check(db, document_id, session_id)

        # Check for existing completed analysis (Idempotency - never bill twice)
        stmt_analysis = select(AnalysisModel).where(AnalysisModel.document_id == document_id)
        existing_analysis = db.execute(stmt_analysis).scalar_one_or_none()
        if existing_analysis:
            # Check if there is already a completed job
            stmt_job = select(JobModel).where(
                and_(JobModel.document_id == document_id, JobModel.status == "complete")
            )
            done_job = db.execute(stmt_job).scalar_one_or_none()
            if done_job:
                return done_job

        # Check if already processing
        stmt_active = select(JobModel).where(
            and_(JobModel.document_id == document_id, JobModel.status == "processing")
        )
        active_job = db.execute(stmt_active).scalar_one_or_none()
        if active_job:
            raise SamjoError.already_processing("Analysis is already in progress for this document.")

        # Create new Job
        job_id = uuid.uuid4()
        now = datetime.now(timezone.utc)
        job = JobModel(
            id=job_id,
            document_id=document_id,
            status="processing",
            stage="extracting",
            created_at=now,
            updated_at=now,
        )
        db.add(job)
        db.commit()
        db.refresh(job)

        # Launch async analysis task
        asyncio.create_task(
            self._run_pipeline_async(
                document_id=document_id,
                session_id=session_id,
                job_id=job_id,
                language=language,
            )
        )

        return job

    async def _run_pipeline_async(
        self,
        document_id: uuid.UUID,
        session_id: uuid.UUID,
        job_id: uuid.UUID,
        language: str = "en",
    ) -> None:
        db = SessionLocal()
        try:
            # Acquire concurrency slot (1 per session, 3 per process)
            await rate_limiter.acquire_concurrency(session_id)
            await self._execute_pipeline(db, document_id, session_id, job_id, language)
        except Exception as e:
            logger.error(
                "Pipeline execution failed",
                extra={"extra_data": {"event": "pipeline_error", "error_type": type(e).__name__}},
            )
            # Update job to failed
            db.execute(
                update(JobModel)
                .where(JobModel.id == job_id)
                .values(
                    status="failed",
                    error_code=getattr(e, "code", "PROCESSING_FAILED"),
                    error_message=getattr(e, "message", None) or (
                        "Samjo couldn't finish the briefing. Your file is still here. Try again."
                    ),
                    updated_at=datetime.now(timezone.utc),
                )
            )
            db.commit()
        finally:
            rate_limiter.release_concurrency(session_id)
            db.close()

    async def _execute_pipeline(
        self,
        db: Session,
        document_id: uuid.UUID,
        session_id: uuid.UUID,
        job_id: uuid.UUID,
        language: str = "en",
    ) -> None:
        def update_stage(stage_name: str):
            db.execute(
                update(JobModel)
                .where(JobModel.id == job_id)
                .values(stage=stage_name, updated_at=datetime.now(timezone.utc))
            )
            db.commit()

        # Step 1: extracting
        update_stage("extracting")
        doc = document_service.get_document_with_ownership_check(db, document_id, session_id)
        doc_text, extraction = document_service.get_decrypted_document_text(db, document_id)
        pages_meta = document_service.get_document_pages(db, document_id)

        # Step 2: ocr (if used)
        if doc.ocr_used:
            update_stage("ocr")

        # Step 3: characterizing
        update_stage("characterizing")
        llm = get_llm_provider()
        characterization = await characterization_service.characterize(llm, doc_text)

        # Step 4: extracting_facts
        update_stage("extracting_facts")
        facts = deterministic_extractor.extract(doc_text)

        # Step 5: analyzing
        update_stage("analyzing")
        analysis_raw, provider_used = await self._call_llm_with_retry_and_fallback(
            llm=llm,
            untrusted_document=doc_text,
            known_facts=facts,
            schema=AnalysisResponse,
        )
        analysis_raw.language = language
        analysis_raw.document_type = characterization.document_type
        analysis_raw.type_confidence = characterization.confidence

        # Step 6: verifying (The 4 Validation Gates)
        update_stage("verifying")
        verified_analysis = self._run_verification_gates(
            analysis=analysis_raw,
            document_text=doc_text,
            pages_meta=pages_meta,
            facts=facts,
            doc=doc,
            extraction=extraction,
            situation_context=doc.situation_context,
            model_id=provider_used.model_id,
        )

        # Step 7: complete
        self._persist_analysis(db, document_id, session_id, verified_analysis)

        # Mark job complete
        db.execute(
            update(JobModel)
            .where(JobModel.id == job_id)
            .values(
                status="complete",
                stage="complete",
                updated_at=datetime.now(timezone.utc),
            )
        )
        db.commit()

        logger.info(
            "Pipeline successfully completed",
            extra={
                "extra_data": {
                    "event": "analysis_completed",
                    "dropped_items": verified_analysis.source_metadata.dropped_item_count,
                }
            },
        )

    async def _call_llm_with_retry_and_fallback(
        self,
        llm: LLMProvider,
        untrusted_document: str,
        known_facts: DeterministicFacts,
        schema: Any,
    ) -> tuple[AnalysisResponse, LLMProvider]:
        # The provider already owns the schema-retry budget (LLM_MAX_RETRIES)
        # and the transport-retry budget. Retrying again here would multiply
        # billed calls for one analysis, so this layer does one thing only:
        # swap to the configured fallback provider when the primary is down.
        #
        # Fallback is a provider swap on failure, never a runtime chain — no
        # request calls two providers hoping one answers (RESOURCE_AUDIT §2.3).
        PROVIDER_DOWN = {"AI_UNAVAILABLE", "AI_TIMEOUT", "RATE_LIMITED",
                         "QUOTA_EXHAUSTED", "AI_CONFIG_ERROR"}

        try:
            return (
                await llm.analyze(
                    system_instructions=SYSTEM_ANALYSIS_INSTRUCTIONS,
                    untrusted_document=untrusted_document,
                    known_facts=known_facts,
                    schema=schema,
                ),
                llm,
            )
        except SamjoError as se:
            if se.code not in PROVIDER_DOWN:
                raise
            fallback = get_fallback_llm_provider()
            if fallback is None:
                # Fallback disabled by configuration. Not silently enabled.
                raise
            logger.warning(
                "Primary provider unavailable, using configured fallback",
                extra={"extra_data": {"event": "provider_fallback", "error_code": se.code}},
            )
            # The fallback is what answered, so the fallback is what gets
            # recorded — otherwise a swap during an outage is invisible.
            return (
                await fallback.analyze(
                    system_instructions=SYSTEM_ANALYSIS_INSTRUCTIONS,
                    untrusted_document=untrusted_document,
                    known_facts=known_facts,
                    schema=schema,
                ),
                fallback,
            )

    def _run_verification_gates(
        self,
        analysis: AnalysisResponse,
        document_text: str,
        pages_meta: list[dict],
        facts: DeterministicFacts,
        doc: Any,
        extraction: Any,
        situation_context: str | None = None,
        model_id: str = "unknown",
    ) -> AnalysisResponse:
        """
        Executes Gate 2 (Span Verification), Gate 3 (Safety), and Gate 4 (Deterministic Reconciliation).
        """
        dropped_count = 0

        # Gate 2: Span verification for all quote-bearing items
        verified_obligations: list[Obligation] = []
        for ob in analysis.obligations:
            ok, span = evidence_service.verify_span(
                ob.what_document_says.quoted_text, document_text, pages_meta
            )
            if ok and span:
                ob.what_document_says = span
                verified_obligations.append(ob)
            else:
                dropped_count += 1

        verified_risks: list[Risk] = []
        for rk in analysis.risks:
            ok, span = evidence_service.verify_span(
                rk.what_document_says.quoted_text, document_text, pages_meta
            )
            if ok and span:
                rk.what_document_says = span
                verified_risks.append(rk)
            else:
                dropped_count += 1

        verified_money: list[MoneyItem] = []
        for mi in analysis.money_items:
            ok, span = evidence_service.verify_span(
                mi.what_document_says.quoted_text, document_text, pages_meta
            )
            if ok and span:
                mi.what_document_says = span
                verified_money.append(mi)
            else:
                dropped_count += 1

        verified_deadlines: list[Deadline] = []
        for dl in analysis.deadlines:
            ok, span = evidence_service.verify_span(
                dl.what_document_says.quoted_text, document_text, pages_meta
            )
            if ok and span:
                dl.what_document_says = span
                verified_deadlines.append(dl)
            else:
                dropped_count += 1

        verified_conflicts: list[Conflict] = []
        for conf in analysis.conflicts:
            valid_spans: list[SourceSpan] = []
            for s in conf.spans:
                ok, span = evidence_service.verify_span(s.quoted_text, document_text, pages_meta)
                if ok and span:
                    valid_spans.append(span)
            # A conflict requires at least 2 verified conflicting spans
            if len(valid_spans) >= 2:
                conf.spans = valid_spans
                verified_conflicts.append(conf)
            else:
                dropped_count += 1

        # Urgency evidence
        if analysis.urgency.evidence:
            ok, span = evidence_service.verify_span(
                analysis.urgency.evidence.quoted_text, document_text, pages_meta
            )
            if ok and span:
                analysis.urgency.evidence = span
            else:
                analysis.urgency.evidence = None

        # what_this_is
        if analysis.what_this_is and analysis.what_this_is.what_document_says:
            ok, span = evidence_service.verify_span(
                analysis.what_this_is.what_document_says.quoted_text,
                document_text,
                pages_meta,
            )
            if ok and span:
                analysis.what_this_is.what_document_says = span
            else:
                analysis.what_this_is = None
                dropped_count += 1

        analysis.obligations = verified_obligations
        analysis.risks = verified_risks
        analysis.money_items = verified_money
        analysis.deadlines = verified_deadlines
        analysis.conflicts = verified_conflicts

        # Metadata
        analysis.source_metadata = SourceMetadata(
            page_count=len(pages_meta) or 1,
            ocr_used=doc.ocr_used,
            ocr_confidence=doc.ocr_confidence,
            extraction_char_count=extraction.char_count,
            dropped_item_count=dropped_count,
            model_version=model_id,
            prompt_version=PROMPT_VERSION,
        )

        # Gate 3 & Gate 4
        analysis = safety_service.apply_safety_and_reconciliation(
            analysis=analysis,
            document_text=document_text,
            facts=facts,
            situation_context=situation_context,
        )

        return analysis

    def _persist_analysis(
        self,
        db: Session,
        document_id: uuid.UUID,
        session_id: uuid.UUID,
        analysis: AnalysisResponse,
    ) -> None:
        now = datetime.now(timezone.utc)
        analysis_id = uuid.uuid4()

        # Helper to ensure every verified span has a valid source_id UUID string
        def ensure_span_source_id(span: SourceSpan | None) -> None:
            if span and span.verified:
                if not span.source_id:
                    span.source_id = str(uuid.uuid4())

        for ob in analysis.obligations:
            ensure_span_source_id(ob.what_document_says)
        for rk in analysis.risks:
            ensure_span_source_id(rk.what_document_says)
        for m in analysis.money_items:
            ensure_span_source_id(m.what_document_says)
        for dl in analysis.deadlines:
            ensure_span_source_id(dl.what_document_says)
        if analysis.what_this_is:
            ensure_span_source_id(analysis.what_this_is.what_document_says)
        if analysis.urgency and analysis.urgency.evidence:
            ensure_span_source_id(analysis.urgency.evidence)
        for conf in analysis.conflicts:
            for s in conf.spans:
                ensure_span_source_id(s)

        result_json_payload = analysis.model_dump(mode="json")

        analysis_model = AnalysisModel(
            id=analysis_id,
            document_id=document_id,
            language=analysis.language,
            summary=analysis.summary,
            urgency_level=analysis.urgency.level.value,
            urgency_reason=analysis.urgency.reason,
            urgency_date=analysis.urgency.deadline_date,
            is_high_risk=analysis.safety.is_high_risk,
            high_risk_category=analysis.safety.high_risk_category,
            model_version=analysis.source_metadata.model_version,
            prompt_version=PROMPT_VERSION,
            dropped_item_count=analysis.source_metadata.dropped_item_count,
            status="complete",
            uncertainty=analysis.uncertainty,
            result_json=result_json_payload,
            created_at=now,
        )
        db.add(analysis_model)

        # Helper to persist items and spans
        def save_item(item_type: str, item_obj: Any):
            item_id = uuid.uuid4()
            sev = getattr(item_obj, "severity", None)
            sev_val = None
            if sev is not None:
                sev_val = getattr(sev, "value", str(sev))
            item_model = AnalysisItemModel(
                id=item_id,
                analysis_id=analysis_id,
                type=item_type,
                title=getattr(item_obj, "title", ""),
                explanation=getattr(item_obj, "ai_interpretation", ""),
                confidence=getattr(item_obj, "confidence", 1.0),
                severity=sev_val,
                verification_required=getattr(item_obj, "needs_verification", False),
            )
            db.add(item_model)

            span = getattr(item_obj, "what_document_says", None)
            if span and span.verified and span.source_id:
                try:
                    span_uuid = uuid.UUID(str(span.source_id))
                except (ValueError, TypeError):
                    span_uuid = uuid.uuid4()
                    span.source_id = str(span_uuid)
                span_model = SourceSpanModel(
                    id=span_uuid,
                    item_id=item_id,
                    page=span.page,
                    start_offset=span.start_offset,
                    end_offset=span.end_offset,
                    quoted_text=span.quoted_text,
                    verified=True,
                )
                db.add(span_model)

        for ob in analysis.obligations:
            save_item("obligation", ob)
        for rk in analysis.risks:
            save_item("risk", rk)
        for m in analysis.money_items:
            save_item("money", m)
        for dl in analysis.deadlines:
            save_item("deadline", dl)
        if analysis.what_this_is:
            save_item("what_this_is", analysis.what_this_is)

        if analysis.urgency and analysis.urgency.evidence and analysis.urgency.evidence.verified and analysis.urgency.evidence.source_id:
            urg_item_id = uuid.uuid4()
            db.add(
                AnalysisItemModel(
                    id=urg_item_id,
                    analysis_id=analysis_id,
                    type="urgency",
                    title="Urgency Evidence",
                    explanation=analysis.urgency.reason,
                    confidence=1.0,
                    severity=None,
                    verification_required=False,
                )
            )
            try:
                urg_span_uuid = uuid.UUID(str(analysis.urgency.evidence.source_id))
            except (ValueError, TypeError):
                urg_span_uuid = uuid.uuid4()
                analysis.urgency.evidence.source_id = str(urg_span_uuid)
            db.add(
                SourceSpanModel(
                    id=urg_span_uuid,
                    item_id=urg_item_id,
                    page=analysis.urgency.evidence.page,
                    start_offset=analysis.urgency.evidence.start_offset,
                    end_offset=analysis.urgency.evidence.end_offset,
                    quoted_text=analysis.urgency.evidence.quoted_text,
                    verified=True,
                )
            )

        for conf in analysis.conflicts:
            for s in conf.spans:
                if s.verified and s.source_id:
                    c_item_id = uuid.uuid4()
                    db.add(
                        AnalysisItemModel(
                            id=c_item_id,
                            analysis_id=analysis_id,
                            type="conflict",
                            # Conflict carries no title in AI_SCHEMAS — id, description,
                            # spans and note. Reading conf.title raised
                            # AttributeError for any document with contradictory
                            # clauses, which is exactly the case this row exists
                            # to record.
                            title="Conflicting clauses",
                            explanation=conf.description or conf.note,
                            confidence=1.0,
                            severity=None,
                            verification_required=False,
                        )
                    )
                    try:
                        c_span_uuid = uuid.UUID(str(s.source_id))
                    except (ValueError, TypeError):
                        c_span_uuid = uuid.uuid4()
                        s.source_id = str(c_span_uuid)
                    db.add(
                        SourceSpanModel(
                            id=c_span_uuid,
                            item_id=c_item_id,
                            page=s.page,
                            start_offset=s.start_offset,
                            end_offset=s.end_offset,
                            quoted_text=s.quoted_text,
                            verified=True,
                        )
                    )

        db.commit()


analysis_service = AnalysisService()
