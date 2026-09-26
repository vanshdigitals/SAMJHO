import { useRef, useState, type DragEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  BackIcon,
  CameraIcon,
  ChooseFileIcon,
  ClockIcon,
  DeleteIcon,
  NoAccountIcon,
  NoLogIcon,
  TimerIcon,
} from '../components/icons';
import { ApiError, startAnalysis, uploadDocument } from '../lib/api';

/* /upload — "Show us the document" (UX_FLOWS §1, §7).

   Not a dropzone with a cloud icon. The surface the file lands on is a page:
   a document-shaped panel with the limits written on it, so the thing being
   asked for is visible rather than implied.

   Validation happens here for the two conditions a browser can actually
   check — type and size — using the exact error copy from UX_FLOWS §6. Page
   count is not knowable client-side, so it is stated as a limit and left to
   the server rather than guessed at. */

const MAX_BYTES = 10 * 1024 * 1024;

const ACCEPTED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const REASSURANCE = [
  { Icon: NoAccountIcon, text: 'No account. Nothing that identifies you.' },
  { Icon: ClockIcon, text: 'Deleted within 24 hours, or the moment you ask.' },
  { Icon: NoLogIcon, text: 'The text of your document is never written into any log.' },
];

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function validate(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) {
    return 'Samjo reads PDF, Word and photos. This file is a different type.';
  }
  if (file.size > MAX_BYTES) {
    return 'This file is over 10 MB. Try uploading just the pages that matter.';
  }
  return null;
}

export function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviewingOcr, setReviewingOcr] = useState<{
    documentId: string;
    text: string;
    confidence: number | null;
  } | null>(null);

  function accept(next: File | undefined) {
    if (!next) return;
    const problem = validate(next);
    if (problem) {
      /* The rejected file is not kept, but the previously accepted one is —
         UX_FLOWS §6: retry never loses the file you already gave us. */
      setError(problem);
      return;
    }
    setError(null);
    setReviewingOcr(null);
    setFile(next);
  }

  async function handleSubmit() {
    if (!file || loading) return;
    setLoading(true);
    setError(null);

    try {
      const doc = await uploadDocument(file, context);
      if (doc.ocr_low_confidence && doc.extracted_text) {
        setReviewingOcr({
          documentId: doc.document_id,
          text: doc.extracted_text,
          confidence: doc.ocr_confidence ?? null,
        });
        setLoading(false);
        return;
      }
      await startAnalysis(doc.document_id);
      navigate(`/d/${doc.document_id}/processing`);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof ApiError) {
        if (err.statusCode === 413 || err.code === 'FILE_TOO_LARGE') {
          setError('This file is over 10 MB. Try uploading just the pages that matter.');
        } else if (err.statusCode === 415 || err.code === 'UNSUPPORTED_TYPE') {
          setError('Samjo reads PDF, Word and photos. This file is a different type.');
        } else if (err.code === 'FILE_ENCRYPTED') {
          setError("This PDF is password-protected, so Samjo can't open it. Remove the password and upload it again.");
        } else if (err.code === 'OCR_UNAVAILABLE') {
          setError('Optical character recognition is temporarily unavailable. Try uploading a text-searchable PDF or Word document.');
        } else if (err.code === 'EXTRACTION_EMPTY') {
          setError("Samjo couldn't read this document. It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF.");
        } else if (err.code === 'NOT_LEGAL_DOCUMENT') {
          setError("This doesn't look like a legal document. If something has happened and you want help thinking it through, tell us about it instead.");
        } else if (err.statusCode === 429 || err.code === 'RATE_LIMITED') {
          setError("Too many requests. Please wait a little while before trying again.");
        } else {
          setError(err.message || "Samjo couldn't finish reading this document. Please try again.");
        }
      } else {
        setError("Samjo couldn't connect to the server. Please check your connection and try again.");
      }
    }
  }

  async function handleConfirmOcr() {
    if (!reviewingOcr || loading) return;
    setLoading(true);
    setError(null);
    try {
      await startAnalysis(reviewingOcr.documentId, 'en', reviewingOcr.text);
      navigate(`/d/${reviewingOcr.documentId}/processing`);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Samjo couldn't start the briefing. Please try again.");
      }
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="mx-auto w-full max-w-[1040px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <Link
        to="/start"
        className="inline-flex items-center gap-2 font-sans text-[15px] leading-6 text-ink-muted
                   no-underline transition-colors duration-200 ease-out hover:text-primary"
      >
        <BackIcon size={16} className="shrink-0" />
        Other ways to start
      </Link>

      <h1
        className="m-0 mt-6 font-sans text-[32px] font-medium leading-[1.1] tracking-[-0.026em]
                   text-ink sm:text-[38px] lg:text-[44px]"
      >
        Show us the document
      </h1>
      <p className="m-0 mt-4 max-w-measure font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
        A rental agreement, a housing notice, or a photo of a letter. One document at a time.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-[7fr_5fr] lg:gap-12">
        {/* ── The surface the document lands on ─────────────────── */}
        {reviewingOcr ? (
          <div>
            <div className="rounded-md border border-[color:var(--warning)] bg-warning-surface/30 p-5 sm:p-6">
              <h2 className="m-0 font-sans text-[20px] font-medium leading-[1.3] text-ink">
                Check what Samjo read from your image
              </h2>
              <p className="m-0 mt-2 font-sans text-[15px] leading-[1.6] text-ink-secondary">
                Samjo read this photo, but confidence was low
                {reviewingOcr.confidence !== null ? ` (${Math.round(reviewingOcr.confidence * 100)}%)` : ''}.
                Please review the extracted text and fix any mistakes before we analyze it.
              </p>

              <label htmlFor="ocr-text-edit" className="mt-4 block font-sans text-[15px] font-medium text-ink">
                Extracted text
              </label>
              <textarea
                id="ocr-text-edit"
                value={reviewingOcr.text}
                rows={8}
                onChange={(e) => setReviewingOcr({ ...reviewingOcr, text: e.target.value })}
                className="mt-2 block w-full resize-y rounded-sm border border-hairline-strong bg-surface
                           p-3 font-mono text-[14px] leading-[1.6] text-ink focus:border-primary focus:outline-none"
              />

              {error && (
                <p
                  role="alert"
                  className="m-0 mt-4 flex gap-3 rounded-sm border border-[color:var(--danger)] bg-danger-surface
                             px-4 py-3 font-sans text-[15.5px] leading-[1.55] text-ink"
                >
                  <span aria-hidden className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full bg-danger" />
                  <span>{error}</span>
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  disabled={loading || reviewingOcr.text.trim().length < 10}
                  onClick={handleConfirmOcr}
                >
                  {loading ? 'Starting analysis...' : 'Confirm and analyze'}
                </Button>
                <Button
                  variant="secondary"
                  disabled={loading}
                  onClick={() => {
                    setReviewingOcr(null);
                    setFile(null);
                    setError(null);
                  }}
                >
                  Try a clearer photo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`rounded-md border bg-background p-4 transition-colors duration-200 ease-out sm:p-6 ${
              dragging ? 'border-primary bg-primary-subtle' : 'border-hairline'
            }`}
          >
            {file ? (
              <ChosenFile
                name={file.name}
                size={formatSize(file.size)}
                onClear={() => {
                  setFile(null);
                  setError(null);
                }}
              />
            ) : (
              <EmptyPage />
            )}
          </div>

          {/* The inputs themselves stay off-screen; the buttons are the
              controls, so their labels can say what actually happens. */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(e) => accept(e.target.files?.[0])}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => accept(e.target.files?.[0])}
          />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="secondary"
              size="md"
              onClick={() => inputRef.current?.click()}
              aria-describedby={error ? 'file-error' : 'file-limits'}
            >
              <ChooseFileIcon size={18} className="shrink-0 text-ink-secondary" />
              {file ? 'Choose a different file' : 'Choose a file'}
            </Button>

            {/* A phone camera is a real input here; on a desktop it would
                only open the same picker, so it is not offered there. */}
            <Button
              variant="secondary"
              size="md"
              className="md:hidden"
              onClick={() => cameraRef.current?.click()}
            >
              <CameraIcon size={18} className="shrink-0 text-ink-secondary" />
              Take a photo
            </Button>

            <span className="hidden font-sans text-[15px] leading-6 text-ink-muted md:inline">
              or drag it onto the page above
            </span>
          </div>

          <p id="file-limits" className="m-0 mt-4 font-sans text-[15px] leading-6 text-ink-muted">
            PDF, Word, or a photo — up to 10 MB and 30 pages.
          </p>

          {error && (
            <p
              id="file-error"
              role="alert"
              className="m-0 mt-4 flex gap-3 rounded-sm border border-[color:var(--danger)] bg-danger-surface
                         px-4 py-3 font-sans text-[15.5px] leading-[1.55] text-ink"
            >
              <span aria-hidden className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full bg-danger" />
              <span>{error}</span>
            </p>
          )}

          {/* Optional context. API.md POST /documents already accepts
              `situation_context` capped at 500 characters; nothing was
              collecting it. One sentence about why the document arrived
              changes what Samjo looks for, and costs the reader nothing. */}
          <div className="mt-8 border-t border-hairline pt-6">
            <label htmlFor="situation-context" className="block">
              <span className="font-sans text-[16px] font-medium leading-6 text-ink">
                Anything we should know about this document?
              </span>
              <span className="ml-2 font-sans text-[15px] leading-6 text-ink-muted">Optional</span>
            </label>
            <p id="context-hint" className="m-0 mt-1.5 font-sans text-[15px] leading-[1.55] text-ink-muted">
              One sentence is enough — when it arrived, or what worries you about it. Don’t include
              anything that identifies you.
            </p>

            <textarea
              id="situation-context"
              value={context}
              maxLength={500}
              rows={3}
              aria-describedby="context-hint context-count"
              placeholder="It arrived on 14 March and I don’t know if I have to leave."
              onChange={(e) => setContext(e.target.value)}
              className="mt-3 block w-full resize-y rounded-sm border border-hairline-strong bg-surface
                         px-4 py-3 font-sans text-[16px] leading-[1.6] text-ink placeholder:text-ink-muted
                         transition-colors duration-200 ease-out hover:border-ink-muted
                         focus:border-primary focus:outline-none"
            />
            <p id="context-count" className="m-0 mt-2 font-ui text-[13px] leading-5 tabular-nums text-ink-muted">
              {context.length} / 500
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:gap-6">
            <Button
              disabled={!file || loading}
              onClick={handleSubmit}
              aria-describedby="timing"
            >
              {loading ? 'Reading your document...' : 'Show us the document'}
            </Button>

            <p
              id="timing"
              className="m-0 flex items-center gap-2.5 font-sans text-[15.5px] leading-6 text-ink-muted"
            >
              <TimerIcon size={17} className="shrink-0" />
              Usually about a minute.
            </p>
          </div>

          <p className="m-0 mt-6 font-sans text-[15.5px] leading-[1.6] text-ink-muted">
            Don’t have the document to hand?{' '}
            <Link
              to="/situation"
              className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
            >
              Tell us what happened instead
            </Link>
            .
          </p>
        </div>
        )}

        {/* ── What happens to it ────────────────────────────────── */}
        <aside className="rounded-md border border-hairline bg-surface p-5 shadow-subtle sm:p-6">
          <h2 className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted">
            What happens to it
          </h2>

          <ul className="m-0 mt-4 list-none space-y-4 p-0">
            {REASSURANCE.map(({ Icon, text }) => (
              <li key={text} className="flex gap-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-ink-muted" />
                <span className="font-sans text-[15.5px] leading-[1.55] text-ink-secondary">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <p className="m-0 mt-5 border-t border-hairline pt-4 font-sans text-[15px] leading-[1.6] text-ink-muted">
            To analyse your document, Samjo sends its text to an AI provider.{' '}
            <Link
              to="/privacy"
              className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
            >
              Read the full privacy note
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}

/* The waiting page: a sheet with the limits set on it as if printed there. */
function EmptyPage() {
  return (
    <div
      aria-hidden
      className="rounded-sm border border-dashed border-hairline-strong bg-surface px-5 py-10 text-center sm:px-8 sm:py-14"
    >
      <p className="m-0 font-sans text-[12px] font-medium uppercase leading-4 tracking-[0.13em] text-ink-muted">
        No document yet
      </p>
      <div className="mx-auto mt-6 max-w-[240px] space-y-2.5">
        <Line w="w-[92%]" />
        <Line w="w-[76%]" />
        <Line w="w-[84%]" />
        <Line w="w-[58%]" />
      </div>
    </div>
  );
}

function ChosenFile({
  name,
  size,
  onClear,
}: {
  name: string;
  size: string;
  onClear: () => void;
}) {
  return (
    <div className="rounded-sm border border-hairline bg-surface p-5 shadow-subtle sm:p-6">
      <p className="m-0 font-sans text-[12px] font-medium uppercase leading-4 tracking-[0.13em] text-ink-muted">
        Ready to read
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="m-0 truncate font-sans text-[17px] font-medium leading-6 text-ink">
            {name}
          </p>
          <p className="m-0 mt-1 font-ui text-[13px] leading-5 text-ink-muted">{size}</p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-sm border-0
                     bg-transparent px-2 font-sans text-[15px] leading-6 text-ink-muted
                     transition-colors duration-200 ease-out hover:text-danger"
        >
          <DeleteIcon size={17} className="shrink-0" />
          Remove
        </button>
      </div>

      <div aria-hidden className="mt-6 space-y-2.5 border-t border-hairline pt-5">
        <Line w="w-[94%]" />
        <Line w="w-[81%]" />
        <Line w="w-[88%]" />
        <Line w="w-[62%]" />
      </div>
    </div>
  );
}

function Line({ w }: { w: string }) {
  return <div className={`h-[6px] rounded-full bg-hairline-strong opacity-40 ${w}`} />;
}
