import { QuestionIcon, TakeWithIcon, UnclearIcon, WatchOutIcon } from '../icons';

/* Section 11 — copy verbatim from SAMJO_LANDING_PAGE_CONTENT.md §11.

   The panel is the preparation screen itself, because the claim being made
   is that Samjo hands you something to walk in with. A question with its
   rationale attached is the unit of that screen — a bare list of questions
   would be the thing this section says Samjo is not. */

const CHECKLIST = [
  { n: '01', text: 'The questions worth asking, and why each one matters' },
  { n: '02', text: 'What’s still unclear in your document, named plainly' },
  { n: '03', text: 'What to take with you' },
  { n: '04', text: 'Where Samjo wasn’t sure, so you can have it checked' },
];

export function ProfessionalHelp() {
  return (
    <section id="professional-help" className="w-full bg-background">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* ── Intro ─────────────────────────────────────────────── */}
        <div className="rise-in mx-auto flex max-w-[760px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
            Before you get help
          </p>

          <h2
            className="m-0 mt-3.5 font-sans text-[36px] font-medium leading-[1.08] tracking-[-0.026em]
                       text-ink sm:text-[42px] md:text-[48px] lg:text-[54px]"
          >
            Walk in knowing what to ask
          </h2>

          <p className="m-0 mt-5 max-w-[640px] font-sans text-[17px] leading-[1.6] text-ink-secondary sm:text-[18px] lg:text-[19px]">
            Legal help costs money, and much of a first consultation goes on explaining the
            basics. Samjo does that part first.
          </p>
        </div>

        {/* ── Checklist beside the preparation screen ───────────── */}
        <div className="mt-14 grid grid-cols-1 items-start gap-12 md:mt-16 lg:mt-20 lg:grid-cols-[5fr_7fr] lg:gap-14 xl:gap-20">
          <ol className="m-0 list-none p-0">
            {CHECKLIST.map((item, i) => (
              <li
                key={item.n}
                className={`flex gap-5 py-5 ${i > 0 ? 'border-t border-hairline' : 'pt-0'}`}
              >
                <span className="font-ui text-[14px] font-medium leading-7 tabular-nums text-primary">
                  {item.n}
                </span>
                <span className="font-sans text-[17px] leading-[1.5] text-ink lg:text-[18.5px]">
                  {item.text}
                </span>
              </li>
            ))}
          </ol>

          <div className="rise-in-delayed rounded-md border border-hairline bg-surface shadow-subtle">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-hairline bg-surface-subtle px-5 py-3.5 sm:px-6">
              <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
                Samjo
              </span>
              <span aria-hidden className="h-3.5 w-px bg-hairline-strong" />
              <span className="font-sans text-[13px] leading-5 text-ink-secondary">
                Questions to ask
              </span>
              <span className="ml-auto font-ui text-[12.5px] leading-5 text-ink-muted">
                4 prepared
              </span>
            </div>

            <div className="px-5 py-6 sm:px-6 sm:py-7 lg:px-7">
              {/* The question, then the reason. Never one without the other. */}
              <p className="m-0 flex items-center gap-2 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.11em] text-ink-muted">
                <QuestionIcon size={15} className="shrink-0" />
                Question 1 of 4
              </p>

              <p className="m-0 mt-3 font-sans text-[18px] font-medium leading-[1.45] text-ink sm:text-[19px] lg:text-[21px]">
                “Does the deposit clause let you deduct repair costs without giving me an
                itemised list?”
              </p>

              <div className="mt-5 border-t border-hairline pt-5">
                <p className="m-0 font-sans text-[13px] font-medium leading-5 text-ink-muted">
                  Why this one matters
                </p>
                <p className="m-0 mt-2 max-w-measure font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
                  The agreement mentions deductions but doesn’t say whether an itemised list is
                  required. That gap is worth closing before you sign.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 border-t border-hairline pt-5 sm:grid-cols-2 sm:gap-8">
                <div>
                  <p className="m-0 flex items-center gap-2 font-sans text-[13px] font-medium leading-5 text-ink-muted">
                    <TakeWithIcon size={16} className="shrink-0" />
                    What to take
                  </p>
                  <ul className="m-0 mt-2.5 list-none space-y-1.5 p-0">
                    {['The rental agreement', 'The notice you received', 'Rent receipts'].map(
                      (item) => (
                        <li
                          key={item}
                          className="font-sans text-[15px] leading-[1.5] text-ink-secondary"
                        >
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div>
                  <p className="m-0 flex items-center gap-2 font-sans text-[13px] font-medium leading-5 text-ink-muted">
                    <UnclearIcon size={16} className="shrink-0" />
                    Still unclear
                  </p>
                  <p className="m-0 mt-2.5 font-sans text-[15px] leading-[1.5] text-ink-secondary">
                    When the notice period starts
                    <span className="ml-2 whitespace-nowrap font-medium text-warning">Verify</span>
                  </p>
                  <p className="m-0 mt-1.5 font-sans text-[15px] leading-[1.5] text-ink-secondary">
                    Whether the deposit terms apply after notice
                    <span className="ml-2 whitespace-nowrap font-medium text-warning">Verify</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Escalation ────────────────────────────────────────── */}
        <p className="mx-auto mt-14 flex max-w-[680px] items-start justify-center gap-3 text-left font-sans text-[16px] leading-[1.6] text-ink-secondary md:mt-16 lg:mt-20 lg:text-[17px]">
          <WatchOutIcon size={19} className="mt-1 shrink-0 text-warning" />
          <span>
            Where a document looks time-sensitive, or the situation is serious, Samjo puts
            getting help above reading further.
          </span>
        </p>
      </div>
    </section>
  );
}
