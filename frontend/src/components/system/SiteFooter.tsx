import { Link } from 'react-router-dom';
import { LOCALES, useLocale } from '../../i18n/locale';

/* Section 14 — structure and copy from SAMJO_LANDING_PAGE_CONTENT.md §14.

   Column headings render in sentence case. The disclaimer is verbatim from
   AI_SCHEMAS `AnalysisResponse.disclaimer` and the jurisdiction line states
   the assumption rather than asserting a fact (AI_SAFETY §6).

   The language control is the same global state as the header's, so the two
   can never disagree. */

const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'Two ways to start', to: '/#two-ways' },
    ],
  },
  {
    heading: 'Limits and safety',
    links: [{ label: 'What Samjo does and doesn’t', to: '/safety' }],
  },
  {
    heading: 'Privacy and access',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Accessibility', to: '/accessibility' },
    ],
  },
];

export function SiteFooter() {
  const { locale, setLocale } = useLocale();

  return (
    <footer className="w-full border-t border-hairline bg-surface-subtle">
      <div className="mx-auto w-full max-w-shell px-5 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:gap-14 xl:gap-20">
          {/* ── Brand ───────────────────────────────────────────── */}
          <div>
            <Link
              to="/"
              aria-label="Samjo — home"
              className="inline-block font-sans text-[26px] font-bold uppercase leading-none
                         tracking-[-0.035em] text-ink no-underline transition-colors duration-200
                         ease-out hover:text-primary"
            >
              SAMJHO
            </Link>
            <p className="m-0 mt-3 font-sans text-[16px] leading-6 text-ink-secondary">
              Samajh aane tak.
            </p>

            {/* ── Language ──────────────────────────────────────── */}
            <div className="mt-8">
              <p
                id="footer-language"
                className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted"
              >
                Language
              </p>
              <div
                role="group"
                aria-labelledby="footer-language"
                className="mt-3 flex flex-wrap gap-2"
              >
                {LOCALES.map((option) => {
                  const active = option.code === locale;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      lang={option.code}
                      aria-pressed={active}
                      onClick={() => setLocale(option.code)}
                      className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-sm border px-4
                                  font-sans text-[14.5px] leading-5 transition-colors duration-200
                                  ease-out ${
                                    active
                                      ? 'border-primary bg-primary-subtle font-medium text-primary'
                                      : 'border-hairline-strong bg-surface text-ink-secondary hover:border-ink-muted hover:text-ink'
                                  }`}
                    >
                      {option.nativeName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Navigation ──────────────────────────────────────── */}
          <nav aria-label="Footer" className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted">
                  {column.heading}
                </h2>
                <ul className="m-0 mt-3.5 list-none space-y-2.5 p-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="font-sans text-[16px] leading-6 text-ink-secondary no-underline
                                   transition-colors duration-200 ease-out hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* ── Legal footing ─────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-hairline pt-8 md:mt-14 lg:grid-cols-[7fr_5fr] lg:gap-12">
          <p className="m-0 max-w-measure font-sans text-[14.5px] leading-[1.6] text-ink-muted">
            Samjo gives legal information to help you understand your document and prepare. It is
            not legal advice and not a substitute for a lawyer.
          </p>

          <p className="m-0 font-sans text-[14.5px] leading-[1.6] text-ink-muted lg:text-right">
            Jurisdiction assumed · India
          </p>
        </div>
      </div>
    </footer>
  );
}
