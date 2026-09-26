import * as Dialog from '@radix-ui/react-dialog';
import { CloseIcon, FileTextIcon } from '../icons';
import type { Evidence } from '../../lib/sampleBriefing';

/* "Where this comes from" — DESIGN_SYSTEM §5, AI_SCHEMAS.

   Three registers that never merge: the document's words, Samjo's reading,
   and what a professional decides. Rendered once and used in both places it
   appears — the desktop third pane and the bottom sheet below it — so the two
   cannot drift apart.

   The sheet is a Radix Dialog: it traps focus, closes on Escape and returns
   focus to the marker that opened it, which ACCESSIBILITY §1 requires. */

export function EvidenceBody({ evidence }: { evidence: Evidence }) {
  const hasSurrounding = Boolean(evidence.contextBefore || evidence.contextAfter);

  return (
    <div>
      <div className="border-l-2 border-primary pl-4">
        <div className="flex items-center justify-between">
          <p className="m-0 font-sans text-[13px] font-medium leading-5 text-ink-muted">
            Document says
          </p>
          {evidence.isLoadingContext && (
            <span className="font-ui text-[11.5px] text-ink-muted animate-pulse">
              Loading context…
            </span>
          )}
        </div>
        <blockquote
          lang="en"
          translate="no"
          className="m-0 mt-1.5 font-ui text-[15px] leading-[1.6] text-ink break-words"
        >
          {hasSurrounding ? (
            <>
              {evidence.contextBefore && (
                <span className="text-ink-muted opacity-80">{evidence.contextBefore}</span>
              )}
              <mark className="rounded bg-primary/10 px-1 py-0.5 font-medium text-ink">
                “{evidence.quote}”
              </mark>
              {evidence.contextAfter && (
                <span className="text-ink-muted opacity-80">{evidence.contextAfter}</span>
              )}
            </>
          ) : (
            `“${evidence.quote}”`
          )}
        </blockquote>
        <p className="m-0 mt-2 font-ui text-[12.5px] leading-4 text-ink-muted">
          Page {evidence.page}
          {evidence.clause ? ` · ${evidence.clause}` : ''}
        </p>
      </div>

      <div className="mt-5 border-l-2 border-hairline-strong pl-4">
        <p className="m-0 font-sans text-[13px] font-medium leading-5 text-ink-muted">
          Samjo interprets
        </p>
        <p className="m-0 mt-1.5 font-sans text-[16px] leading-[1.6] text-ink-secondary">
          {evidence.interprets}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <span className="font-sans text-[13.5px] leading-5 text-ink-muted">
            How confident is Samjo?
          </span>
          <span
            className={`rounded-sm px-2 py-0.5 font-sans text-[13.5px] font-medium leading-5 ${
              evidence.confidence === 'High'
                ? 'bg-success-surface text-success'
                : evidence.confidence === 'Medium'
                  ? 'bg-warning-surface text-warning'
                  : 'bg-danger-surface text-danger'
            }`}
          >
            {evidence.confidence}
          </span>
        </div>
      </div>

      {evidence.check && (
        <div className="mt-5 border-l-2 border-warning pl-4">
          <p className="m-0 font-sans text-[13px] font-medium leading-5 text-ink-muted">
            A professional should check
          </p>
          <p className="m-0 mt-1.5 font-sans text-[16px] leading-[1.6] text-ink-secondary">
            {evidence.check}
          </p>
        </div>
      )}
    </div>
  );
}

export function EvidenceHeading({ className = '' }: { className?: string }) {
  return (
    <p
      className={`m-0 flex items-center gap-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-muted ${className}`}
    >
      <FileTextIcon size={16} className="shrink-0" />
      Where this comes from
    </p>
  );
}

/* The marker: an 8px dot with a 44px target around it (ACCESSIBILITY §1). */
export function EvidenceMarker({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group -m-[18px] inline-flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center
                 justify-center rounded-sm border-0 bg-transparent align-middle"
    >
      <span className="sr-only">Where this comes from: {label}</span>
      <span
        aria-hidden
        className={`h-[8px] w-[8px] rounded-full transition-colors duration-200 ease-out ${
          active ? 'bg-primary ring-2 ring-primary-subtle' : 'bg-hairline-strong group-hover:bg-primary'
        }`}
      />
    </button>
  );
}

/* Bottom sheet, per ACCESSIBILITY §4 — the reader never loses their place. */
export function EvidenceSheet({
  evidence,
  label,
  open,
  onOpenChange,
}: {
  evidence: Evidence | null;
  label: string;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[color:var(--scrim)] animate-[fade-in_160ms_ease-out]" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-y-auto border-t border-hairline
                     bg-surface px-5 pb-8 pt-5 shadow-medium animate-[fade-in_180ms_ease-out]
                     sm:px-6"
        >
          <div className="mx-auto w-full max-w-[640px]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <EvidenceHeading />
                <Dialog.Title className="m-0 mt-2 font-sans text-[17px] font-medium leading-[1.4] text-ink">
                  {label}
                </Dialog.Title>
              </div>

              <Dialog.Close
                aria-label="Close"
                className="-mr-2 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center
                           rounded-sm border-0 bg-transparent text-ink-muted transition-colors
                           duration-200 ease-out hover:text-ink"
              >
                <CloseIcon size={20} />
              </Dialog.Close>
            </div>

            <div className="mt-5">{evidence && <EvidenceBody evidence={evidence} />}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
