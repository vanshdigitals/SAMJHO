import { Link } from 'react-router-dom';

/* Editorial CTA: rectangular, 12px radius (--radius-md, the role DESIGN_SYSTEM
   §4 already assigns to buttons), never a pill.

   Colour: the brand blue stays. The palette is semantic-only (DESIGN_SYSTEM §2)
   so a second action hue would have no meaning to carry, and #1B4DB1 already
   measures 7.1:1 against white there. What changes is the foreground token —
   --on-primary is white on the light fill and dark ink on the lightened dark
   fill, which is what keeps contrast high in dark without resorting to a glow.

   Hover is ONE interaction: the fill deepens and a 1px inset edge fades in.
   The edge's own colour flips with the fill's luminance via --action-edge, so
   it reads as a lift in both themes. No shadow — DESIGN_SYSTEM §4 reserves
   elevation for things that genuinely float. Press deepens again and
   compresses to 0.99, the pressed value already written into
   design/SAMJO_DESIGN_SYSTEM.md. The label never moves.

   Uppercase needs positive tracking to stay legible; 0.06em is the point where
   it reads as deliberate rather than stretched. The literal string is uppercase
   in the DOM rather than via text-transform, so the accessible name matches the
   visible label exactly (WCAG 2.5.3). */

type Props = { size?: 'bar' | 'panel' };

export function StartCta({ size = 'bar' }: Props) {
  const panel = size === 'panel';

  return (
    <Link
      to="/start"
      data-motion="transform"
      className={`inline-flex select-none items-center justify-center rounded-[6px]
        bg-primary font-sans font-medium tracking-[0.06em] text-on-primary
        no-underline ring-1 ring-inset ring-transparent
        transition-[background-color,box-shadow,transform] duration-[180ms] ease-out
        hover:bg-primary-hover hover:ring-action-edge
        active:bg-primary-active active:scale-[0.99]
        ${
          panel
            ? 'h-[52px] w-full text-[14px]'
            : /* 38px visual height, 44px hit area via a transparent overlay. */
              `relative h-[38px] px-5 text-[14px] sm:text-[14.5px] after:absolute after:inset-x-0
               after:-top-[3px] after:-bottom-[3px] after:content-['']`
        }`}
    >
      GET STARTED
    </Link>
  );
}
