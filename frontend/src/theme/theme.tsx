import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/* One global theme state, shared by the header control and the drawer control.

   Three modes are stored but only two are ever shown: 'system' is the default
   until the user picks a side, after which their choice wins permanently.
   The resolved value is written to <html data-theme>, which is what the token
   blocks in tokens.css switch on. */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'samjo.theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export function readStoredMode(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* blocked storage: fall back to system */
  }
  return 'system';
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function resolve(mode: ThemeMode): ResolvedTheme {
  return mode === 'system' ? systemTheme() : mode;
}

type ThemeContextValue = {
  mode: ThemeMode;
  theme: ResolvedTheme;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  const [theme, setTheme] = useState<ResolvedTheme>(() => resolve(readStoredMode()));

  /* Follow the OS only while the user has expressed no preference. */
  useEffect(() => {
    if (mode !== 'system') {
      setTheme(mode);
      return;
    }
    const mql = window.matchMedia(DARK_QUERY);
    const sync = () => setTheme(mql.matches ? 'dark' : 'light');
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [mode]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setMode = useCallback((next: ThemeMode) => {
    /* Scope the cross-fade to the swap itself rather than leaving a global
       transition on every element. */
    const root = document.documentElement;
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 220);

    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Persistence is best-effort. */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(resolve(mode) === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo(() => ({ mode, theme, setMode, toggle }), [mode, theme, setMode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
