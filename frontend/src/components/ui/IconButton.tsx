import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

/* `label` is required by the type, per design/SAMJO_DESIGN_TO_CODE_MAPPING.md §3.
   An icon-only control without an accessible name cannot be constructed.

   44px target at every size (ACCESSIBILITY.md §1). Hover is a quiet surface,
   not a filled circle; press nudges scale rather than moving the glyph. */
type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> & {
  label: string;
  children: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ label, children, className = '', ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      data-motion="transform"
      className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-secondary
                  transition-[background-color,color,transform] duration-150 ease-out
                  hover:bg-surface-subtle hover:text-ink
                  active:scale-[0.97] active:bg-surface-subtle ${className}`}
      {...rest}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = 'IconButton';
