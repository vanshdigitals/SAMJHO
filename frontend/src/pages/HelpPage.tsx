import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BackIcon, TakeWithIcon, UnclearIcon, WatchOutIcon } from '../components/icons';
import { DeletedState } from '../components/product/Grounding';
import { NotFoundState } from '../components/product/NotFoundState';
import { AnalysisErrorState } from '../components/product/AnalysisErrorState';
import { HelpSkeleton } from '../components/product/HelpSkeleton';
import { SAMPLE, type Briefing, type BriefingItem, type DetailItem } from '../lib/sampleBriefing';
import { ApiError, getAnalysis, startAnalysis, transformAnalysisToBriefing } from '../lib/api';
import { isDocumentDeleted } from '../lib/documentState';

/* /d/:id/help — professional help and lawyer preparation (UX_FLOWS §1).
   Every question carries its reason, and every uncertainty is the one the
   briefing already marked Verify. */

const WHY: Record<string, string> = {
  'Does the notice period run from the date on the letter, or the date I received it?':
    'The notice says “within thirty (30) days of receipt”. Which date starts the clock changes the deadline.',
  'Does the deposit clause let you deduct repair costs without giving me an itemised list?':
    'The agreement mentions deductions at the landlord’s discretion but doesn’t say whether an itemised list is required.',
  'What is the ₹25,000 in arrears made up of?':
    'The notice states the amount but not how it was arrived at.',
  'What happens if I dispute the amount and stay past the notice period?':
    'The document doesn’t say, and the answer depends on your situation rather than on the text.',
};

const TAKE = [
  'The notice you received, and the envelope if you still have it',
  'Your rental agreement',
  'Rent receipts or payment records',
  'Anything you have already sent in writing',
];

export function HelpPage() {
  const { id = 'sample' } = useParams();
  const isSample = id === 'sample';
  const [deleted] = useState(() => isDocumentDeleted(id));
  const [retrying, setRetrying] = useState(false);

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

  const unsure = useMemo(() => {
    if (!briefing) return [];
    const allItems: (BriefingItem | DetailItem)[] = [
      ...briefing.mustDo,
      ...briefing.watchOut,
      ...briefing.details,
      ...briefing.dates,
    ];
    return allItems.filter((i) => Boolean(i.verify));
  }, [briefing]);

  async function handleRetry() {
    setRetrying(true);
    try {
      if (!isSample) {
        await startAnalysis(id);
      }
      await refetch();
    } catch {
      // Ignored
    } finally {
      setRetrying(false);
    }
  }

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

  // State 3: Loading skeleton
  const isLoadingState = !isSample && (isLoading || !pollResult || pollResult.status === 'processing');
  if (isLoadingState || !briefing) {
    return <HelpSkeleton />;
  }

  // State 4: Complete

  return (
    <div className="mx-auto w-full max-w-[1040px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <Link
        to={`/d/${id}`}
        className="inline-flex items-center gap-2 font-sans text-[15px] leading-6 text-ink-muted
                   no-underline transition-colors duration-200 ease-out hover:text-primary"
      >
        <BackIcon size={16} className="shrink-0" />
        Back to your briefing
      </Link>

      <h1
        className="m-0 mt-6 font-sans text-[32px] font-medium leading-[1.1] tracking-[-0.026em]
                   text-ink sm:text-[38px] lg:text-[44px]"
      >
        Walk in knowing what to ask
      </h1>
      <p className="m-0 mt-4 max-w-measure font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
        Legal help costs money, and much of a first consultation goes on explaining the basics.
        This is that part, already done.
      </p>

      <section className="mt-10 lg:mt-12">
        <h2 className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted">
          Questions worth asking
        </h2>

        {briefing.questions.length === 0 ? (
          <p className="mt-5 font-sans text-[16px] leading-[1.6] text-ink-secondary">
            No specific questions were flagged for this document. You can still take your document and notes to a professional consultation.
          </p>
        ) : (
          <ol className="m-0 mt-5 list-none p-0">
            {briefing.questions.map((q, i) => (
              <li key={q} className={`py-6 ${i > 0 ? 'border-t border-hairline' : 'pt-0'}`}>
                <div className="flex gap-4 sm:gap-5">
                  <span className="font-ui text-[14px] font-medium leading-7 tabular-nums text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 max-w-measure font-sans text-[18px] font-medium leading-[1.45] text-ink lg:text-[20px]">
                      “{q}”
                    </p>
                    <p className="m-0 mt-2.5 max-w-measure font-sans text-[16px] leading-[1.6] text-ink-secondary">
                      <span className="text-ink-muted">Why this one matters — </span>
                      {briefing.questionRationales?.[q] ||
                        WHY[q] ||
                        'A legal professional can help verify how this term is applied and interpreted in practice.'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <section className="rounded-md border border-hairline bg-surface p-5 shadow-subtle sm:p-6">
          <h2 className="m-0 flex items-center gap-2.5 font-sans text-[18px] font-medium leading-[1.35] text-ink">
            <TakeWithIcon size={18} className="shrink-0 text-ink-muted" />
            What to take with you
          </h2>
          <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
            {TAKE.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full bg-hairline-strong"
                />
                <span className="font-sans text-[16px] leading-[1.6] text-ink-secondary">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-md border border-hairline bg-surface p-5 shadow-subtle sm:p-6">
          <h2 className="m-0 flex items-center gap-2.5 font-sans text-[18px] font-medium leading-[1.35] text-ink">
            <UnclearIcon size={18} className="shrink-0 text-ink-muted" />
            Where Samjo wasn’t sure
          </h2>
          <ul className="m-0 mt-4 list-none space-y-3.5 p-0">
            {unsure.length > 0 ? (
              unsure.map((item) => (
                <li key={item.id}>
                  <p className="m-0 font-sans text-[16px] leading-[1.55] text-ink-secondary">
                    {'text' in item ? item.text : `${item.label} — ${item.value}`}
                    <span className="ml-2 whitespace-nowrap font-medium text-warning">Verify</span>
                  </p>
                  {item.evidence?.check && (
                    <p className="m-0 mt-1.5 font-sans text-[15px] leading-[1.55] text-ink-muted">
                      {item.evidence.check}
                    </p>
                  )}
                </li>
              ))
            ) : (
              <li className="font-sans text-[15px] leading-6 text-ink-muted">
                All claims matched extracted text. Check standard statutory rights with a professional.
              </li>
            )}
          </ul>
        </section>
      </div>

      <p className="mx-auto mt-10 flex max-w-[680px] items-start gap-3 font-sans text-[16px] leading-[1.6] text-ink-secondary">
        <WatchOutIcon size={19} className="mt-1 shrink-0 text-warning" />
        <span>
          Where a document looks time-sensitive, or the situation is serious, getting help comes
          before reading further.
        </span>
      </p>

      <p className="m-0 mt-8 border-t border-hairline pt-6 font-sans text-[15px] leading-[1.6] text-ink-muted">
        {briefing.disclaimer}
      </p>
    </div>
  );
}
