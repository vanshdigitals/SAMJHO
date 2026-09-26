import { MoonIcon, SunIcon } from '../icons';
import { IconButton } from '../ui/IconButton';
import { useTheme } from '../../theme/theme';

/* Compact utility control, sized and spaced to match the language trigger so
   the two read as one group rather than two buttons.

   The icon shows the theme you would switch TO, which is what makes a single
   glyph legible without a text label: in light mode you see a moon, and the
   accessible name says "Switch to dark mode". State is never carried by the
   icon alone — aria-pressed and the label both spell it out. */

type Props = { variant?: 'bar' | 'panel' };

export function ThemeToggle({ variant = 'bar' }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (variant === 'panel') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isDark}
        aria-label={label}
        className="-mx-3 flex min-h-[48px] w-full items-center justify-between rounded-md px-3
                   text-[17px] leading-7 text-ink transition-colors duration-150
                   hover:bg-surface-subtle active:bg-surface-subtle"
      >
        <span className="flex items-center gap-2 text-ink-secondary">
          {isDark ? <MoonIcon /> : <SunIcon />}
          <span className="text-ink">{isDark ? 'Dark' : 'Light'}</span>
        </span>
      </button>
    );
  }

  return (
    <IconButton label={label} aria-pressed={isDark} onClick={toggle}>
      {isDark ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
}
