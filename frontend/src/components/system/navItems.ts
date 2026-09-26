/* Single source of truth for header navigation.
   Labels and destinations from UX_FLOWS.md §1 static routes and the
   landing information architecture. */

export type NavItem = { label: string; to: string; inBar: boolean };

export const NAV_ITEMS: NavItem[] = [
  { label: 'How it works', to: '/#how-it-works', inBar: true },
  { label: 'What Samjo does', to: '/safety', inBar: true },
  { label: 'Privacy', to: '/privacy', inBar: true },
  /* Policy statement rather than a task, so it lives in the panel and the
     footer, never the desktop bar. */
  { label: 'Accessibility', to: '/accessibility', inBar: false },
];

export const BAR_ITEMS = NAV_ITEMS.filter((i) => i.inBar);

/* Shared so the bar and the panel resolve "current" identically. Anchor items
   match only when both the route and the hash line up. */
export function isNavItemCurrent(item: NavItem, pathname: string, hash: string): boolean {
  if (item.to.includes('#')) {
    const [path, frag] = item.to.split('#');
    return pathname === (path || '/') && hash === `#${frag}`;
  }
  return pathname === item.to;
}
