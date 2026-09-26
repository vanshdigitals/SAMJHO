import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FileTextIcon, ForwardIcon, IntakeIcon } from '../components/icons';

/* /start — "Choose starting point" (UX_FLOWS §1).

   A product screen, not a second landing page: the two doors, what each one
   takes and what it gives, and nothing else competing. Copy is the approved
   §07 panel text, including the asymmetry line, which is attached to panel B
   by aria-describedby because UX_FLOWS §3 requires it to be read with the
   choice rather than after it. */

export function StartPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 md:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
        <h1
          className="m-0 font-sans text-[34px] font-medium leading-[1.1] tracking-[-0.026em]
                     text-ink sm:text-[40px] lg:text-[46px]"
        >
          Where would you like to start?
        </h1>
        <p className="m-0 mt-5 font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
          Both are real starting points. Pick whichever matches what you’re holding.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:mt-14 lg:grid-cols-2 lg:gap-6">
        <Door
          to="/upload"
          icon={<FileTextIcon size={22} className="text-primary" />}
          title="I have a document"
          lead="Show us a rental agreement or a housing notice. Samjo explains what it says, what you’re agreeing to or being asked to do, and what’s time-sensitive."
          takes="PDF, Word, or a photo — up to 10 MB and 30 pages"
          gives="A briefing where every point traces to your document"
        />

        <Door
          to="/situation"
          icon={<IntakeIcon size={22} className="text-ink-muted" />}
          title="Something happened"
          lead="Tell us what happened in your own words. Samjo asks a few plain questions, then helps you work out where you stand and what to ask next."
          takes="A few questions, one at a time"
          gives="Orientation, what’s still unknown, and questions to ask"
          describedBy="situation-asymmetry"
        />
      </div>

      <p
        id="situation-asymmetry"
        className="mx-auto mt-8 max-w-[640px] text-center font-sans text-[15.5px] leading-[1.6] text-ink-muted"
      >
        Without a document there’s nothing to quote from, so that path gives you orientation and
        questions rather than a line-by-line briefing. You can add a document later.
      </p>
    </div>
  );
}

function Door({
  to,
  icon,
  title,
  lead,
  takes,
  gives,
  describedBy,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  lead: string;
  takes: string;
  gives: string;
  describedBy?: string;
}) {
  return (
    <Link
      to={to}
      aria-describedby={describedBy}
      data-motion="transform"
      className="group flex flex-col rounded-lg border border-hairline bg-surface p-6 no-underline
                 shadow-subtle transition-[border-color,box-shadow,transform] duration-200 ease-out
                 hover:border-hairline-strong hover:shadow-medium active:scale-[0.998] sm:p-7 lg:p-8"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-hairline bg-background">
        {icon}
      </span>

      <h2 className="m-0 mt-5 font-sans text-[22px] font-medium leading-[1.25] tracking-[-0.015em] text-ink lg:text-[25px]">
        {title}
      </h2>
      <p className="m-0 mt-2.5 font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
        {lead}
      </p>

      <dl className="m-0 mt-6 flex-1 space-y-2.5 border-t border-hairline pt-5">
        <Row label="Takes" value={takes} />
        <Row label="Gives" value={gives} />
      </dl>

      <span className="mt-6 inline-flex items-center gap-2 font-sans text-[16px] font-medium leading-6 text-primary">
        Continue
        <ForwardIcon size={17} className="shrink-0" />
      </span>
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="m-0 w-[52px] shrink-0 font-sans text-[14px] leading-6 text-ink-muted">
        {label}
      </dt>
      <dd className="m-0 font-sans text-[15px] leading-6 text-ink-secondary">{value}</dd>
    </div>
  );
}
