import { Link } from 'react-router-dom';
import { BriefingCard } from './BriefingCard';
import { SourceDocument } from './SourceDocument';
import { FileTextIcon, GlobeIcon, LockIcon, MessageIcon, SourceCheckIcon } from '../icons';

/* Copy is verbatim from SAMJO_LANDING_PAGE_CONTENT.md §02.

   Composition: left column left-aligned, right column a centred card pair.
   Below 1024 the two stack and the whole thing optically recentres — by
   switching each block's own alignment, not by a blanket text-align. */

const TRUST = [
  { Icon: SourceCheckIcon, label: 'Source-grounded' },
  { Icon: LockIcon, label: 'Private by design' },
  { Icon: GlobeIcon, label: 'Hindi + English' },
];

export function Hero() {
  /* overflow-x-clip on the section is a safety net for the tilted document's
     overhang; the offsets below are sized to stay inside the viewport anyway. */
  return (
    <section className="w-full overflow-x-clip bg-surface">
      <div
        className="mx-auto grid w-full max-w-shell grid-cols-1 items-center gap-12
                   px-5 pb-16 pt-12 sm:px-6 md:gap-14 md:pb-20 md:pt-16
                   lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-20 lg:pt-[64px]
                   xl:gap-12 xl:pt-[72px]"
      >
        {/* ── Left: the message ─────────────────────────────────────── */}
        <div className="hero-rise flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* One heading, not a logo plus a slogan: the product name opens the
              sentence, so the eye reads Samjo -> know where you stand. The
              accent is the brand token on the word itself — no pill, no
              highlight shape. */}
          <h1
            className="m-0 max-w-[15ch] font-sans text-[44px] font-medium leading-[1.05]
                       tracking-[-0.028em] text-ink
                       sm:text-[50px] md:text-[60px] lg:text-[64px] xl:text-[72px]
                       2xl:text-[76px]"
          >
            <span className="text-primary">Samjo.</span> Know where you stand.
          </h1>

          <p className="m-0 mt-5 font-sans text-[17px] leading-[1.45] text-ink-secondary sm:text-[18.5px] lg:text-[20px]">
            Legal documents should not be difficult to understand. What matters is knowing what they say, what affects you, and what needs your attention.
          </p>

          <p
            className="m-0 mt-4 max-w-[36ch] font-sans text-[16px] leading-[1.5]
                       text-ink-secondary sm:mt-5 sm:text-[17px] lg:max-w-[44ch] lg:text-[18px]"
          >
            Show us a rental agreement or a housing notice, or just tell us what happened.
            Samjo explains what it says, what matters in it, what may need checking,
            and what to do next.
          </p>

          <p className="m-0 mt-4 max-w-[54ch] font-sans text-[15.5px] leading-[1.6] text-ink-secondary sm:mt-5 sm:text-[16px] lg:max-w-[600px] lg:text-[17px]">
            You do not need to know legal language to understand where you stand. Samjo turns the important parts into a clear briefing you can check, understand, and take with you when you need professional help.
          </p>

          {/* Two entry paths — equal size, distinct emphasis */}
          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to="/upload"
              data-motion="transform"
              className="inline-flex h-[56px] items-center justify-center gap-2.5 rounded-sm
                         bg-primary px-7 font-sans text-[17px] font-medium text-on-primary
                         no-underline ring-1 ring-inset ring-transparent
                         transition-[background-color,box-shadow,transform] duration-[180ms] ease-out
                         hover:bg-primary-hover hover:ring-action-edge
                         active:bg-primary-active active:scale-[0.99]"
            >
              <FileTextIcon className="shrink-0" />
              I have a document
            </Link>

            <Link
              to="/situation"
              data-motion="transform"
              className="inline-flex h-[56px] items-center justify-center gap-2.5 rounded-sm
                         border border-hairline-strong bg-surface px-7 font-sans text-[17px]
                         font-medium text-ink no-underline
                         transition-[background-color,border-color,transform] duration-[180ms] ease-out
                         hover:border-ink-muted hover:bg-surface-subtle
                         active:scale-[0.99]"
            >
              <MessageIcon className="shrink-0 text-ink-secondary" />
              Something happened
            </Link>
          </div>

          {/* Trust row — no cards, no boxes */}
          <ul className="m-0 mt-9 flex list-none flex-wrap justify-center gap-x-8 gap-y-4 p-0 lg:justify-start">
            {TRUST.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="shrink-0 text-ink-muted" />
                <span className="font-sans text-[16px] leading-6 text-ink-secondary">{label}</span>
              </li>
            ))}
          </ul>

          <p className="m-0 mt-6 font-ui text-[15px] leading-6 text-ink-muted">
            No account. No sign-up. Nothing to remember.
          </p>
        </div>

        {/* ── Right: the answer ─────────────────────────────────────── */}
        {/* Centred in its own half, never flush to the container edge: the
            tilted document overhangs to the right and needs room to land in. */}
        <div className="flex w-full justify-center">
          {/* The right margin at lg+ reserves exactly the document's overhang,
              so the tilted card always lands inside its own column instead of
              being clipped at narrower desktop widths. */}
          <div
            className="relative mr-[14px] w-full max-w-[400px] sm:mr-[38px] sm:max-w-[460px]
                       lg:mr-[64px] lg:max-w-[470px] xl:mr-[76px] xl:max-w-[500px]"
          >
            {/* Source document: larger, tilted, behind, lower contrast.
                Overhang and tilt both shrink on small screens so the
                composition stays tidy and nothing leaves the viewport. */}
            <div
              data-motion="transform"
              className="absolute bottom-6 left-8 right-[-14px] top-[-18px] rotate-[1.5deg]
                         opacity-60 sm:left-12 sm:right-[-38px] sm:top-[-26px] sm:rotate-[2.5deg]
                         lg:left-12 lg:right-[-64px] lg:top-[-30px] lg:bottom-8 xl:right-[-76px]
                         lg:rotate-[2.5deg] lg:opacity-90"
            >
              <SourceDocument />
            </div>

            {/* Briefing: straight, in front, full contrast */}
            <div className="relative">
              <BriefingCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
