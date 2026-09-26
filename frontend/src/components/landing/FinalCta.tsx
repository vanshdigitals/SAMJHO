import { Link } from 'react-router-dom';

/* Section 13 — copy verbatim from SAMJO_LANDING_PAGE_CONTENT.md §13.

   Scale does the work here, not decoration: one heading, one button, one
   reassurance. The secondary is a text link rather than a second button so
   the primary action is unambiguous at the end of the page. */

export function FinalCta() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto w-full max-w-shell px-5 py-24 sm:px-6 md:py-28 lg:px-8 lg:py-32">
        <div className="rise-in mx-auto flex max-w-[840px] flex-col items-center text-center">
          <h2
            className="m-0 font-sans text-[38px] font-medium leading-[1.06] tracking-[-0.028em]
                       text-ink sm:text-[46px] md:text-[54px] lg:text-[62px] xl:text-[68px]"
          >
            Start understanding where you stand
          </h2>

          <p className="m-0 mt-6 max-w-[560px] font-sans text-[18px] leading-[1.55] text-ink-secondary sm:text-[19px] lg:text-[21px]">
            One document, or one description of what happened. About a minute either way.
          </p>

          <div className="mt-10 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-8">
            <Link
              to="/start"
              data-motion="transform"
              className="inline-flex h-[56px] w-full items-center justify-center rounded-sm bg-primary
                         px-8 font-sans text-[17px] font-medium text-on-primary no-underline
                         ring-1 ring-inset ring-transparent
                         transition-[background-color,box-shadow,transform] duration-[180ms] ease-out
                         hover:bg-primary-hover hover:ring-action-edge
                         active:bg-primary-active active:scale-[0.99] sm:w-auto"
            >
              Start with Samjo
            </Link>

            <Link
              to="/#how-it-works"
              /* Padding cancelled by margin: a 44px target without moving it */
              className="-my-3 inline-flex items-center rounded-sm py-3 font-sans text-[17px]
                         font-medium leading-6 text-ink-secondary no-underline
                         transition-colors duration-200 ease-out hover:text-primary"
            >
              See how it works first
            </Link>
          </div>

          <p className="m-0 mt-8 font-ui text-[15px] leading-6 text-ink-muted">
            No account. Deleted within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
