import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertIcon, CheckIcon, TimerIcon } from '../components/icons';
import { Button } from '../components/ui/Button';
import { PIPELINE_STAGES } from '../lib/sampleBriefing';
import { getAnalysis, startAnalysis } from '../lib/api';

/* /d/:id/processing — UX_FLOWS §1, §2, §6.
   Real stage names, in the order the pipeline runs them, and no percentage.
   Polled from the backend every 1.5s.
   The backend is the ONLY source of truth for completion. */

const STAGE_MAP: Record<string, number> = {
  extracting: 0,
  ocr: 0,
  characterizing: 1,
  extracting_facts: 2,
  analyzing: 3,
  verifying: 4,
  complete: 5,
};

export function ProcessingPage() {
  const { id = 'sample' } = useParams();
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);
  const isSample = id === 'sample';

  // Sample fallback mode for offline testing
  const [sampleStage, setSampleStage] = useState(0);

  useEffect(() => {
    if (!isSample) return;
    if (sampleStage >= PIPELINE_STAGES.length) {
      const done = setTimeout(() => navigate(`/d/${id}`, { replace: true }), 600);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setSampleStage((s) => s + 1), 1400);
    return () => clearTimeout(next);
  }, [isSample, sampleStage, id, navigate]);

  // Real document polling at 1.5s
  const { data, error, refetch } = useQuery({
    queryKey: ['analysis-poll', id],
    queryFn: () => getAnalysis(id),
    enabled: !isSample,
    // Bounded. A poll that cannot parse its own answer must not retry for ever.
    retry: 2,
    // A reader who switches tabs during a minute-long analysis must not come
    // back to a screen frozen where they left it.
    refetchIntervalInBackground: true,
    refetchInterval: (query) => {
      const result = query.state.data;
      if (result?.status === 'complete' || result?.status === 'failed') {
        return false;
      }
      if (query.state.status === 'error') return false;
      return 1500;
    },
  });

  const isComplete = !isSample && data?.status === 'complete';
  // A request that never resolved is a failure too. Without this the screen
  // polls silently for ever on a transport or contract error, which is exactly
  // the endless spinner UX_FLOWS §6 rules out.
  const isFailed = !isSample && (data?.status === 'failed' || Boolean(error));

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => navigate(`/d/${id}`, { replace: true }), 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, id, navigate]);

  const currentStageIndex = isSample
    ? sampleStage
    : data?.status === 'processing'
      ? STAGE_MAP[data.stage] ?? 0
      : isComplete
        ? PIPELINE_STAGES.length
        : 0;

  const finished = currentStageIndex >= PIPELINE_STAGES.length;

  async function handleRetry() {
    setRetrying(true);
    try {
      await startAnalysis(id);
      await refetch();
    } catch {
      // Ignored: polling will reflect status
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
      <h1
        className="m-0 font-sans text-[30px] font-medium leading-[1.15] tracking-[-0.024em] text-ink
                   sm:text-[36px] lg:text-[40px]"
      >
        {isFailed
          ? 'Analysis paused'
          : finished
            ? 'Your briefing is ready'
            : 'Reading your document'}
      </h1>

      <p className="m-0 mt-4 max-w-measure font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
        {isFailed
          ? 'Samjo ran into an issue while reading your document.'
          : 'Samjo works through these in order. You can see where it is.'}
      </p>

      {isFailed && (
        <div className="mt-8 rounded-sm border border-[color:var(--danger)] bg-danger-surface p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            <AlertIcon size={20} className="mt-0.5 shrink-0 text-danger" />
            <div className="min-w-0">
              <h2 className="m-0 font-sans text-[18px] font-medium leading-6 text-ink">
                {data?.status === 'failed' && data.message
                  ? data.message
                  : 'Samjo read your document but couldn’t finish the briefing.'}
              </h2>
              <p className="m-0 mt-2 font-sans text-[15.5px] leading-[1.6] text-ink-secondary">
                {data?.status === 'failed' && data.error_code === 'QUOTA_EXHAUSTED'
                  ? 'Daily processing limit reached. Please try again tomorrow.'
                  : 'Your file is still here. Try again.'}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {!(data?.status === 'failed' && data.error_code === 'QUOTA_EXHAUSTED') && (
                  <Button size="md" onClick={handleRetry} disabled={retrying}>
                    {retrying ? 'Starting again...' : 'Try again'}
                  </Button>
                )}
                {data?.status === 'failed' && data.error_code === 'NOT_LEGAL_DOCUMENT' ? (
                  <Link
                    to="/situation"
                    className="inline-flex min-h-[36px] items-center font-sans text-[15px] font-medium text-ink-muted no-underline transition-colors hover:text-primary"
                  >
                    Tell us what happened instead
                  </Link>
                ) : (
                  <Link
                    to="/upload"
                    className="inline-flex min-h-[36px] items-center font-sans text-[15px] font-medium text-ink-muted no-underline transition-colors hover:text-primary"
                  >
                    Upload a different document
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isFailed && (
        <ol className="m-0 mt-10 list-none space-y-0 p-0">
          {PIPELINE_STAGES.map((label, i) => {
            const state =
              i < currentStageIndex ? 'done' : i === currentStageIndex ? 'active' : 'waiting';
            return (
              <li
                key={label}
                className={`flex items-center gap-4 border-b border-hairline py-4 last:border-0 ${
                  state === 'waiting' ? 'opacity-55' : ''
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border ${
                    state === 'done'
                      ? 'border-primary bg-primary'
                      : state === 'active'
                        ? 'border-primary'
                        : 'border-hairline-strong'
                  }`}
                >
                  {state === 'done' && <CheckIcon size={13} className="text-on-primary" />}
                  {state === 'active' && (
                    <span className="h-[8px] w-[8px] rounded-full bg-primary" />
                  )}
                </span>

                <span
                  className={`font-sans text-[17px] leading-[1.5] lg:text-[18px] ${
                    state === 'active' ? 'font-medium text-ink' : 'text-ink-secondary'
                  }`}
                >
                  {label}
                </span>

                {state === 'active' && (
                  <span className="ml-auto font-ui text-[13px] leading-5 text-ink-muted">
                    working
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {/* One announcement per change, never the whole list re-read. */}
      <p aria-live="polite" className="sr-only">
        {isFailed
          ? 'Document analysis failed. You can try again.'
          : finished
            ? 'Your briefing is ready.'
            : PIPELINE_STAGES[currentStageIndex]}
      </p>

      <p className="m-0 mt-8 flex items-center gap-2.5 font-sans text-[15.5px] leading-6 text-ink-muted">
        <TimerIcon size={17} className="shrink-0" />
        Usually about a minute.
      </p>

      <p className="m-0 mt-8 border-t border-hairline pt-6 font-sans text-[15.5px] leading-[1.6] text-ink-muted">
        Changed your mind?{' '}
        <Link
          to="/upload"
          className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
        >
          Go back and use a different document
        </Link>
        .
      </p>
    </div>
  );
}
