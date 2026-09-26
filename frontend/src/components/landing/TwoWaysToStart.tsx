import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckIcon,
  FileTextIcon,
  FocusIcon,
  IntakeIcon,
  QuestionIcon,
  SourceCheckIcon,
} from '../icons';

/* The two entry points, and the honest difference between them.

   UX_FLOWS.md §3: without a document there is nothing to ground against, so
   the situation path produces orientation and questions rather than quoted
   evidence. That asymmetry is stated in the panel, not hidden — it is a
   safety property, not a limitation to gloss over.

   Each panel is a single link. The button inside is a styled span, so there
   is one focus stop per panel instead of a link nested inside a link. */

export function TwoWaysToStart() {
  return (
    <section id="two-ways" className="w-full bg-background">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* ── Intro ─────────────────────────────────────────────── */}
        <div className="rise-in mx-auto flex max-w-[720px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
            Two ways to start
          </p>

          <h2
            className="m-0 mt-3.5 font-sans text-[38px] font-medium leading-[1.08] tracking-[-0.026em]
                       text-ink sm:text-[42px] md:text-[48px] lg:text-[54px]"
          >
            Start with what you have
          </h2>

          <p className="m-0 mt-5 max-w-[620px] font-sans text-[17px] leading-[1.6] text-ink-secondary sm:text-[18px] lg:text-[19px]">
            Bring us a document, or simply tell us what happened. Samjo starts from wherever
            you are.
          </p>
        </div>

        {/* ── The two paths ─────────────────────────────────────── */}
        <div className="mx-auto mt-14 grid max-w-[1280px] grid-cols-1 gap-6 md:mt-16 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          <Panel
            to="/upload"
            label="Start with a document"
            title="I have a document"
            lead="Rental agreement, housing notice, letter, or photo."
            visual={<DocumentPreview />}
            body={
              <>
                <Fact>PDF, Word, or a photo — up to 10 MB and 30 pages.</Fact>
                <Fact>Every point in your briefing traces back to a line in it.</Fact>
              </>
            }
            note={{ icon: <SourceCheckIcon size={15} />, text: 'Source-grounded' }}
            cta={{ icon: <FileTextIcon size={18} />, text: 'Start with a document' }}
            variant="primary"
          />

          <Panel
            to="/situation"
            label="Tell us what happened"
            title="Something happened"
            lead="Tell us what happened in your own words."
            visual={<IntakePreview />}
            body={
              <>
                <Fact>A few plain questions — no legal words required.</Fact>
                <Fact>
                  You get orientation and questions worth asking. With no document there
                  is nothing to quote, so no line-by-line briefing.
                </Fact>
              </>
            }
            note={{ icon: <FocusIcon size={15} />, text: 'Orientation first' }}
            cta={{ icon: <QuestionIcon size={18} />, text: 'Tell us what happened' }}
            variant="secondary"
          />
        </div>

        <p className="mx-auto mt-10 max-w-[520px] text-center font-sans text-[16px] leading-[1.6] text-ink-muted lg:mt-12">
          No document yet? That’s okay — you can add one later.
        </p>
      </div>
    </section>
  );
}

function Panel({
  to,
  label,
  title,
  lead,
  visual,
  body,
  note,
  cta,
  variant,
}: {
  to: string;
  label: string;
  title: string;
  lead: string;
  visual: ReactNode;
  body: ReactNode;
  note: { icon: ReactNode; text: string };
  cta: { icon: ReactNode; text: string };
  variant: 'primary' | 'secondary';
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      data-motion="transform"
      className="group flex flex-col rounded-lg border border-hairline bg-surface p-6 text-left
                 no-underline shadow-subtle transition-[border-color,box-shadow,transform]
                 duration-200 ease-out hover:border-hairline-strong hover:shadow-medium
                 active:scale-[0.998] sm:p-7 lg:p-8"
    >
      <h3 className="m-0 font-sans text-[22px] font-medium leading-[1.25] tracking-[-0.015em] text-ink lg:text-[25px]">
        {title}
      </h3>
      <p className="m-0 mt-2 font-sans text-[16px] leading-[1.5] text-ink-secondary lg:text-[17px]">
        {lead}
      </p>

      {/* The visual takes the slack so both panels' buttons align */}
      <div className="mt-5 flex-1">{visual}</div>

      <div className="mt-5 space-y-2.5">{body}</div>

      <span
        className={`mt-6 inline-flex h-[52px] items-center justify-center gap-2.5 rounded-sm
          px-6 font-sans text-[16px] font-medium transition-[background-color,box-shadow,border-color]
          duration-200 ease-out
          ${
            variant === 'primary'
              ? 'bg-primary text-on-primary ring-1 ring-inset ring-transparent group-hover:bg-primary-hover group-hover:ring-action-edge'
              : 'border border-hairline-strong bg-surface text-ink group-hover:border-ink-muted group-hover:bg-surface-subtle'
          }`}
      >
        {cta.icon}
        {cta.text}
      </span>

      <span className="mt-4 flex items-center gap-2 border-t border-hairline pt-3.5 font-ui text-[13px] leading-5 text-ink-muted">
        <span className="flex shrink-0 items-center">{note.icon}</span>
        {note.text}
      </span>
    </Link>
  );
}

function Fact({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 flex gap-2.5 font-sans text-[15px] leading-[1.55] text-ink-secondary lg:text-[16px]">
      <CheckIcon size={16} className="mt-1 shrink-0 text-ink-muted" />
      <span>{children}</span>
    </p>
  );
}

/* A page lifted slightly off the panel — document, source, evidence. */
function DocumentPreview() {
  return (
    <div
      aria-hidden
      className="rounded-md border border-hairline bg-background p-3 sm:p-4"
    >
      <div className="rounded-sm border border-hairline bg-surface p-4 shadow-subtle sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="m-0 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.12em] text-ink">
            Notice to vacate
          </p>
          <p className="m-0 font-ui text-[10.5px] leading-4 text-ink-muted">1 / 3</p>
        </div>
        <p className="m-0 mt-1 font-ui text-[10.5px] leading-4 text-ink-muted">
          Dated 14 March · PDF · 2 pages
        </p>

        <div className="mt-4 space-y-2">
          <Line w="w-[93%]" />
          <Line w="w-[79%]" />
        </div>

        <p className="m-0 mt-3.5 border-l-2 border-primary bg-primary-subtle py-1.5 pl-2.5 pr-2 font-ui text-[11.5px] leading-[1.45] text-ink">
          “…within thirty (30) days of receipt of this notice.”
        </p>

        <div className="mt-3 space-y-2">
          <Line w="w-[88%]" />
          <Line w="w-[66%]" />
        </div>
      </div>
    </div>
  );
}

/* A short structured intake — story, orientation, next questions.
   Deliberately a form being filled in, not a conversation. */
function IntakePreview() {
  return (
    <div aria-hidden className="rounded-md border border-hairline bg-background p-3 sm:p-4">
      <div className="rounded-sm border border-hairline bg-surface p-4 shadow-subtle sm:p-5">
        <p className="m-0 flex items-center gap-2 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-muted">
          <IntakeIcon size={14} className="shrink-0" />
          Question 1 of 4
        </p>

        <p className="m-0 mt-3 font-sans text-[14px] font-medium leading-5 text-ink">
          What happened?
        </p>
        {/* An answered field, not a speech bubble */}
        <p className="m-0 mt-2 rounded-sm border border-hairline bg-background px-3 py-2.5 font-sans text-[13.5px] leading-[1.5] text-ink-secondary">
          My landlord sent me a notice asking me to leave.
        </p>

        <div className="mt-4 space-y-2.5 border-t border-hairline pt-4">
          <Prompt done>When did it arrive?</Prompt>
          <Prompt>Do you have the document?</Prompt>
        </div>
      </div>
    </div>
  );
}

function Prompt({ children, done = false }: { children: ReactNode; done?: boolean }) {
  return (
    <p className="m-0 flex items-center gap-2.5 font-sans text-[13px] leading-5">
      <span
        className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border ${
          done ? 'border-primary bg-primary text-white' : 'border-hairline-strong'
        }`}
      >
        {done && <CheckIcon size={10} className="text-white" />}
      </span>
      <span className={done ? 'text-ink-secondary' : 'text-ink-muted'}>{children}</span>
    </p>
  );
}

function Line({ w }: { w: string }) {
  return <div className={`h-[5px] rounded-full bg-hairline-strong opacity-45 ${w}`} />;
}
