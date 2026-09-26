import { AccessSection } from '../components/landing/AccessSection';
import { EvidenceSection } from '../components/landing/EvidenceSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCta } from '../components/landing/FinalCta';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { PrivacySection } from '../components/landing/PrivacySection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { ProductShowcase } from '../components/landing/ProductShowcase';
import { ProfessionalHelp } from '../components/landing/ProfessionalHelp';
import { SafetySection } from '../components/landing/SafetySection';
import { TwoWaysToStart } from '../components/landing/TwoWaysToStart';

/* Surfaces alternate white / warm down the whole page, so every section is
   separated by a change of ground rather than by a divider. The order is the
   argument: what you get, where it came from, why it is needed, how it
   works, how to start, then the limits and the questions. */

export function LandingPage() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <EvidenceSection />
      <ProblemSection />
      <HowItWorks />
      <TwoWaysToStart />
      <AccessSection />
      <PrivacySection />
      <SafetySection />
      <ProfessionalHelp />
      <FaqSection />
      <FinalCta />
    </>
  );
}
