import { useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AlertIcon,
  CalendarIcon,
  ChevronDownIcon,
  DetailsIcon,
  FileTextIcon,
  NextStepsIcon,
  QuestionIcon,
  WatchOutIcon,
} from '../components/icons';
import {
  DeletedState,
  GroundingStrip,
  RetentionNotice,
  UncertaintyBlock,
} from '../components/product/Grounding';
import { NotFoundState } from '../components/product/NotFoundState';
import { AnalysisErrorState } from '../components/product/AnalysisErrorState';
import { BriefingSkeleton } from '../components/product/BriefingSkeleton';
import {
  EvidenceBody,
  EvidenceHeading,
  EvidenceMarker,
  EvidenceSheet,
} from '../components/product/Evidence';
import { ButtonLink } from '../components/ui/Button';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SAMPLE, type Briefing, type BriefingItem, type DetailItem, type Evidence } from '../lib/sampleBriefing';
import {
  ApiError,
  deleteDocument,
  getAnalysis,
  getSourceSpan,
  startAnalysis,
  transformAnalysisToBriefing,
} from '../lib/api';
import { isDocumentDeleted, markDocumentDeleted } from '../lib/documentState';

/* /d/:id — the briefing (UX_FLOWS §1, §4, §5).
   Section order is fixed: 8 sections in order.
   Evidence hangs off the item it belongs to.
   Text is rendered strictly as text, escaping any document text. */

const SECTIONS = [
  { id: 'urgency', label: 'Time-sensitive' },
  { id: 'what-this-is', label: 'What this is' },
  { id: 'must-do', label: 'What you need to do' },
  { id: 'watch-out', label: 'Watch out' },
  { id: 'details', label: 'Important details' },
  { id: 'dates', label: 'Dates that matter' },
  { id: 'questions', label: 'Questions to ask' },
  { id: 'next', label: 'What to do next' },
];

export function BriefingPage() {
  const { id = 'sample' } = useParams();
  const hasEvidencePane = useMediaQuery('(min-width: 1280px)');
  const isWide = useMediaQuery('(min-width: 1024px)');
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(() => isDocumentDeleted(id));
  const [retrying, setRetrying] = useState(false);

  const isSample = id === 'sample';

  const {
    data: pollResult,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['briefing', id],
    queryFn: () => getAnalysis(id),
    enabled: !isSample,
    retry: 2,
    refetchInterval: (query) => {
      const result = query.state.data;
      if (result?.status === 'complete' || result?.status === 'failed') {
        return false;
      }
      if (query.state.status === 'error') return false;
      return 1500;
    },
  });

  const briefing: Briefing | null = useMemo(() => {
    if (isSample) {
      return SAMPLE;
    }
    if (pollResult?.status === 'complete') {
      return transformAnalysisToBriefing(pollResult.data);
    }
    return null;
  }, [isSample, pollResult]);

  async function handleRetry() {
    setRetrying(true);
    try {
      if (!isSample) {
        await startAnalysis(id);
      }
      await refetch();
    } catch {
      // Ignored: polling or error state will update
    } finally {
      setRetrying(false);
    }
  }

  async function handleDelete() {
    try {
      if (!isSample) {
        markDocumentDeleted(id);
        await deleteDocument(id);
      }
    } catch {
      // Ignored
    } finally {
      markDocumentDeleted(id);
      setDeleted(true);
    }
  }

  /* Every sourced claim on the page, indexed so a marker can resolve to its
     own evidence without the sections having to know about each other. */
  const sourced = useMemo(() => {
    const map = new Map<string, { label: string; evidence: Evidence }>();
    if (!briefing) return map;
    const add = (key: string, label: string, evidence?: Evidence) => {
      if (evidence) map.set(key, { label, evidence });
    };
    if (briefing.whatThisIs.evidence) {
      add('what-this-is', briefing.whatThisIs.text, briefing.whatThisIs.evidence);
    }
    [...briefing.mustDo, ...briefing.watchOut].forEach((i) => add(i.id, i.text, i.evidence));
    [...briefing.details, ...briefing.dates].forEach((d) =>
      add(d.id, `${d.label} — ${d.value}`, d.evidence),
    );
    return map;
  }, [briefing]);

  const open = openId ? sourced.get(openId) ?? null : null;
  const activeSourceId = !isSample && open?.evidence?.sourceId ? open.evidence.sourceId : null;

  const { data: sourceDetail, isLoading: isLoadingSource } = useQuery({
    queryKey: ['sourceSpan', id, activeSourceId],
    queryFn: () => getSourceSpan(id, activeSourceId!),
    enabled: Boolean(activeSourceId),
    staleTime: 5 * 60 * 1000,
  });

  const activeEvidence: Evidence | null = useMemo(() => {
    if (!open) return null;
    if (!sourceDetail || sourceDetail.source_id !== open.evidence.sourceId) {
      return {
        ...open.evidence,
        isLoadingContext: isLoadingSource,
      };
    }
    return {
      ...open.evidence,
      quote: sourceDetail.quoted_text || open.evidence.quote,
      page: sourceDetail.page || open.evidence.page,
      contextBefore: sourceDetail.context_before,
      contextAfter: sourceDetail.context_after,
      isLoadingContext: false,
    };
  }, [open, sourceDetail, isLoadingSource]);

  const markerProps = (key: string) => ({
    label: sourced.get(key)?.label ?? '',
    active: openId === key,
    onClick: () => setOpenId((current) => (current === key ? null : key)),
  });

  // State 1: Document deleted
  if (deleted || isDocumentDeleted(id)) {
    return <DeletedState />;
  }

  // State 2: Failed analysis
  const isFailed = !isSample && (isError || pollResult?.status === 'failed');
  if (isFailed) {
    let errorCode: string | undefined = pollResult?.status === 'failed' ? pollResult.error_code : undefined;
    let errorMessage: string | undefined = pollResult?.status === 'failed' ? pollResult.message : undefined;

    if (queryError) {
      if (queryError instanceof ApiError) {
        errorCode = queryError.code;
        errorMessage = queryError.message;
      } else {
        errorCode = 'BACKEND_UNAVAILABLE';
        errorMessage = 'Samjo could not connect to the server. Please check your network connection and try again.';
      }
    }

    if (
      errorCode === 'NOT_FOUND' ||
      errorCode === 'HTTP_404' ||
      errorCode === 'VALIDATION_ERROR' ||
      errorCode === 'HTTP_422'
    ) {
      return <NotFoundState />;
    }
    return (
      <AnalysisErrorState
        errorCode={errorCode}
        message={errorMessage}
        onRetry={handleRetry}
        isRetrying={retrying}
      />
    );
  }

  // State 3: Loading / processing skeleton
  const isLoadingState = !isSample && (isLoading || !pollResult || pollResult.status === 'processing');
  if (isLoadingState || !briefing) {
    return <BriefingSkeleton />;
  }

  // State 4: Complete (either /d/sample or real analysis complete)

  return (
    <div className="mx-auto w-full max-w-shell px-5 py-10 sm:px-6 md:py-12 lg:px-8 lg:py-14">
      {/* ── Document header ─────────────────────────────────────── */}
      <div className="border-b border-hairline pb-6">
        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 font-ui text-[13px] leading-5 text-ink-muted">
          <FileTextIcon size={15} className="shrink-0" />
          {briefing.fileName}
          <span aria-hidden>·</span>
          {briefing.pages} pages
          <span aria-hidden>·</span>
          Dated {briefing.dated}
        </p>

        <h1
          className="m-0 mt-3 font-sans text-[30px] font-medium leading-[1.12] tracking-[-0.024em]
                     text-ink sm:text-[36px] lg:text-[42px]"
        >
          {briefing.documentType}
        </h1>

        <p className="m-0 mt-3 flex flex-wrap items-center gap-2.5 font-sans text-[15px] leading-6 text-ink-muted">
          How confident is Samjo?
          <span className="rounded-sm bg-success-surface px-2 py-0.5 font-medium text-success">
            {briefing.typeConfidence}
          </span>
        </p>

        {/* Safety disclosure, contextual rather than a permanent banner (UX_FLOWS §9) */}
        <p className="m-0 mt-5 max-w-measure font-sans text-[15px] leading-[1.6] text-ink-muted">
          {briefing.disclaimer}
        </p>

        <div className="max-w-measure">
          <GroundingStrip
            groundedCount={sourced.size}
            droppedCount={briefing.sourceMetadata.droppedItemCount}
            ocrUsed={briefing.sourceMetadata.ocrUsed}
            ocrLowConfidence={(briefing.sourceMetadata.ocrConfidence ?? 1) < 0.6}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[200px_minmax(0,1fr)_360px] xl:gap-14">
        {/* ── Jump list ─────────────────────────────────────────── */}
        <nav aria-label="Briefing sections" className="hidden lg:block">
          <ol className="sticky top-[120px] m-0 list-none p-0">
            {SECTIONS.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex gap-3 py-2 font-sans text-[15px] leading-6 text-ink-secondary
                             no-underline transition-colors duration-200 ease-out hover:text-primary"
                >
                  <span className="font-ui text-[12px] leading-6 tabular-nums text-ink-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Reading column: the 68ch measure holds at every width ─── */}
        <div className="min-w-0 max-w-measure">
          {/* 01 — urgency. HIGH and CRITICAL only, absent when normal. */}
          {briefing.urgency && (
            <section id="urgency" className="scroll-mt-[120px]">
              <div className="flex gap-3.5 rounded-sm border border-[color:var(--warning)] border-opacity-25 bg-warning-surface px-4 py-4 sm:px-5">
                <AlertIcon className="mt-0.5 shrink-0 text-warning" />
                <div className="min-w-0">
                  <h2 className="m-0 font-sans text-[12.5px] font-medium uppercase leading-4 tracking-[0.09em] text-warning">
                    {briefing.urgency.level}
                  </h2>
                  <p className="m-0 mt-2 font-sans text-[19px] font-medium leading-[1.4] text-ink lg:text-[20px]">
                    {briefing.urgency.line}
                  </p>
                  <p className="m-0 mt-2.5 font-sans text-[15.5px] leading-[1.6] text-ink-secondary">
                    {briefing.urgency.escalation}
                  </p>
                </div>
              </div>
            </section>
          )}

          <Section id="what-this-is" n="02" title="What this is" collapsible={!isWide} defaultOpen>
            <p className="m-0 font-sans text-[18px] leading-[1.6] text-ink-secondary">
              {briefing.whatThisIs.text}
              {briefing.whatThisIs.evidence && (
                <span className="ml-3 inline-block align-middle">
                  <EvidenceMarker {...markerProps('what-this-is')} />
                </span>
              )}
            </p>
          </Section>

          <Section
            id="must-do"
            n="03"
            title="What you need to do"
            collapsible={!isWide}
            defaultOpen
          >
            <ItemList items={briefing.mustDo} markerProps={markerProps} />
          </Section>

          <Section
            id="watch-out"
            n="04"
            title="Watch out"
            icon={<WatchOutIcon className="text-warning" />}
            collapsible={!isWide}
          >
            <ItemList items={briefing.watchOut} markerProps={markerProps} />
          </Section>

          <Section
            id="details"
            n="05"
            title="Important details"
            icon={<DetailsIcon className="text-ink-muted" />}
            collapsible={!isWide}
          >
            <DetailList items={briefing.details} markerProps={markerProps} />
          </Section>

          <Section
            id="dates"
            n="06"
            title="Dates that matter"
            icon={<CalendarIcon className="text-ink-muted" />}
            collapsible={!isWide}
          >
            <DetailList items={briefing.dates} markerProps={markerProps} />
          </Section>

          <Section
            id="questions"
            n="07"
            title="Questions to ask"
            icon={<QuestionIcon className="text-ink-muted" />}
            collapsible={!isWide}
          >
            <ol className="m-0 list-none space-y-4 p-0">
              {briefing.questions.map((q, i) => (
                <li key={q} className="flex gap-3.5">
                  <span className="font-ui text-[13px] font-medium leading-7 tabular-nums text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-[18px] leading-[1.6] text-ink-secondary">{q}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section
            id="next"
            n="08"
            title="What to do next"
            icon={<NextStepsIcon className="text-ink-muted" />}
            collapsible={false}
            defaultOpen
          >
            <p className="m-0 font-sans text-[18px] leading-[1.6] text-ink-secondary">
              {briefing.nextSteps}
            </p>
            <ButtonLink to={`/d/${id}/help`} size="md" className="mt-6">
              Prepare for professional help
            </ButtonLink>
          </Section>
        </div>

        {/* ── Evidence pane, 1280 and up ────────────────────────── */}
        {hasEvidencePane && (
          <aside className="hidden xl:block">
            <div className="sticky top-[120px] rounded-md border border-hairline bg-surface p-5 shadow-subtle">
              <EvidenceHeading />
              {open && activeEvidence ? (
                <>
                  <p className="m-0 mt-2 font-sans text-[16px] font-medium leading-[1.45] text-ink">
                    {open.label}
                  </p>
                  <div className="mt-5">
                    <EvidenceBody evidence={activeEvidence} />
                  </div>
                </>
              ) : (
                <p className="m-0 mt-3 font-sans text-[15px] leading-[1.6] text-ink-muted">
                  Choose a marker beside any point and the exact sentence it came from appears
                  here, with Samjo’s reading kept separate from the quote.
                </p>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Below 1280 the same evidence arrives as a bottom sheet. */}
      {!hasEvidencePane && (
        <EvidenceSheet
          open={openId !== null}
          onOpenChange={(next) => !next && setOpenId(null)}
          evidence={activeEvidence}
          label={open?.label ?? ''}
        />
      )}

      <div className="max-w-measure lg:ml-[238px] xl:ml-[248px]">
        <UncertaintyBlock items={briefing.uncertainty} />

        <RetentionNotice
          hoursLeft={briefing.deleteAfterHours}
          onDelete={handleDelete}
        />

        <p className="mt-6 font-sans text-[15px] leading-[1.6] text-ink-muted">
          Not what you expected?{' '}
          <Link
            to="/upload"
            className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
          >
            Show us a different document
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

type MarkerProps = (key: string) => { label: string; active: boolean; onClick: () => void };

function ItemList({ items, markerProps }: { items: BriefingItem[]; markerProps: MarkerProps }) {
  return (
    <ul className="m-0 list-none space-y-4 p-0">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3">
          <span
            aria-hidden
            className={`mt-[10px] h-[7px] w-[7px] shrink-0 rounded-full ${
              item.verify ? 'border border-warning bg-transparent' : 'bg-primary'
            }`}
          />
          <span className="font-sans text-[18px] leading-[1.6] text-ink-secondary">
            {item.text}
            {item.verify && (
              <span className="ml-2 whitespace-nowrap font-sans text-[14px] font-medium text-warning">
                Verify
              </span>
            )}
            {item.evidence && (
              <span className="ml-3 inline-block align-middle">
                <EvidenceMarker {...markerProps(item.id)} />
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function DetailList({ items, markerProps }: { items: DetailItem[]; markerProps: MarkerProps }) {
  return (
    <dl className="m-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-0"
        >
          <dt className="m-0 font-sans text-[16.5px] leading-7 text-ink-secondary">{item.label}</dt>
          <dd className="m-0 flex items-baseline gap-2.5">
            {item.verify && (
              <span className="font-sans text-[13.5px] font-medium text-warning">Verify</span>
            )}
            <span className="font-ui text-[16.5px] leading-7 tabular-nums text-ink">
              {item.value}
            </span>
            {item.evidence && (
              <span className="inline-block self-center">
                <EvidenceMarker {...markerProps(item.id)} />
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Section({
  id,
  n,
  title,
  icon,
  children,
  collapsible,
  defaultOpen = false,
}: {
  id: string;
  n: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  collapsible: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const shown = collapsible ? open : true;
  const panelId = `${id}-panel`;

  const heading = (
    <span className="flex min-w-0 items-center gap-2.5 text-left">
      <span className="font-ui text-[12px] leading-5 tabular-nums text-ink-muted">{n}</span>
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      <span className="font-sans text-[19px] font-medium leading-[1.35] text-ink lg:text-[21px]">
        {title}
      </span>
    </span>
  );

  return (
    <section id={id} className="mt-8 scroll-mt-[120px] border-t border-hairline pt-6 lg:mt-10">
      <h2 className="m-0">
        {collapsible ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between gap-4 border-0
                       bg-transparent px-0 py-1 text-left"
          >
            {heading}
            <span
              aria-hidden
              data-motion="transform"
              className={`flex h-9 w-9 shrink-0 items-center justify-center text-ink-muted
                          transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
            >
              <ChevronDownIcon size={18} />
            </span>
          </button>
        ) : (
          heading
        )}
      </h2>

      <div id={panelId} hidden={!shown} className="mt-4">
        {children}
      </div>
    </section>
  );
}
