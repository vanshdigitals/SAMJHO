import { Link } from 'react-router-dom';
import { ClockIcon, NoAccountIcon, NoLogIcon, ServiceIcon } from '../icons';

/* Section 09 — copy verbatim from SAMJO_LANDING_PAGE_CONTENT.md §09.

   Four facts, each literally true and none softened, including the one that
   is not flattering: the text goes to an AI provider. It is given the same
   weight as the other three rather than being demoted to a footnote —
   SECURITY §5 requires the disclosure, and burying it would be the theatre
   this section is supposed to avoid.

   No padlocks, no shields, no vaults. A plain statement list. */

const FACTS = [
  {
    Icon: NoAccountIcon,
    title: 'No account',
    body: 'No email, no phone number, no password. Nothing that identifies you.',
  },
  {
    Icon: ClockIcon,
    title: 'Deleted within 24 hours',
    body: 'Your document and its text are removed within a day, or the moment you ask — whichever comes first.',
  },
  {
    Icon: NoLogIcon,
    title: 'Never in our logs',
    body: 'The text of your document is never written into any log.',
  },
  {
    Icon: ServiceIcon,
    title: 'Read by an AI service',
    body: 'To analyse your document, Samjo sends its text to an AI provider. We’re telling you because you’d want to know.',
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="w-full bg-background">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14 xl:gap-20">
          {/* ── Left: the question, asked plainly ───────────────── */}
          <div className="rise-in">
            <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
              Privacy
            </p>

            <h2
              className="m-0 mt-3.5 max-w-[14ch] font-sans text-[36px] font-medium leading-[1.08]
                         tracking-[-0.026em] text-ink sm:text-[42px] md:text-[48px] lg:text-[52px]"
            >
              What happens to your document
            </h2>

            <p className="m-0 mt-5 max-w-[46ch] font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
              Four things, stated as they are. Nothing here is softened to sound better than it
              is.
            </p>

            <Link
              to="/privacy"
              className="mt-7 inline-flex items-center font-sans text-[16px] font-medium leading-6
                         text-primary no-underline transition-colors duration-200 ease-out
                         hover:text-primary-hover lg:text-[17px]"
            >
              Read the full privacy note
            </Link>
          </div>

          {/* ── Right: the four facts ───────────────────────────── */}
          <ul className="m-0 list-none p-0">
            {FACTS.map(({ Icon, title, body }, i) => (
              <li
                key={title}
                className={`flex gap-4 py-6 sm:gap-5 ${i > 0 ? 'border-t border-hairline' : 'pt-0 lg:pt-1'}`}
              >
                <Icon className="mt-0.5 shrink-0 text-ink-muted" />
                <div className="min-w-0">
                  <h3 className="m-0 font-sans text-[18px] font-medium leading-[1.35] tracking-[-0.01em] text-ink lg:text-[19px]">
                    {title}
                  </h3>
                  <p className="m-0 mt-2 max-w-measure font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
