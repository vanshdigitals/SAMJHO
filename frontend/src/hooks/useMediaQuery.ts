import { useCallback, useSyncExternalStore } from 'react';

/* ONE source of truth for the navigation breakpoint.

   1024 is tailwind.config.ts -> theme.extend.screens.lg, which is what already
   drives `hidden lg:block` on DesktopNavigation and `lg:hidden` on the
   hamburger. The value is mirrored here rather than re-invented: if it moves in
   the Tailwind config, it moves here too, and nowhere else. */
export const NAV_DESKTOP_MIN_PX = 1024;
export const NAV_DESKTOP_QUERY = `(min-width: ${NAV_DESKTOP_MIN_PX}px)`;

/* useSyncExternalStore rather than useState + useEffect: the value is read
   during render from the live MediaQueryList, so there is never a frame where
   React state disagrees with the CSS that is already applied. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  /* Server snapshot: assume not-desktop so nothing renders desktop-only markup
     before hydration. */
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
