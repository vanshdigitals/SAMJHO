import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonLink } from '../components/ui/Button';
import {
  BackIcon,
  CheckIcon,
  FileTextIcon,
  QuestionIcon,
  UnclearIcon,
  WatchOutIcon,
} from '../components/icons';
import {
  analyzeSituation,
  createSituation,
  type SituationAnalyzeResponse,
} from '../lib/api';

/* /situation — the situation-first intake (UX_FLOWS §1, §3).
   Four plain questions, then what we understand so far.
   With no document there is nothing to quote, so it never states an obligation,
   a deadline or an amount — it says what is known, what is not, and what to ask. */

const KINDS = [
  'A notice from a landlord',
  'A rental agreement I’ve been given',
  'Something about a deposit',
  'Something else about where I live',
];

const NEEDS = [
  'What it means',
  'What I have to do',
  'Whether there’s a deadline',
  'What to ask a professional',
];

const UNKNOWNS = [
  'What your document actually says — we haven’t seen one.',
  'The exact dates, and when anything was received.',
  'What was agreed in writing, and on what terms.',
];

const QUESTIONS_TO_ASK = [
  'What does the document I received actually require me to do?',
  'Is there a date I have to act by, and when does it start running?',
  'What was agreed about the deposit, and in what terms?',
  'What should I put in writing, and what should I keep?',
];

type Answers = { what: string; kind: string; needs: string[]; context: string };

export function SituationPage() {
  const [step, setStep] = useState(0);
  const [situationId, setSituationId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SituationAnalyzeResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [answers, setAnswers] = useState<Answers>({
    what: '',
    kind: '',
    needs: [],
    context: '',
  });

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const total = 4;
  const canContinue =
    (step === 0 && answers.what.trim().length > 0) ||
    (step === 1 && answers.kind !== '') ||
    step === 2 ||
    step === 3;

  async function handleNext() {
    if (step === 0 && !situationId) {
      try {
        const created = await createSituation(answers.what);
        setSituationId(created.situation_id);
      } catch {
        // Fallback gracefully
      }
      setStep(1);
    } else if (step === total - 1) {
      setAnalyzing(true);
      try {
        let sitId = situationId;
        if (!sitId) {
          const created = await createSituation(answers.what);
          sitId = created.situation_id;
          setSituationId(sitId);
        }
        const answersPayload = [
          { question_id: 'kind', answer: answers.kind },
          { question_id: 'needs', answer: answers.needs.join(', ') },
          { question_id: 'context', answer: answers.context },
        ];
        const res = await analyzeSituation(sitId, answersPayload);
        setAnalysisResult(res);
      } catch {
        // Graceful fallback to static orientation
      } finally {
        setAnalyzing(false);
        setStep(total);
      }
    } else {
      setStep((s) => s + 1);
    }
  }

  if (step === total) {
    return (
      <Summary
        answers={answers}
        analysis={analysisResult}
        onBack={() => setStep(total - 1)}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <Link
        to="/start"
        className="inline-flex items-center gap-2 font-sans text-[15px] leading-6 text-ink-muted
                   no-underline transition-colors duration-200 ease-out hover:text-primary"
      >
        <BackIcon size={16} className="shrink-0" />
        Other ways to start
      </Link>

      <h1 className="sr-only">Tell us what happened</h1>

      {/* Progress as a count, not a bar */}
      <div className="mt-6 flex items-center gap-4">
        <p className="m-0 font-ui text-[13px] font-medium leading-5 tabular-nums text-ink-muted">
          Question {step + 1} of {total}
        </p>
        <span aria-hidden className="flex flex-1 gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-hairline'}`}
            />
          ))}
        </span>
      </div>

      <div className="mt-8">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="m-0 font-sans text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-ink outline-none sm:text-[32px]"
        >
          {step === 0 && 'What happened?'}
          {step === 1 && 'What kind of document or matter is this?'}
          {step === 2 && 'What do you need to know most?'}
          {step === 3 && 'Anything else that matters?'}
        </h2>

        <p className="m-0 mt-3 font-sans text-[16px] leading-[1.6] text-ink-secondary">
          {step === 0 &&
            'Tell us in your own words. Plain sentences are best — who said what, and when.'}
          {step === 1 && 'Choose the closest one. You can explain more in a moment.'}
          {step === 2 && 'Pick as many as apply. This shapes what we look at first.'}
          {step === 3 && 'Optional. Dates, amounts, or anything agreed verbally.'}
        </p>

        <div className="mt-6">
          {step === 0 && (
            <Textarea
              label="What happened?"
              value={answers.what}
              placeholder="My landlord sent a message saying rent is going up by ₹5,000 next month and I have to agree or leave."
              onChange={(what) => setAnswers((a) => ({ ...a, what }))}
            />
          )}

          {step === 1 && (
            <fieldset className="m-0 border-0 p-0">
              <legend className="sr-only">What kind of document or matter is this?</legend>
              <div className="space-y-3">
                {KINDS.map((kind) => (
                  <Choice
                    key={kind}
                    type="radio"
                    name="kind"
                    label={kind}
                    checked={answers.kind === kind}
                    onChange={() => setAnswers((a) => ({ ...a, kind }))}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="m-0 border-0 p-0">
              <legend className="sr-only">What do you need to know most?</legend>
              <div className="space-y-3">
                {NEEDS.map((need) => (
                  <Choice
                    key={need}
                    type="checkbox"
                    name="needs"
                    label={need}
                    checked={answers.needs.includes(need)}
                    onChange={() =>
                      setAnswers((a) => ({
                        ...a,
                        needs: a.needs.includes(need)
                          ? a.needs.filter((n) => n !== need)
                          : [...a.needs, need],
                      }))
                    }
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <Textarea
              label="Anything else that matters?"
              value={answers.context}
              placeholder="It arrived on 14 March. I paid the rent for that month."
              onChange={(context) => setAnswers((a) => ({ ...a, context }))}
            />
          )}
        </div>
      </div>

      <div className="mt-9 flex flex-col-reverse gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:gap-4">
        {step > 0 && (
          <Button variant="secondary" size="md" onClick={() => setStep((s) => s - 1)}>
            <BackIcon size={17} className="shrink-0 text-ink-secondary" />
            Back
          </Button>
        )}

        <Button size="md" disabled={!canContinue || analyzing} onClick={handleNext}>
          {analyzing
            ? 'Looking through what you told us...'
            : step === total - 1
              ? 'See where you stand'
              : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

function Textarea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={5}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full resize-y rounded-sm border border-hairline-strong bg-surface px-4 py-3.5
                   font-sans text-[17px] leading-[1.6] text-ink placeholder:text-ink-muted
                   transition-colors duration-200 ease-out hover:border-ink-muted
                   focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function Choice({
  type,
  name,
  label,
  checked,
  onChange,
}: {
  type: 'radio' | 'checkbox';
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-[56px] cursor-pointer items-center gap-3.5 rounded-sm border px-4 py-3
                  transition-colors duration-200 ease-out ${
                    checked
                      ? 'border-primary bg-primary-subtle'
                      : 'border-hairline bg-surface hover:border-hairline-strong'
                  }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center border ${
          type === 'radio' ? 'rounded-full' : 'rounded-[4px]'
        } ${checked ? 'border-primary bg-primary' : 'border-hairline-strong bg-surface'}
           peer-focus-visible:outline peer-focus-visible:outline-2
           peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[color:var(--focus-ring)]`}
      >
        {checked && <CheckIcon size={13} className="text-on-primary" />}
      </span>
      <span className="font-sans text-[16.5px] leading-6 text-ink">{label}</span>
    </label>
  );
}

/* What we understand so far — orientation, and the gaps named out loud. */
function Summary({
  answers,
  analysis,
  onBack,
}: {
  answers: Answers;
  analysis: SituationAnalyzeResponse | null;
  onBack: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  const unknowns =
    analysis && analysis.what_is_missing.length > 0 ? analysis.what_is_missing : UNKNOWNS;

  const questions =
    analysis && analysis.questions_for_professional.length > 0
      ? analysis.questions_for_professional
      : QUESTIONS_TO_ASK;

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="m-0 font-sans text-[32px] font-medium leading-[1.1] tracking-[-0.026em] text-ink
                   sm:text-[38px] lg:text-[44px]"
      >
        What we understand so far
      </h1>

      <p className="m-0 mt-4 max-w-measure font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
        This is orientation, not a briefing. Samjo hasn’t seen a document, so nothing below is
        quoted from one.
      </p>

      <section className="mt-10 rounded-md border border-hairline bg-surface p-5 shadow-subtle sm:p-6 lg:p-7">
        <h2 className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.12em] text-ink-muted">
          What you told us
        </h2>
        <p className="m-0 mt-3 max-w-measure font-sans text-[17px] leading-[1.6] text-ink">
          {answers.what.trim() || 'You didn’t describe the situation.'}
        </p>
        {answers.kind && (
          <p className="m-0 mt-3 font-sans text-[15.5px] leading-6 text-ink-secondary">
            {answers.kind}
            {answers.needs.length > 0 && ` · ${answers.needs.join(' · ')}`}
          </p>
        )}
        {answers.context.trim() && (
          <p className="m-0 mt-3 max-w-measure font-sans text-[15.5px] leading-[1.6] text-ink-secondary">
            {answers.context.trim()}
          </p>
        )}
        <button
          type="button"
          onClick={onBack}
          className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 border-0
                     bg-transparent px-0 font-sans text-[15.5px] font-medium leading-6 text-primary
                     transition-colors duration-200 ease-out hover:text-primary-hover"
        >
          <BackIcon size={16} className="shrink-0" />
          Change an answer
        </button>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <Block
          icon={<UnclearIcon size={18} className="text-ink-muted" />}
          title="What we don’t know yet"
          lead="Named, rather than filled in with something plausible."
        >
          <ul className="m-0 list-none space-y-3 p-0">
            {unknowns.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full border border-hairline-strong"
                />
                <span className="font-sans text-[16px] leading-[1.6] text-ink-secondary">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          icon={<QuestionIcon size={18} className="text-ink-muted" />}
          title="Questions worth asking"
          lead="Take these to whoever you speak to next."
        >
          <ol className="m-0 list-none space-y-3 p-0">
            {questions.map((q, i) => (
              <li key={q} className="flex gap-3.5">
                <span className="font-ui text-[13px] font-medium leading-6 tabular-nums text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-sans text-[16px] leading-[1.6] text-ink-secondary">{q}</span>
              </li>
            ))}
          </ol>
        </Block>
      </div>

      <p className="mx-auto mt-8 flex max-w-[680px] items-start gap-3 font-sans text-[16px] leading-[1.6] text-ink-secondary">
        <WatchOutIcon size={19} className="mt-1 shrink-0 text-warning" />
        <span>
          If a date is running, or the situation is serious, getting professional help comes before
          reading further.
        </span>
      </p>

      {/* The bridge back into flow 1 — UX_FLOWS §3 */}
      <section className="mt-10 rounded-md border border-hairline bg-background p-6 sm:p-8">
        <h2 className="m-0 font-sans text-[22px] font-medium leading-[1.3] tracking-[-0.015em] text-ink lg:text-[25px]">
          Do you have the document?
        </h2>
        <p className="m-0 mt-2.5 max-w-measure font-sans text-[16.5px] leading-[1.6] text-ink-secondary">
          Show it to Samjo and you get a briefing where every point traces back to a line in it,
          instead of orientation alone.
        </p>
        <ButtonLink to="/upload" size="md" className="mt-6">
          <FileTextIcon size={18} className="shrink-0" />
          Show us the document
        </ButtonLink>
      </section>
    </div>
  );
}

function Block({
  icon,
  title,
  lead,
  children,
}: {
  icon: ReactNode;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-hairline bg-surface p-5 shadow-subtle sm:p-6">
      <h2 className="m-0 flex items-center gap-2.5 font-sans text-[18px] font-medium leading-[1.35] text-ink lg:text-[19px]">
        <span className="flex shrink-0 items-center">{icon}</span>
        {title}
      </h2>
      <p className="m-0 mt-2 font-sans text-[15px] leading-[1.55] text-ink-muted">{lead}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}
