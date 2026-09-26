import type { ReactNode } from 'react';
import {
  CheckIcon,
  DocumentScanIcon,
  FileTextIcon,
  FocusIcon,
  IntakeIcon,
  TimerIcon,
} from '../icons';

/* Section 06 — copy verbatim from SAMJO_LANDING_PAGE_CONTENT.md §06.

   Four steps, each shown as the state the product is actually in at that
   moment rather than as an illustration of it. Step 02 carries the honest
   progress display the copy promises: named steps with real outcomes, not a
   bar that moves on a timer. */

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-surface">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* ── Intro ─────────────────────────────────────────────── */}
        <div className="rise-in mx-auto flex max-w-[760px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
            The sequence
          </p>

          <h2
            className="m-0 mt-3.5 font-sans text-[38px] font-medium leading-[1.08] tracking-[-0.026em]
                       text-ink sm:text-[44px] md:text-[50px] lg:text-[56px]"
          >
            How it works
          </h2>

          <p className="m-0 mt-5 max-w-[620px] font-sans text-[17px] leading-[1.6] text-ink-secondary sm:text-[18px] lg:text-[19px]">
            Four steps, in order. You can see what Samjo has worked out at every one of them.
          </p>
        </div>

        {/* ── The four steps ────────────────────────────────────── */}
        <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-10 p-0 md:mt-16 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-20 xl:grid-cols-4 xl:gap-6">
          <Step
            n="01"
            title="Show us the document, or tell us what happened"
            body="A rental agreement, a housing notice, a photo of a letter — or just describe what arrived."
          >
            <ChoosePanel />
          </Step>

          <Step
            n="02"
            title="Samjo reads it and works out what it is"
            body="Before anything else, Samjo identifies the document and tells you how sure it is."
          >
            <ReadingPanel />
          </Step>

          <Step
            n="03"
            title="Samjo finds what matters"
            body="What you must do, what money is involved, which dates are running, and what to watch for."
          >
            <FindingPanel />
          </Step>

          <Step
            n="04"
            title="You get a briefing you can check"
            body="Every point carries a marker back to the sentence it came from."
          >
            <BriefingPanel />
          </Step>
        </ol>

        {/* ── Timing ────────────────────────────────────────────── */}
        <p className="mx-auto mt-14 flex max-w-[620px] items-start justify-center gap-3 text-left font-sans text-[16px] leading-[1.6] text-ink-secondary md:mt-16 lg:mt-20 lg:text-[17px]">
          <TimerIcon className="mt-1 shrink-0 text-ink-muted" />
          <span>
            <span className="text-ink">Usually about a minute.</span> Samjo shows you what it’s
            doing while it works — real steps, not a loading bar that means nothing.
          </span>
        </p>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  body,
  children,
}: {
  n: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <li className="flex flex-col">
      {/* The rule carries the sequence across the row without drawing arrows */}
      <div className="flex items-center gap-3">
        <span className="font-ui text-[13px] font-medium leading-5 tabular-nums text-primary">
          {n}
        </span>
        <span aria-hidden className="h-px flex-1 bg-hairline" />
      </div>

      {/* flex-1 so all four panels take the tallest one's height and the step
          titles below them sit on the same line */}
      <div className="mt-4 flex min-h-[188px] flex-1 flex-col justify-center rounded-md border border-hairline bg-background p-4 sm:min-h-[200px] sm:p-5">
        {children}
      </div>

      <h3 className="m-0 mt-5 font-sans text-[19px] font-medium leading-[1.3] tracking-[-0.012em] text-ink lg:text-[20px] xl:text-[19px]">
        {title}
      </h3>
      <p className="m-0 mt-2 font-sans text-[16px] leading-[1.6] text-ink-secondary">{body}</p>
    </li>
  );
}

/* 01 — the two doors, as they are offered. */
function ChoosePanel() {
  return (
    <div aria-hidden className="space-y-2.5">
      <div className="flex items-center gap-3 rounded-sm border border-primary bg-primary-subtle px-3 py-3">
        <FileTextIcon size={18} className="shrink-0 text-primary" />
        <span className="font-sans text-[13.5px] font-medium leading-5 text-ink">
          I have a document
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-sm border border-hairline bg-surface px-3 py-3">
        <IntakeIcon size={18} className="shrink-0 text-ink-muted" />
        <span className="font-sans text-[13.5px] leading-5 text-ink-secondary">
          Something happened
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-sm border border-hairline bg-surface px-3 py-2.5">
        <span className="truncate font-ui text-[12px] leading-4 text-ink-secondary">
          notice-to-vacate.pdf
        </span>
        <span className="shrink-0 font-ui text-[11.5px] leading-4 text-ink-muted">1.2 MB</span>
      </div>
    </div>
  );
}

/* 02 — named steps with outcomes. Two are finished, one is running; the
   running one says what it is doing, which is the whole point of the copy. */
function ReadingPanel() {
  return (
    <div aria-hidden>
      <div className="space-y-2.5">
        <Progress state="done">Read the document</Progress>
        <Progress state="done">Worked out what it is</Progress>
        <Progress state="active">Finding what matters</Progress>
      </div>

      <div className="mt-4 rounded-sm border border-hairline bg-surface px-3 py-3">
        <p className="m-0 flex items-center gap-2 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-muted">
          <DocumentScanIcon size={14} className="shrink-0" />
          This looks like
        </p>
        <p className="m-0 mt-1.5 font-sans text-[14.5px] font-medium leading-5 text-ink">
          A notice to vacate
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-sans text-[12px] leading-4 text-ink-muted">
            How confident is Samjo?
          </span>
          <span className="rounded-sm bg-success-surface px-1.5 py-0.5 font-sans text-[12px] font-medium leading-4 text-success">
            High
          </span>
        </div>
      </div>
    </div>
  );
}

function Progress({ state, children }: { state: 'done' | 'active'; children: ReactNode }) {
  const done = state === 'done';
  return (
    <p className="m-0 flex items-center gap-2.5 font-sans text-[13px] leading-5">
      <span
        className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border ${
          done ? 'border-primary bg-primary' : 'border-primary'
        }`}
      >
        {done ? (
          <CheckIcon size={10} className="text-on-primary" />
        ) : (
          <span className="h-[6px] w-[6px] rounded-full bg-primary" />
        )}
      </span>
      <span className={done ? 'text-ink-secondary' : 'font-medium text-ink'}>{children}</span>
    </p>
  );
}

/* 03 — what the reading produced, grouped the way the briefing groups it. */
function FindingPanel() {
  return (
    <div aria-hidden className="space-y-2.5">
      <Found label="A date is running" value="30 days" tone="warning" />
      <Found label="Money involved" value="₹25,000" tone="plain" />
      <Found label="Something to do" value="Respond in writing" tone="plain" />
      <Found label="Worth watching" value="Deposit deductions" tone="warning" />
    </div>
  );
}

function Found({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'plain' | 'warning';
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2.5 last:border-0 last:pb-0">
      <span className="font-sans text-[12.5px] leading-5 text-ink-muted">{label}</span>
      <span
        className={`shrink-0 text-right font-sans text-[13px] font-medium leading-5 ${
          tone === 'warning' ? 'text-warning' : 'text-ink'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* 04 — the result, with one marker opened so the trace is visible. */
function BriefingPanel() {
  return (
    <div aria-hidden className="rounded-sm border border-hairline bg-surface p-3.5">
      <p className="m-0 flex items-center gap-2 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.1em] text-warning">
        <FocusIcon size={14} className="shrink-0" />
        Time-sensitive
      </p>
      <p className="m-0 mt-1.5 font-sans text-[14px] font-medium leading-[1.4] text-ink">
        You have <span className="font-ui tabular-nums">30 days</span> from 14 March to respond.
      </p>

      <div className="mt-3 flex items-start gap-2.5 border-t border-hairline pt-3">
        <span aria-hidden className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-primary" />
        <div className="min-w-0">
          <p className="m-0 font-sans text-[12.5px] leading-[1.5] text-ink-secondary">
            Respond in writing within 30 days
          </p>
          <p
            lang="en"
            translate="no"
            className="m-0 mt-1.5 border-l-2 border-primary bg-primary-subtle py-1 pl-2 pr-1.5 font-ui text-[11px] leading-[1.45] text-ink"
          >
            “…within thirty (30) days of receipt…” · Page 1
          </p>
        </div>
      </div>
    </div>
  );
}
