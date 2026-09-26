import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   TEMPORARY PLACEHOLDER — not the final identity.
   Swap the contents of this component only. The header layout
   reserves this footprint, so replacing it changes nothing else.
   ───────────────────────────────────────────────────────────── */

type Props = { size?: 'bar' | 'panel' };

export function BrandLockup({ size = 'bar' }: Props) {
  const wordmark =
    size === 'panel'
      ? 'text-[22px]'
      : 'text-[20px] sm:text-[21px] md:text-[23px] lg:text-[29px]';

  return (
    <Link
      to="/"
      data-placeholder="brand"
      aria-label="Samjo — home"
      /* Vertical padding cancelled by negative margin: gives the link a ≥44px
         hit area (ACCESSIBILITY.md §1) without altering the wordmark's
         appearance or the footprint the header reserves for it. */
      className="group -my-3 inline-flex items-center justify-center rounded-sm py-3 no-underline"
    >
      <span
        className={`inline-block font-sans font-bold uppercase leading-none tracking-[-0.035em] text-ink ${wordmark}`}
      >
        SAMJHO
      </span>
    </Link>
  );
}
