import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { SiteFooter } from './components/system/SiteFooter';
import { SiteHeader } from './components/system/SiteHeader';
import { SkipLink } from './components/system/SkipLink';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { BriefingPage } from './pages/BriefingPage';
import { HelpPage } from './pages/HelpPage';
import { LandingPage } from './pages/LandingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { SafetyPage } from './pages/SafetyPage';
import { SituationPage } from './pages/SituationPage';
import { StartPage } from './pages/StartPage';
import { UploadPage } from './pages/UploadPage';

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
      </main>
      {showFooter && <SiteFooter />}
    </>
  );
}
