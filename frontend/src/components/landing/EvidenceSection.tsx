import type { ReactNode } from 'react';
import { FileTextIcon, WatchOutIcon } from '../icons';

/* Section 04 — copy verbatim from SAMJO_LANDING_PAGE_CONTENT.md §04.

   The three states are the argument, so they are laid out as three separate
   registers beside the page they came from: the quote in the document's own
   voice, Samjo's reading in Samjo's, and the thing a professional decides.
   They never share a card, a colour or a type style — DESIGN_SYSTEM §5. */

export function EvidenceSection() {
  return (
    <section id="evidence" className="w-full bg-surface">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* ── Intro ─────────────────────────────────────────────── */}
        <div className="rise-in mx-auto flex max-w-[780px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
            Evidence
          </p>

          <h2
            className="m-0 mt-3.5 font-sans text-[36px] font-medium leading-[1.08] tracking-[-0.026em]
                       text-ink sm:text-[42px] md:text-[48px] lg:text-[54px]"
          >
            Samjo shows you where every answer came from
          </h2>

          <p className="m-0 mt-5 max-w-[660px] font-sans text-[17px] leading-[1.6] text-ink-secondary sm:text-[18px] lg:text-[19px]">
            Samjo never merges three different things. What your document says, what Samjo
            reads into it, and what a professional should check stay separate on screen —
            because they are separate.
          </p>
        </div>

        {/* ── The page, and what is read off it ─────────────────── */}
        <div className="mx-auto mt-14 grid w-full max-w-[1240px] grid-cols-1 items-start gap-10 md:mt-16 lg:mt-20 lg:grid-cols-[6fr_7fr] lg:gap-12 xl:gap-16">
          <AgreementPage />
          <ThreeStates />
        </div>

        {/* ── The drop rule ─────────────────────────────────────── */}
        <div className="mx-auto mt-14 grid max-w-[1000px] grid-cols-1 gap-8 border-t border-hairline pt-10 md:mt-16 md:grid-cols-2 md:gap-12 lg:mt-20">
          <p className="m-0 font-sans text-[17px] leading-[1.6] text-ink lg:text-[18px]">
            If Samjo can’t point to the exact sentence in your document, it doesn’t make the
            claim at all.{' '}
            <span className="text-ink-secondary">Nothing unsourced reaches your briefing.</span>
          </p>

          <p className="m-0 flex gap-3 font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
            <WatchOutIcon size={19} className="mt-0.5 shrink-0 text-warning" />
            <span>
              Where Samjo is less sure, it says so and marks the item{' '}
              <span className="font-medium text-warning">Verify</span> rather than sounding
              equally confident about everything.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* The reader's own page, with the one sentence that is being quoted lit up.
   Everything else stays as set lines: the point is the location, not the
   rest of the text. */
function AgreementPage() {
  return (
    <div
      aria-hidden
      className="rise-in-delayed relative rounded-md border border-hairline bg-background p-4 sm:p-6 lg:p-7"
    >
      <div className="rounded-sm border border-hairline bg-surface p-5 shadow-subtle sm:p-6 lg:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <p className="m-0 font-sans text-[12px] font-medium uppercase leading-4 tracking-[0.13em] text-ink">
            Residential rental agreement
          </p>
          <p className="m-0 font-ui text-[11px] leading-4 text-ink-muted">Page 1</p>
        </div>

        <div className="mt-5 space-y-2">
          <Line w="w-[96%]" />
          <Line w="w-[88%]" />
          <Line w="w-[71%]" />
        </div>

        <p className="m-0 mt-5 flex items-baseline gap-1.5 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-secondary">
          <span className="font-ui tabular-nums text-ink-muted">4.</span>
          Security deposit
        </p>

        {/* The quoted sentence, in place, in the document's own register */}
        <p
          lang="en"
          translate="no"
          className="m-0 mt-2.5 border-l-2 border-primary bg-primary-subtle py-2 pl-3 pr-2.5 font-ui text-[13px] leading-[1.55] text-ink lg:text-[13.5px]"
        >
          “The Tenant shall deposit a sum of Rs. 25,000/- as interest-free security”
        </p>

        <div className="mt-4 space-y-2">
          <Line w="w-[92%]" />
          <Line w="w-[80%]" />
          <Line w="w-[62%]" />
        </div>

        <p className="m-0 mt-5 flex items-baseline gap-1.5 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-secondary">
          <span className="font-ui tabular-nums text-ink-muted">5.</span>
          Monthly rent
        </p>
        <div className="mt-2.5 space-y-2">
          <Line w="w-[84%]" />
          <Line w="w-[57%]" />
        </div>
      </div>
    </div>
  );
}

function ThreeStates() {
  return (
    <div className="rounded-md border border-hairline bg-surface p-5 shadow-subtle sm:p-6 lg:p-7">
      <p className="m-0 flex items-center gap-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-muted">
        <FileTextIcon size={16} className="shrink-0" />
        Where this comes from
      </p>

      <div className="mt-5 space-y-5">
        <State label="Document says" tone="quote">
          <blockquote
            lang="en"
            translate="no"
            className="m-0 font-ui text-[16px] leading-[1.55] text-ink lg:text-[17px]"
          >
            “The Tenant shall deposit a sum of Rs. 25,000/- as interest-free security”
          </blockquote>
          <p className="m-0 mt-2 font-ui text-[12.5px] leading-4 text-ink-muted">
            Page 1 · Clause 4
          </p>
        </State>

        <State label="Samjo interprets" tone="read">
          <p className="m-0 font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
            This is refundable, but the agreement sets conditions for deductions.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <span className="font-sans text-[13.5px] leading-5 text-ink-muted">
              How confident is Samjo?
            </span>
            <span className="rounded-sm bg-success-surface px-2 py-0.5 font-sans text-[13.5px] font-medium leading-5 text-success">
              High
            </span>
          </div>
        </State>

        <State label="A professional should check" tone="check">
          <p className="m-0 font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
            Whether those deduction conditions can be enforced against you. That is a
            judgement about your situation, not something the document states.
          </p>
        </State>
      </div>
    </div>
  );
}

/* Each state carries its own rail colour and its own type register, so the
   distinction survives even if the labels are skimmed. */
const RAILS = {
  quote: 'border-l-primary',
  read: 'border-l-hairline-strong',
  check: 'border-l-warning',
} as const;

function State({
  label,
  tone,
  children,
}: {
  label: string;
  tone: keyof typeof RAILS;
  children: ReactNode;
}) {
  return (
    <div className={`border-l-2 pl-4 sm:pl-5 ${RAILS[tone]}`}>
      <p className="m-0 font-sans text-[13px] font-medium leading-5 text-ink-muted">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Line({ w }: { w: string }) {
  return <div className={`h-[5.5px] rounded-full bg-hairline-strong opacity-45 ${w}`} />;
}
