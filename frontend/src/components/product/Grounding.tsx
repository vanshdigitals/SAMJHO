import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { ClockIcon, DeleteIcon, SourceCheckIcon, UnclearIcon, WatchOutIcon } from '../icons';

/* Two things the briefing was not yet saying out loud.

   1. How much of it is grounded. AI_SCHEMAS `SourceMetadata` already carries
      `dropped_item_count` and the OCR flags; until now they were computed and
      then not shown. A reader who is told "every point traces to a line in
      your document" deserves to see that this actually held, and to be told
      when a claim was thrown away for failing verification — dropping it
      silently is correct behaviour, but hiding that it happened is not.

   2. What happens to the document, and the control to end it now. The
      privacy note promises deletion "the moment you ask"; that promise needs
      a button. API.md #10 is the endpoint behind it. */

export function GroundingStrip({
  groundedCount,
  droppedCount,
  ocrUsed,
  ocrLowConfidence,
}: {
  groundedCount: number;
  droppedCount: number;
  ocrUsed: boolean;
  ocrLowConfidence: boolean;
}) {
  return (
    <div className="mt-5 rounded-sm border border-hairline bg-surface-subtle px-4 py-3.5 sm:px-5">
      <p className="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-[15px] leading-6 text-ink">
        <SourceCheckIcon size={18} className="shrink-0 text-success" />
        <span>
          <span className="font-ui tabular-nums">{groundedCount}</span> point
          {groundedCount === 1 ? '' : 's'} in this briefing trace back to a sentence in your
          document.
        </span>
      </p>

      {droppedCount > 0 && (
        <p className="m-0 mt-2 flex gap-2.5 font-sans text-[14.5px] leading-[1.55] text-ink-secondary">
          <UnclearIcon size={17} className="mt-0.5 shrink-0 text-ink-muted" />
          <span>
            <span className="font-ui tabular-nums">{droppedCount}</span> other point
            {droppedCount === 1 ? ' was' : 's were'} dropped, because Samjo couldn’t find the exact
            sentence behind {droppedCount === 1 ? 'it' : 'them'}.
          </span>
        </p>
      )}

      {ocrUsed && (
        <p className="m-0 mt-2 flex gap-2.5 font-sans text-[14.5px] leading-[1.55] text-ink-secondary">
          <WatchOutIcon size={17} className="mt-0.5 shrink-0 text-warning" />
          <span>
            {ocrLowConfidence
              ? 'Samjo read this from an image and wasn’t confident about the text. Check the quotes against your copy before relying on them.'
              : 'Samjo read this from an image rather than a text layer. Quotes match what it read.'}
          </span>
        </p>
      )}
    </div>
  );
}

/* What Samjo isn't sure about — AI_SCHEMAS `uncertainty[]`, AI_SAFETY §4.
   Deliberately outside the fixed 1–8 section order, which UX_FLOWS §4 says is
   not reorderable and not extendable. */
export function UncertaintyBlock({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10 rounded-md border border-hairline bg-surface p-5 sm:p-6">
      <h2 className="m-0 flex items-center gap-2.5 font-sans text-[18px] font-medium leading-[1.35] text-ink lg:text-[19px]">
        <UnclearIcon size={18} className="shrink-0 text-ink-muted" />
        What Samjo isn’t sure about
      </h2>
      <p className="m-0 mt-2 font-sans text-[15px] leading-[1.55] text-ink-muted">
        Named, rather than filled in with something plausible.
      </p>

      <ul className="m-0 mt-4 list-none space-y-3 p-0">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden
              className="mt-[11px] h-[6px] w-[6px] shrink-0 rounded-full border border-hairline-strong"
            />
            <span className="font-sans text-[16px] leading-[1.6] text-ink-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Retention, stated as a number of hours rather than a policy, plus the
   control that ends it now. The confirmation is a Radix Dialog so it traps
   focus, closes on Escape and returns focus to the trigger. */
export function RetentionNotice({
  hoursLeft,
  onDelete,
}: {
  hoursLeft: number;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="m-0 flex items-start gap-2.5 font-sans text-[15px] leading-[1.6] text-ink-muted">
        <ClockIcon size={17} className="mt-0.5 shrink-0" />
        <span>
          This document and everything read from it are deleted in{' '}
          <span className="font-ui tabular-nums text-ink-secondary">{hoursLeft} hours</span>.
        </span>
      </p>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="secondary" size="md" className="shrink-0">
            <DeleteIcon size={17} className="shrink-0 text-ink-secondary" />
            Delete it now
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-[color:var(--scrim)] animate-[fade-in_160ms_ease-out]" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-40px)] max-w-[460px] -translate-x-1/2
                       -translate-y-1/2 rounded-md border border-hairline bg-surface p-6 shadow-medium
                       animate-[fade-in_180ms_ease-out] sm:p-7"
          >
            <Dialog.Title className="m-0 font-sans text-[21px] font-medium leading-[1.3] tracking-[-0.015em] text-ink">
              Delete this document?
            </Dialog.Title>
            <Dialog.Description className="m-0 mt-3 font-sans text-[16px] leading-[1.6] text-ink-secondary">
              The file, the text read out of it and this briefing all go immediately. This can’t be
              undone, and there is no copy to restore.
            </Dialog.Description>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <Button variant="secondary" size="md">
                  Keep it
                </Button>
              </Dialog.Close>
              <Button
                size="md"
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
              >
                Delete it now
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

/* The state after deletion. It is a real state the backend produces — a read
   of a purged document is a 404 — so the page renders it rather than
   navigating away and pretending nothing was there. */
export function DeletedState() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-5 py-20 sm:px-6 md:py-24 lg:px-8">
      <h1 className="m-0 font-sans text-[30px] font-medium leading-[1.15] tracking-[-0.024em] text-ink sm:text-[36px]">
        Deleted
      </h1>
      <p className="m-0 mt-4 font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
        The document, the text read out of it and the briefing are gone. Nothing was kept, and
        there is nothing to restore.
      </p>
    </div>
  );
}
