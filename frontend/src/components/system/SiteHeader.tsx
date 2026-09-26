import { useEffect, useState } from 'react';
import { BrandLockup } from './BrandLockup';
import { DesktopNavigation } from './DesktopNavigation';
import { LanguageMenu } from './LanguageMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { StartCta } from './StartCta';
import { ThemeToggle } from './ThemeToggle';
import { NAV_DESKTOP_QUERY, useMediaQuery } from '../../hooks/useMediaQuery';

/* Marketing header for the public routes (/, /safety, /privacy, /accessibility).
   The task/briefing chrome in design/SAMJO_DESKTOP_UI_SPEC.md §1
   (Listen, text size, overflow) is a separate AppHeader — see report.

   Sticky, constant height, solid, permanent hairline. Nothing shrinks, fades,
   blurs or hides on scroll: DESIGN_SYSTEM.md §7 permits one orchestrated
   moment on the page (the hero reveal) and forbids scroll-triggered motion.
   A constant height also means zero layout shift. */

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  /* The hamburger is hidden at lg by CSS, but the drawer renders through a
     portal on document.body and carries no responsive class — so without this
     it stayed mounted, and visible, over the desktop header.

     Two layers, deliberately:
       1. The render guard below means the drawer cannot be open at desktop for
          even one frame, whatever the state says.
       2. The effect clears the state itself, so resizing back down to mobile
          does not silently re-open a drawer the user never asked for. */
  const isDesktopNav = useMediaQuery(NAV_DESKTOP_QUERY);

  useEffect(() => {
    if (isDesktopNav && menuOpen) setMenuOpen(false);
  }, [isDesktopNav, menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-surface">
      <div
        className="mx-auto flex h-header-sm w-full max-w-shell items-center justify-between
                   pl-4 pr-3 sm:pl-5 sm:pr-4 md:h-header md:px-6 lg:h-header-lg lg:px-8 xl:px-10"
      >
        {/* Brand — reserved footprint, anchors the left */}
        <div className="shrink-0">
          <BrandLockup />
        </div>

        {/* Right group: navigation + language + CTA shrink-wrapped on desktop; actions + drawer on mobile/tablet */}
        <div className="flex shrink-0 items-center gap-7 lg:gap-8">
          {/* Desktop nav — visible at lg+ only */}
          <div className="hidden lg:block">
            <DesktopNavigation />
          </div>

          {/* Action group: Language + CTA (+ Hamburger on mobile/tablet) */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            {/* Language and theme enter the bar at 768 as one utility group;
                below that both live in the panel, so neither is ever duplicated. */}
            <div className="hidden items-center gap-0.5 md:flex">
              <LanguageMenu />
              <ThemeToggle />
            </div>

            {/* CTA visible on tablet & desktop; completely removed on mobile (<768) */}
            <div className="hidden md:block">
              <StartCta />
            </div>

            {/* Hamburger below 1024 only */}
            <NavigationDrawer open={menuOpen && !isDesktopNav} onOpenChange={setMenuOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
