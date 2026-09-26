import { Link } from 'react-router-dom';
import { Facts, P, PolicyPage, PolicySection, Points } from '../components/product/PolicyPage';

/* /privacy — the full note behind the landing section's four statements.
   Retention values are the defaults in SECURITY.md §5; the never-logged list
   is SECURITY.md §6, rewritten into the interface vocabulary UX_FLOWS §7
   requires (no "LLM", no "pipeline"). */

export function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="What happens to your document"
      lead="Four things, stated as they are. Nothing here is softened to sound better than it is."
    >
      <PolicySection title="No account">
        <P>
          No email, no phone number, no password. Samjo doesn’t ask who you are, so there is no
          profile to build and nothing to sign out of. A session is a short-lived identifier that
          keeps your own briefing yours while you are reading it.
        </P>
      </PolicySection>

      <PolicySection title="Deleted within 24 hours">
        <P>
          Your document and the text read out of it are removed within a day, or the moment you
          ask — whichever comes first.
        </P>
        <Facts
          rows={[
            { label: 'The file you gave us', value: 'Deleted within 24 hours' },
            { label: 'The text read out of it', value: 'Deleted with the document' },
            { label: 'The briefing built from it', value: 'Deleted with the document' },
            { label: 'Your session', value: 'Expires within 72 hours' },
            { label: 'Our own service records', value: 'Identifiers and actions only, 30 days' },
          ]}
        />
      </PolicySection>

      <PolicySection title="Never in our logs">
        <P>None of the following is ever written into a log, in any form:</P>
        <Points
          items={[
            'The text of your document.',
            'Personal details appearing inside it.',
            'The original file name.',
            'Anything Samjo sends to the AI service, or anything it sends back.',
          ]}
        />
        <P>
          What is recorded is deliberately dull: an identifier for the request, how long it took,
          which stage it reached, the kind of document and how many pages it had, and any error
          code. That is enough to keep the service working and not enough to reconstruct what you
          sent.
        </P>
      </PolicySection>

      <PolicySection title="Read by an AI service">
        <P>
          To analyse your document, Samjo sends its text to an AI provider. We’re telling you
          because you’d want to know — it is the one part of this that leaves our own systems.
          Samjo does not send the original file, and it does not send anything that identifies
          you, because it never had it.
        </P>
      </PolicySection>

      <PolicySection title="Deleting it sooner">
        <P>
          You can remove a document at any point while you are reading its briefing, and it goes
          immediately rather than waiting out the day.
        </P>
      </PolicySection>

      <PolicySection title="Related">
        <P>
          <Link
            to="/safety"
            className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
          >
            What Samjo does and doesn’t do
          </Link>{' '}
          ·{' '}
          <Link
            to="/accessibility"
            className="font-medium text-primary no-underline transition-colors duration-200 ease-out hover:text-primary-hover"
          >
            Accessibility
          </Link>
        </P>
      </PolicySection>
    </PolicyPage>
  );
}
