import { Link } from 'react-router-dom';
import { P, PolicyPage, PolicySection, Points } from '../components/product/PolicyPage';

/* /accessibility — only what ACCESSIBILITY.md §1 commits to for the MVP.
   The "should have" and "later" lists in that document (more Indic languages,
   voice input, low-bandwidth mode, a dyslexia-friendly font, AAA contrast)
   are deliberately absent: stating them here would be claiming them. */

export function AccessibilityPage() {
  return (
    <PolicyPage
      eyebrow="Access"
      title="Built to be used, not just visited"
      lead="Samjo targets WCAG 2.2 AA on every screen. What that means in practice, without the parts that aren’t built yet."
    >
      <PolicySection title="Reading and seeing">
        <Points
          items={[
            'Body text meets AA contrast, and the briefing itself sets at 18px because the reader is often stressed and may be older.',
            'Nothing is carried by colour alone. Urgency is an icon, a word and a colour. Confidence is a word. Verification is a word beside a shape.',
            'Text resizes to 200% without losing content or function.',
            'Every icon is either labelled or marked decorative.',
            'Light and dark are both designed, not inverted.',
          ]}
        />
      </PolicySection>

      <PolicySection title="Keyboard and screen reader">
        <Points
          items={[
            'Every interaction is reachable by keyboard, including the evidence sheet.',
            'Focus is always visible — a 2px ring, never suppressed — and follows reading order.',
            'The evidence sheet traps focus, closes on Escape, and returns focus to the marker that opened it.',
            'Touch targets are at least 44px, including the small source markers beside each point.',
            'A skip link jumps straight to the main content.',
            'Progress through the reading stages is announced politely, and completion is announced once.',
          ]}
        />
      </PolicySection>

      <PolicySection title="Language">
        <P>
          Hindi and English run through the whole product, not just the buttons — the briefing and
          its explanations too. The page language is set correctly so a screen reader pronounces
          Devanagari properly, and you can switch at any time from the header.
        </P>
      </PolicySection>

      <PolicySection title="Read-aloud">
        <P>
          You can play a briefing aloud, pause it and pick it up again. It never starts on its own.
        </P>
        <P>
          Read-aloud uses the voices already on your device, so a Hindi voice depends on your
          phone. If yours doesn’t have one, Samjo tells you instead of reading Hindi in an English
          voice.
        </P>
      </PolicySection>

      <PolicySection title="Motion">
        <P>
          If your device asks for reduced motion, Samjo removes the reveal sequence and every
          transform, and keeps only a short fade.
        </P>
      </PolicySection>

      <PolicySection title="On a phone">
        <P>
          Samjo is designed for a 360-pixel screen first. Evidence opens as a sheet from the bottom
          rather than a drawer from the side, so you never lose your place in the briefing, and
          nothing scrolls sideways at any width.
        </P>
      </PolicySection>

      <PolicySection title="Related">
        <P>
          <Link
            to="/privacy"
            className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
          >
            Privacy
          </Link>{' '}
          ·{' '}
          <Link
            to="/safety"
            className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
          >
            What Samjo does and doesn’t do
          </Link>
        </P>
      </PolicySection>
    </PolicyPage>
  );
}
