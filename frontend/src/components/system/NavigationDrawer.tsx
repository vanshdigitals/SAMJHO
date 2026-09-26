import * as Dialog from '@radix-ui/react-dialog';
import { Link, useLocation } from 'react-router-dom';
import { CloseIcon, MenuIcon } from '../icons';
import { IconButton } from '../ui/IconButton';
import { BrandLockup } from './BrandLockup';
import { LanguageMenu } from './LanguageMenu';
import { ThemeToggle } from './ThemeToggle';
import { StartCta } from './StartCta';
import { NAV_ITEMS, isNavItemCurrent } from './navItems';

/* Radix Dialog supplies the focus trap, Escape handling, focus restoration to
   the trigger, body scroll lock and background inertness — exactly the
   behaviours design/SAMJO_DESIGN_TO_CODE_MAPPING.md §3 says not to hand-roll.

   Opens from the right, matching the trigger's position. A panel arriving from
   the opposite side to the button that summoned it breaks the spatial link.

   Visual language: no per-row rules. Dividers between every link are what make
   a drawer read as a generic list component; here the rows are separated by
   space and reveal a surface on touch, and a single hairline marks each real
   section boundary (navigation / language / action). No corner radius at all —
   the panel meets the viewport edges flush, as a navigation surface attached to
   the window rather than a floating card.

   Note: the bottom-sheet-over-drawer rule in the mapping §8 governs the
   EVIDENCE surface, where a side panel would cover the item the user tapped.
   Navigation has no tapped item to cover, so a right panel is correct here. */

export function NavigationDrawer({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { pathname, hash } = useLocation();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <IconButton
          label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          className="lg:hidden"
        >
          <MenuIcon size={22} />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Scrim derived from --text-primary, not generic black */}
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-[color:var(--scrim)]
                     data-[state=open]:animate-[fade-in_180ms_ease-out]"
        />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed right-0 top-0 z-50 flex h-[100dvh] w-[88vw]
                     max-w-[var(--nav-panel-width-max)] flex-col
                     border-l border-hairline bg-surface shadow-medium
                     data-[state=open]:animate-[slide-in_220ms_cubic-bezier(0.32,0.72,0,1)]"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>

          {/* Brand + close */}
          <div className="flex items-start justify-between gap-4 px-6 pb-6 pt-5">
            <div className="pt-1">
              <BrandLockup size="panel" />
            </div>
            <Dialog.Close asChild>
              <IconButton label="Close navigation" className="-mr-2.5">
                <CloseIcon size={20} />
              </IconButton>
            </Dialog.Close>
          </div>

          <div className="mx-6 h-px bg-hairline" />

          {/* Scrollable region so the action area below never gets pushed off */}
          <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-6 pt-4">
            <nav aria-label="Main">
              <ul className="m-0 list-none p-0">
                {NAV_ITEMS.map((item) => {
                  const isCurrent = isNavItemCurrent(item, pathname, hash);
                  return (
                    <li key={item.to}>
                      <Dialog.Close asChild>
                        <Link
                          to={item.to}
                          aria-current={isCurrent ? 'page' : undefined}
                          /* Same rule as the bar: colour only, no rule, no
                             persistent surface, no weight change. */
                          className={`-mx-3 flex min-h-[52px] items-center rounded-md px-3
                            text-[18px] leading-7 tracking-[-0.01em]
                            no-underline transition-colors duration-150 ease-out
                            hover:bg-surface-subtle active:bg-surface-subtle
                            ${isCurrent ? 'text-primary' : 'text-ink'}`}
                        >
                          {item.label}
                        </Link>
                      </Dialog.Close>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Language lives here below 768 — design/SAMJO_RESPONSIVE_BEHAVIOR.md §3 */}
            {/* Utility group. Language and theme live here below 768 and in the
                bar above it, so exactly one copy of each is ever visible.
                Section labels are quiet rather than form-like. */}
            <div className="mt-auto border-t border-hairline pb-3 pt-4 md:hidden">
              <p className="m-0 mb-0.5 text-[12px] font-medium leading-4 tracking-[0.02em] text-ink-muted">
                Language
              </p>
              <LanguageMenu variant="panel" />

              <p className="m-0 mb-0.5 mt-3 text-[12px] font-medium leading-4 tracking-[0.02em] text-ink-muted">
                Appearance
              </p>
              <ThemeToggle variant="panel" />
            </div>

          </div>

          {/* Action area — separated by a hairline, not boxed into a card */}
          <div className="border-t border-hairline px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-5">
            <Dialog.Close asChild>
              <StartCta size="panel" />
            </Dialog.Close>
            <p className="m-0 mt-3 text-center font-ui text-[13px] leading-5 text-ink-muted">
              No account. Deleted within 24 hours.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
