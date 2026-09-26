import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronDownIcon, GlobeIcon } from '../icons';
import { LOCALES, useLocale, type Locale } from '../../i18n/locale';

/* Radix DropdownMenu supplies roving focus, typeahead, Escape, outside-click
   dismissal, focus restoration to the trigger and aria-expanded — the same
   reason design/SAMJO_DESIGN_TO_CODE_MAPPING.md §3 mandates Radix elsewhere.

   This control switches Samjo's OWN locale. It does not and cannot drive the
   browser's page-translation feature: no browser exposes that UI to page
   script. The two remain independent, and nothing here pretends otherwise. */

type Props = { variant?: 'bar' | 'panel' };

export function LanguageMenu({ variant = 'bar' }: Props) {
  const { locale, setLocale, current } = useLocale();
  const panel = variant === 'panel';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Change language"
          className={`group inline-flex items-center rounded-md text-ink-secondary
            transition-colors duration-150 ease-out
            hover:bg-surface-subtle hover:text-ink
            data-[state=open]:bg-surface-subtle data-[state=open]:text-ink
            ${panel
              ? 'h-12 w-full justify-between px-3 -mx-3'
              : 'h-11 gap-1.5 px-2.5'}`}
        >
          <span className="flex items-center gap-2">
            <GlobeIcon className="shrink-0" />
            <span
              lang={current.code}
              className={`${panel ? 'text-[17px] leading-7 text-ink' : 'text-[14px] leading-5'}`}
            >
              {current.nativeName}
            </span>
          </span>
          <ChevronDownIcon
            className="shrink-0 text-ink-muted transition-transform duration-150
                       group-data-[state=open]:rotate-180"
            data-motion="transform"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={panel ? 'start' : 'end'}
          sideOffset={8}
          collisionPadding={12}
          className="z-[60] min-w-[200px] rounded-md border border-hairline bg-surface p-1.5
                     shadow-medium will-change-[opacity,transform]
                     data-[state=open]:animate-[menu-in_160ms_ease-out]"
        >
          <DropdownMenu.Label
            className="px-2.5 pb-1.5 pt-1 text-[12px] font-medium leading-4 tracking-[0.02em] text-ink-muted"
          >
            Language
          </DropdownMenu.Label>

          <DropdownMenu.RadioGroup
            value={locale}
            onValueChange={(v) => setLocale(v as Locale)}
          >
            {LOCALES.map((l) => {
              const active = l.code === locale;
              return (
                <DropdownMenu.RadioItem
                  key={l.code}
                  value={l.code}
                  /* Native name for sighted readers, English name for screen
                     readers, so "हिन्दी" is not read as unknown glyphs. */
                  aria-label={l.englishName}
                  className={`flex min-h-[44px] cursor-pointer select-none items-center
                    justify-between gap-6 rounded-sm px-2.5 text-[15px] leading-6
                    outline-none transition-colors duration-150
                    data-[highlighted]:bg-surface-subtle
                    ${active ? 'font-medium text-ink' : 'font-normal text-ink-secondary'}`}
                >
                  <span lang={l.code}>{l.nativeName}</span>
                  <DropdownMenu.ItemIndicator>
                    <CheckIcon size={17} className="text-primary" />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              );
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
