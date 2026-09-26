import { CheckIcon, CrossIcon } from '../icons';

/* Section 10 — copy from SAMJO_LANDING_PAGE_CONTENT.md §10. The refusal is
   quoted verbatim from AI_SAFETY §3 and must not be paraphrased.

   Set as one editorial split rather than a red-and-green comparison table:
   the limits are a design position, not a warning label. The negative column
   uses a plain X at text size and the same type as the positive one. */

const CAN = [
  'Explain what your document says, in plain language',
  'Point out what actually matters in it',
  'Highlight anything time-sensitive, first',
  'Help you prepare the questions worth asking',
  'Get you ready for a professional',
];

const CANNOT = [
  'It won’t predict how a dispute will turn out.',
  'It won’t tell you whether to sign.',
  'It won’t decide whether a clause is enforceable.',
  'It isn’t a lawyer, and it doesn’t replace one.',
];

export function SafetySection() {
  return (
    <section id="safety" className="w-full bg-surface">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* ── Intro ─────────────────────────────────────────────── */}
        <div className="rise-in mx-auto flex max-w-[780px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
            Limits
          </p>

          <h2
            className="m-0 mt-3.5 font-sans text-[36px] font-medium leading-[1.08] tracking-[-0.026em]
                       text-ink sm:text-[42px] md:text-[48px] lg:text-[54px]"
          >
            What Samjo does, and what it doesn’t
          </h2>

          <p className="m-0 mt-5 max-w-[660px] font-sans text-[17px] leading-[1.6] text-ink-secondary sm:text-[18px] lg:text-[19px]">
            Samjo explains what your document says, points out what matters and what’s
            time-sensitive, and helps you prepare for a professional.
          </p>
        </div>

        {/* ── The split ─────────────────────────────────────────── */}
        <div className="mx-auto mt-14 grid max-w-[1120px] grid-cols-1 gap-10 md:mt-16 lg:mt-20 lg:grid-cols-2 lg:gap-0">
          <div className="lg:pr-14 xl:pr-20">
            <h3 className="m-0 font-sans text-[13px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted">
              Samjo can
            </h3>
            <ul className="m-0 mt-5 list-none space-y-4 p-0">
              {CAN.map((item) => (
                <li key={item} className="flex gap-3.5">
                  <CheckIcon size={18} className="mt-1 shrink-0 text-success" />
                  <span className="font-sans text-[17px] leading-[1.55] text-ink lg:text-[18px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-hairline pt-10 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0 xl:pl-20">
            <h3 className="m-0 font-sans text-[13px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted">
              Samjo does not
            </h3>
            <ul className="m-0 mt-5 list-none space-y-4 p-0">
              {CANNOT.map((item) => (
                <li key={item} className="flex gap-3.5">
                  <CrossIcon className="mt-1 shrink-0 text-ink-muted" />
                  <span className="font-sans text-[17px] leading-[1.55] text-ink-secondary lg:text-[18px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── The refusal, in Samjo's own words ─────────────────── */}
        <div className="mx-auto mt-14 max-w-[1120px] md:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 gap-8 rounded-md border border-hairline bg-background p-6 sm:p-8 lg:grid-cols-[7fr_5fr] lg:gap-12 lg:p-10">
            <div>
              <p className="m-0 font-sans text-[13px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted">
                Ask Samjo who’ll win, and this is what it says
              </p>
              <blockquote className="m-0 mt-4 border-l-2 border-primary pl-5 font-sans text-[19px] leading-[1.55] text-ink sm:text-[21px] lg:text-[23px] lg:leading-[1.5]">
                “I can help you understand the document, identify what it says, highlight issues
                to discuss with a legal professional, and prepare questions. I can’t predict the
                outcome of a legal dispute.”
              </blockquote>
            </div>

            <p className="m-0 self-end font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
              That’s not Samjo being cautious.{' '}
              <span className="text-ink">
                Applying law to your facts is what a qualified professional is for.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
