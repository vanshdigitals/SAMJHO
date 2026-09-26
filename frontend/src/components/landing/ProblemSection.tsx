import type { ReactNode } from 'react';
import { AlertIcon, AttentionIcon, DocumentScanIcon, NextStepsIcon } from '../icons';

/* The problem, per PRD.md §1: the failure is orientation, not comprehension.

   Centred introduction, then the four questions beside the thing that raises
   them — a stack of sheets where only two lines are marked. The callouts are
   those same four questions put against the page rather than listed twice, so
   the right-hand side carries the argument on its own. */

const QUESTIONS = [
  { n: '01', text: 'What is this document, and is it serious?' },
  { n: '02', text: 'Which parts of it actually affect me?' },
  { n: '03', text: 'Is a clock running?' },
  { n: '04', text: 'What do I do next, and what should I ask a professional?' },
];

export function ProblemSection() {
  return (
    <section className="w-full overflow-x-clip bg-background">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* ── Centred introduction ──────────────────────────────── */}
        <div className="rise-in mx-auto flex max-w-[740px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
            The problem
          </p>

          <h2
            className="m-0 mt-3.5 font-sans text-[40px] font-medium leading-[1.08] tracking-[-0.026em]
                       text-ink sm:text-[44px] md:text-[52px] lg:text-[58px]"
          >
            The hard part isn’t the words
          </h2>

          <p className="m-0 mt-5 max-w-[640px] font-sans text-[17px] leading-[1.6] text-ink-secondary sm:text-[18px] lg:text-[19px]">
            Most people can read a legal notice. What they can’t do is answer four questions
            about it.
          </p>
        </div>

        {/* ── Questions beside the document ─────────────────────── */}
        <div className="mt-16 grid grid-cols-1 items-center gap-14 md:mt-20 lg:grid-cols-[5fr_7fr] lg:gap-12 xl:gap-16">
          <ol className="rise-in-delayed m-0 list-none p-0">
            {QUESTIONS.map((q, i) => (
              <li
                key={q.n}
                className={`flex gap-5 py-5 ${i > 0 ? 'border-t border-hairline' : 'pt-0'}`}
              >
                <span className="font-ui text-[14px] font-medium leading-7 tabular-nums text-primary">
                  {q.n}
                </span>
                <span className="font-sans text-[17px] leading-[1.5] text-ink lg:text-[18.5px]">
                  {q.text}
                </span>
              </li>
            ))}
          </ol>

          <DocumentStack />
        </div>

        {/* ── Closing ───────────────────────────────────────────── */}
        <p className="mx-auto mt-16 max-w-[620px] text-center font-sans text-[17px] leading-[1.6] text-ink-secondary md:mt-20 lg:text-[18px]">
          A summary answers none of these.{' '}
          <span className="text-ink">It gives you a shorter version of the same confusion.</span>
        </p>
      </div>
    </section>
  );
}

/* Three sheets in controlled overlap; only the front one is legible. The
   wrapper's padding reserves the room the callouts hang into, so nothing
   clips at any width. */
function DocumentStack() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] px-3 py-9 md:px-10 lg:max-w-[600px] lg:px-14 lg:py-12">
      {/* Back sheet — clockwise */}
      <div
        aria-hidden
        data-motion="transform"
        className="absolute inset-x-14 top-3 hidden h-[86%] rotate-[2deg] rounded-md border border-hairline bg-surface opacity-55 sm:block lg:inset-x-[72px]"
      />
      {/* Middle sheet — counter-clockwise */}
      <div
        aria-hidden
        data-motion="transform"
        className="absolute inset-x-11 top-6 h-[88%] rotate-[-3deg] rounded-md border border-hairline bg-surface opacity-80 sm:inset-x-16 lg:inset-x-[60px]"
      />

      {/* Front sheet */}
      <div
        data-motion="transform"
        className="relative rotate-[-1deg] rounded-md border border-hairline bg-surface p-5 shadow-subtle sm:p-6 lg:p-7"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="m-0 font-sans text-[12px] font-medium uppercase leading-4 tracking-[0.13em] text-ink">
            Notice to vacate
          </p>
          <p className="m-0 font-ui text-[11px] leading-4 text-ink-muted">Page 1 of 3</p>
        </div>
        <p className="m-0 mt-1.5 font-ui text-[11.5px] leading-4 text-ink-muted">
          Dated 14 March · Residential tenancy
        </p>

        <div className="mt-5 space-y-2">
          <Line w="w-[95%]" />
          <Line w="w-[82%]" />
        </div>

        <Clause n="3." title="Termination" />
        {/* The line the whole notice turns on */}
        <p className="m-0 mt-2 border-l-2 border-primary bg-primary-subtle py-1.5 pl-2.5 pr-2 font-ui text-[12px] leading-[1.5] text-ink">
          “…within thirty (30) days of receipt of this notice.”
        </p>

        <div className="mt-3 space-y-2">
          <Line w="w-[90%]" />
          <Line w="w-[68%]" />
        </div>

        <Clause n="4." title="Security deposit" />
        <p className="m-0 mt-2 border-l-2 border-warning bg-warning-surface py-1.5 pl-2.5 pr-2 font-ui text-[12px] leading-[1.5] text-ink">
          “…deductions for repairs at the Landlord’s discretion.”
        </p>

        <div className="mt-3 space-y-2">
          <Line w="w-[86%]" />
          <Line w="w-[74%]" />
        </div>

        <Clause n="5." title="Monthly rent" />
        <div className="mt-2 space-y-2">
          <Line w="w-[78%]" />
          <Line w="w-[58%]" />
        </div>
      </div>

      {/* The four questions, placed against the page. Colour carries an
          attention state, never decoration. The two side callouts drop away on
          the narrowest screens so a phone keeps the composition clean. */}
      <Callout
        className="-left-1 top-1 sm:-left-3 lg:-left-4 lg:top-6 xl:-left-12"
        tone="primary"
        icon={<DocumentScanIcon size={15} />}
        connector="right"
      >
        Is this serious?
      </Callout>

      <Callout
        className="-right-3 top-[30%] hidden sm:block lg:-right-4 xl:-right-12"
        tone="warning"
        icon={<AttentionIcon size={15} />}
        connector="left"
      >
        Which parts affect me?
      </Callout>

      <Callout
        className="bottom-[22%] -left-3 hidden md:block lg:-left-5 xl:-left-14"
        tone="danger"
        icon={<AlertIcon size={15} />}
        connector="right"
      >
        Is a clock running?
      </Callout>

      <Callout
        className="-right-1 bottom-1 sm:-right-3 lg:-right-3 lg:bottom-6 xl:-right-9"
        tone="success"
        icon={<NextStepsIcon size={15} />}
        connector="left"
      >
        What do I do next?
      </Callout>
    </div>
  );
}

const TONES = {
  primary: 'border-[color:var(--primary)] bg-primary-subtle text-primary',
  warning: 'border-[color:var(--warning)] bg-warning-surface text-warning',
  danger: 'border-[color:var(--danger)] bg-danger-surface text-danger',
  success: 'border-[color:var(--success)] bg-success-surface text-success',
} as const;

function Callout({
  children,
  className,
  tone,
  icon,
  connector,
}: {
  children: ReactNode;
  className: string;
  tone: keyof typeof TONES;
  icon: ReactNode;
  connector: 'left' | 'right';
}) {
  return (
    <div className={`absolute z-10 ${className}`}>
      <div
        className={`relative flex items-center gap-2 rounded-sm border px-2.5 py-1.5 shadow-subtle ${TONES[tone]}`}
      >
        <span className="flex shrink-0 items-center">{icon}</span>
        <span className="whitespace-nowrap font-sans text-[12.5px] font-medium leading-5">
          {children}
        </span>

        {/* A single hairline toward the page, not an arrow */}
        <span
          aria-hidden
          className={`absolute top-1/2 hidden h-px w-4 bg-hairline-strong lg:block ${
            connector === 'right' ? 'left-full' : 'right-full'
          }`}
        />
      </div>
    </div>
  );
}

function Clause({ n, title }: { n: string; title: string }) {
  return (
    <p className="m-0 mt-4 flex items-baseline gap-1.5 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-secondary">
      <span className="font-ui tabular-nums text-ink-muted">{n}</span>
      {title}
    </p>
  );
}

function Line({ w }: { w: string }) {
  return <div className={`h-[5.5px] rounded-full bg-hairline-strong opacity-45 ${w}`} />;
}
