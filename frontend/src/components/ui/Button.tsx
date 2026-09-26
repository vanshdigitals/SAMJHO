import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/* One button system for the product surfaces.

   Shape, colour and interaction are exactly the landing page's CTAs, lifted
   into a shared component so the new screens cannot drift: 8px radius
   (--radius-sm, the restrained step), a fill that deepens on hover with a 1px
   inset edge, and a 0.99 press. The label never moves.

   The landing sections keep their inline copies; this is not applied to them
   in this pass, because re-theming shipped sections is not what was asked. */

type Variant = 'primary' | 'secondary' | 'quiet';
type Size = 'lg' | 'md';

const BASE =
  'inline-flex select-none items-center justify-center gap-2.5 rounded-sm font-sans font-medium ' +
  'no-underline transition-[background-color,border-color,box-shadow,transform,color] ' +
  'duration-[180ms] ease-out active:scale-[0.99] disabled:pointer-events-none disabled:opacity-45';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary ring-1 ring-inset ring-transparent hover:bg-primary-hover ' +
    'hover:ring-action-edge active:bg-primary-active',
  secondary:
    'border border-hairline-strong bg-surface text-ink hover:border-ink-muted hover:bg-surface-subtle',
  quiet: 'text-ink-secondary hover:text-primary',
};

const SIZES: Record<Size, string> = {
  lg: 'h-[56px] px-7 text-[17px]',
  md: 'h-[48px] px-5 text-[16px]',
};

function classesFor(variant: Variant, size: Size, className?: string) {
  const shape = variant === 'quiet' ? `${SIZES[size]} px-0` : SIZES[size];
  return `${BASE} ${VARIANTS[variant]} ${shape} ${className ?? ''}`;
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export const Button = forwardRef<HTMLButtonElement, Common & ComponentPropsWithoutRef<'button'>>(
  function Button({ variant = 'primary', size = 'lg', className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        data-motion="transform"
        className={classesFor(variant, size, className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'lg',
  className,
  children,
  ...rest
}: Common & { to: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to' | 'className'>) {
  return (
    <Link to={to} data-motion="transform" className={classesFor(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
