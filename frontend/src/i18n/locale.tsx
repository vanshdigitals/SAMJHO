import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/* Phase 1 is English and Hindi, and that is a contract, not a resourcing
   decision: API.md types the analyze and export bodies as
   { "language": "en" | "hi" }, and AI_SCHEMAS.md carries one `language` field.
   Offering a third option here would send a value the backend rejects.

   Phase 2 (PRD.md §10, ACCESSIBILITY.md §2) needs the API enum widened, UI
   catalogues, per-language grounding evals, and a TTS voice check — plus, for
   Urdu, full RTL support. Add entries here only once those exist. */

export type Locale = 'en' | 'hi';

export type LocaleOption = {
  code: Locale;
  /* Shown to the reader, in its own script. */
  nativeName: string;
  /* For screen readers and the html lang attribute. */
  englishName: string;
};

export const LOCALES: LocaleOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
];

const STORAGE_KEY = 'samjo.locale';

function isSupported(code: string): code is Locale {
  return LOCALES.some((l) => l.code === code);
}

/* navigator.languages is only a default, never an override. An explicit
   stored choice always wins — silently switching the interface out from
   under someone who already chose is worse than guessing wrong once. */
export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isSupported(stored)) return stored;
  } catch {
    /* private mode or blocked storage: fall through to detection */
  }

  const candidates = typeof navigator !== 'undefined'
    ? navigator.languages ?? [navigator.language]
    : [];

  for (const tag of candidates) {
    /* Match the primary subtag only: hi-IN and hi both mean Hindi. */
    const primary = tag?.toLowerCase().split('-')[0];
    if (primary && isSupported(primary)) return primary;
  }
  return 'en';
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  current: LocaleOption;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  /* Screen readers pick pronunciation from html lang; keeping it in sync is a
     correctness requirement, not a nicety (ACCESSIBILITY.md §1). */
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Persistence is best-effort; the session still works without it. */
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      current: LOCALES.find((l) => l.code === locale) ?? LOCALES[0],
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
