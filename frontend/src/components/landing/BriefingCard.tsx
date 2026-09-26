import { AlertIcon, FileTextIcon } from '../icons';

/* A specimen of real Samjo output, in the fixed order of UX_FLOWS.md §4:
   urgency, what this is, what you need to do, then the evidence.

   Section labels are verbatim. "Samjo interprets" is never "AI interprets",
   and confidence is the word High, never a number (AI_SCHEMAS.md).

   The rail down the left is the product's identity element (DESIGN_SYSTEM §1):
   a hairline with filled markers tying each claim to its source.

   Section titles are paragraphs, not headings: this card is a specimen inside
   the hero, so promoting them to h3 would skip a level under the page h1 and
   put marketing sample text into the document outline. */

export function BriefingCard() {
  return (
    <div
      className="w-full overflow-hidden rounded-lg border border-hairline bg-surface
                 shadow-medium"
    >
      <div className="p-5 sm:p-6 lg:p-7">
        {/* Urgency — icon + word + colour, three channels */}
        <div className="flex gap-3 rounded-md bg-warning-surface px-4 py-3.5">
          <AlertIcon className="mt-0.5 shrink-0 text-warning" />
          <div>
            <p className="m-0 font-sans text-[13px] font-medium uppercase leading-4 tracking-[0.08em] text-warning">
              Time-sensitive
            </p>
            <p className="m-0 mt-1.5 font-sans text-[17px] font-medium leading-[1.4] text-ink">
              You have <span className="font-ui tabular-nums">30 days</span> from 14 March
              to respond.
            </p>
          </div>
        </div>

        {/* Evidence rail */}
        <div className="relative mt-5 pl-5">
          <span
            aria-hidden
            className="absolute bottom-1 left-[3px] top-2 w-px bg-hairline-strong"
          />

          <Item>
            <p className="m-0 font-sans text-[16px] font-medium leading-6 text-ink">
              What this is
            </p>
            <p className="m-0 mt-1.5 font-sans text-[16px] leading-[1.55] text-ink-secondary">
              A notice to vacate, sent by your landlord.
            </p>
          </Item>

          <Item className="mt-5">
            <p className="m-0 font-sans text-[16px] font-medium leading-6 text-ink">
              What you need to do
            </p>
            <ul className="m-0 mt-2 list-none space-y-2 p-0">
              <li className="flex items-start gap-2.5">
                <Dot />
                <span className="font-sans text-[16px] leading-[1.55] text-ink-secondary">
                  Respond in writing within 30 days
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Dot />
                <span className="font-sans text-[16px] leading-[1.55] text-ink-secondary">
                  Pay the outstanding rent of{' '}
                  <span className="font-ui tabular-nums text-ink">₹25,000</span>
                </span>
              </li>
            </ul>
          </Item>

          {/* Evidence panel — three states, never merged */}
          <Item className="mt-5">
            <div className="rounded-md border border-hairline bg-background p-4">
              <p className="m-0 flex items-center gap-2 font-sans text-[13px] font-medium uppercase leading-4 tracking-[0.06em] text-ink-muted">
                <FileTextIcon size={15} className="shrink-0" />
                Where this comes from
              </p>

              <p className="m-0 mt-3.5 font-sans text-[13.5px] font-medium leading-5 text-ink-muted">
                Document says
              </p>
              {/* Inter for quoted document text (DESIGN_SYSTEM §3).
                  translate="no" keeps browser page-translation from rewriting
                  verified evidence. */}
              <blockquote
                lang="en"
                translate="no"
                className="m-0 mt-1 font-ui text-[15px] leading-[1.5] text-ink"
              >
                “The Tenant shall vacate the premises within thirty (30) days of receipt
                of this notice.”
              </blockquote>
              <p className="m-0 mt-1.5 font-ui text-[12.5px] leading-4 text-ink-muted">Page 1</p>

              <div className="my-3 h-px bg-hairline" />

              <p className="m-0 font-sans text-[13.5px] font-medium leading-5 text-ink-muted">
                Samjo interprets
              </p>
              <p className="m-0 mt-1 font-sans text-[15px] leading-[1.5] text-ink-secondary">
                The notice period starts from the date you received it, not the date on
                the letter.
              </p>

              <div className="my-3 h-px bg-hairline" />

              <div className="flex items-center justify-between gap-3">
                <span className="font-sans text-[14px] leading-5 text-ink-muted">
                  How confident is Samjo?
                </span>
                <span className="rounded-sm bg-success-surface px-2.5 py-1 font-sans text-[14px] font-medium leading-5 text-success">
                  High
                </span>
              </div>
            </div>
          </Item>
        </div>
      </div>
    </div>
  );
}

function Item({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden
        className="absolute -left-5 top-[9px] h-[7px] w-[7px] rounded-full bg-primary"
      />
      {children}
    </div>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-hairline-strong"
    />
  );
}
