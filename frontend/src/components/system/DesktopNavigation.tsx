import { Link, useLocation } from 'react-router-dom';
import { BAR_ITEMS, isNavItemCurrent } from './navItems';

/* Current page is signalled by text colour alone — no rule, no border, no
   pseudo-element, no persistent surface. Weight and spacing are identical in
   both states, so nothing reflows when the route changes.

   `aria-current="page"` carries the state for assistive tech, which is what
   keeps the colour-only treatment from being the sole channel. See the note in
   the report about ACCESSIBILITY.md §1.

   Hover is a quiet surface behind stable text; it is transient and never
   applies to the active item's colour. */

export function DesktopNavigation() {
  const { pathname, hash } = useLocation();

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex list-none items-center gap-1 p-0">
        {BAR_ITEMS.map((item) => {
          const isCurrent = isNavItemCurrent(item, pathname, hash);

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={isCurrent ? 'page' : undefined}
                className={`flex h-11 items-center rounded-md px-3 text-[16px]
                  leading-[26px] tracking-[-0.005em] no-underline
                  transition-colors duration-150 ease-out hover:bg-surface-subtle
                  ${isCurrent ? 'text-primary' : 'text-ink-secondary hover:text-ink'}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
