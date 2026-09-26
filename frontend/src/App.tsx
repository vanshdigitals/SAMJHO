import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { SiteFooter } from './components/system/SiteFooter';
import { SiteHeader } from './components/system/SiteHeader';
import { SkipLink } from './components/system/SkipLink';
import { LandingPage } from './pages/LandingPage';

/* The landing page is what a first visit loads, so it stays in the entry
   chunk. Everything past it is a route the reader navigates to, and shipping
   all of it up front made the browser parse the whole product — briefing,
   upload, situation intake, every policy page — before it could paint the
   first screen. Each route is its own chunk now, fetched when it is asked for.

   Named exports, so each import() is unwrapped to the default shape React.lazy
   expects. */
const StartPage = lazy(() => import('./pages/StartPage').then((m) => ({ default: m.StartPage })));
const UploadPage = lazy(() => import('./pages/UploadPage').then((m) => ({ default: m.UploadPage })));
const SituationPage = lazy(() =>
  import('./pages/SituationPage').then((m) => ({ default: m.SituationPage })),
);
const ProcessingPage = lazy(() =>
  import('./pages/ProcessingPage').then((m) => ({ default: m.ProcessingPage })),
);
const BriefingPage = lazy(() =>
  import('./pages/BriefingPage').then((m) => ({ default: m.BriefingPage })),
);
const HelpPage = lazy(() => import('./pages/HelpPage').then((m) => ({ default: m.HelpPage })));
const SafetyPage = lazy(() => import('./pages/SafetyPage').then((m) => ({ default: m.SafetyPage })));
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);
const AccessibilityPage = lazy(() =>
  import('./pages/AccessibilityPage').then((m) => ({ default: m.AccessibilityPage })),
);

/* Shown while a route chunk arrives. It is announced rather than silent — a
   screen-reader user gets told the page is loading instead of landing in an
   empty main. `role="status"` is a live region, not a focus target, so it
   cannot trap focus or steal it from the skip link. The min-height holds the
   viewport so the header and footer do not jump when the chunk resolves. */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex w-full max-w-shell items-center justify-center px-5 py-24 sm:px-6 lg:px-8"
      style={{ minHeight: '60vh' }}
    >
      <p className="m-0 font-sans text-[16px] leading-6 text-ink-muted">Loading…</p>
    </div>
  );
}

/* Routes are the set in UX_FLOWS §1 and nothing beyond it. Most screens in
   this product are states of these surfaces, not URLs of their own: errors,
   loading and the evidence panel all live inside the route they belong to, so
   Back means what a reader expects it to mean. */
function RouteEffects() {
  const { hash, pathname, key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    /* One frame, so the target exists after a route change. */
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          return;
        }
      }
      /* A new destination starts at the top; going Back does not, because the
         reader is returning to something they were already reading. */
      if (navigationType !== 'POP') window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
    /* `key` changes on every navigation, including one to the hash the page
       is already on, so clicking "How it works" twice still works. */
  }, [hash, pathname, key, navigationType]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  /* The marketing footer belongs on the public surfaces. Inside a document
     it would be noise beside the reader's own briefing. */
  const showFooter = !pathname.startsWith('/d/');

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <RouteEffects />
      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/situation" element={<SituationPage />} />
            <Route path="/d/:id/processing" element={<ProcessingPage />} />
            <Route path="/d/:id/help" element={<HelpPage />} />
            <Route path="/d/:id" element={<BriefingPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
          </Routes>
        </Suspense>
      </main>
      {showFooter && <SiteFooter />}
    </>
  );
}
