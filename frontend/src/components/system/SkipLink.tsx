/* First focusable element on every page — ACCESSIBILITY.md §1. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50
                 focus:rounded-sm focus:bg-surface focus:px-4 focus:py-2 focus:text-[14px]
                 focus:font-medium focus:text-ink focus:shadow-medium"
    >
      Skip to main content
    </a>
  );
}
