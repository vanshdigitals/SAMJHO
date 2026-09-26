import { Link } from 'react-router-dom';
import { P, PolicyPage, PolicySection, Points } from '../components/product/PolicyPage';

/* /safety — the full statement behind the landing section. The refusal is
   verbatim from AI_SAFETY §3 and the jurisdiction line states the assumption
   rather than asserting a fact (AI_SAFETY §6). */

export function SafetyPage() {
  return (
    <PolicyPage
      eyebrow="Limits and safety"
      title="What Samjo does, and what it doesn’t"
      lead="Samjo explains what your document says, points out what matters and what’s time-sensitive, and helps you prepare for a professional."
    >
      <PolicySection title="What Samjo does">
        <Points
          items={[
            'Explains what your document says, in plain language.',
            'Points out what actually matters in it, in a fixed order with anything urgent first.',
            'Shows the exact sentence behind every important point, and where in the document it sits.',
            'Says how confident it is, and marks an item Verify where a professional should confirm it.',
            'Helps you prepare the questions worth asking, and what to take with you.',
          ]}
        />
      </PolicySection>

      <PolicySection title="What Samjo doesn’t do">
        <Points
          items={[
            'It won’t predict how a dispute will turn out.',
            'It won’t tell you whether to sign.',
            'It won’t decide whether a clause is enforceable.',
            'It isn’t a lawyer, and it doesn’t replace one.',
          ]}
        />
      </PolicySection>

      <PolicySection title="Ask Samjo who’ll win">
        <blockquote className="m-0 max-w-measure border-l-2 border-primary pl-5 font-sans text-[19px] leading-[1.55] text-ink lg:text-[21px]">
          “I can help you understand the document, identify what it says, highlight issues to
          discuss with a legal professional, and prepare questions. I can’t predict the outcome of
          a legal dispute.”
        </blockquote>
        <P>
          That’s not Samjo being cautious. Applying law to your particular facts is what a
          qualified professional is for.
        </P>
      </PolicySection>

      <PolicySection title="When Samjo can’t find something">
        <P>
          If Samjo can’t point to the exact sentence in your document, it doesn’t make the claim at
          all. Nothing unsourced reaches your briefing, and a gap is reported as a gap rather than
          filled with something plausible.
        </P>
      </PolicySection>

      <PolicySection title="When the situation looks serious">
        <P>
          Where a document appears to contain a time-sensitive requirement, or the situation looks
          serious, Samjo puts getting professional help above reading further. That message is not
          a disclaimer and is not styled as one.
        </P>
      </PolicySection>

      <PolicySection title="Where this applies">
        <P>
          Samjo assumes an Indian context, and residential rental agreements and housing notices in
          particular. Give it something else and it says so rather than guessing.
        </P>
        <P>
          Samjo gives legal information to help you understand your document and prepare. It is not
          legal advice and not a substitute for a lawyer.
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
