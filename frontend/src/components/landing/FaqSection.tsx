import { useId, useState } from 'react';
import { ChevronDownIcon } from '../icons';

/* Section 12 — questions and answers verbatim from
   SAMJO_LANDING_PAGE_CONTENT.md §12.

   A native button per row with aria-expanded and a region it controls. The
   panel animates through grid-template-rows 0fr -> 1fr, so the open height
   comes from the content itself and nothing has to be measured in JS or
   guessed at a fixed max-height. Rows open independently: closing someone
   else's answer to read yours is a behaviour, not a feature. */

const QA: { q: string; a: string }[] = [
  {
    q: 'What is Samjo?',
    a: 'A tool that helps you understand a legal document you’ve received. It tells you what the document is, what matters in it, whether a deadline is running, and what to ask a professional. It gives legal information, not legal advice.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. No email, no password, no sign-up. Start and you’re in.',
  },
  {
    q: 'What can I give Samjo?',
    a: 'A PDF, a Word document, or a photo — JPEG or PNG. Up to 10 MB and 30 pages.',
  },
  {
    q: 'What kinds of documents does Samjo handle right now?',
    a: 'Residential rental agreements, and legal notices that come out of rental and housing situations. If you give Samjo something else, it says so rather than guessing — and offers to help you think the situation through instead.',
  },
  {
    q: 'Can I use Samjo in Hindi?',
    a: 'Yes. Both the interface and the briefing itself. Switch language at any time in the header.',
  },
  {
    q: 'Does Samjo give legal advice?',
    a: 'No. Samjo explains what your document says and helps you prepare. Applying law to your particular facts is legal advice, and that’s a qualified professional’s work.',
  },
  {
    q: 'Can Samjo tell me whether I’ll win?',
    a: 'No, and it won’t pretend to. Ask and it will say: “I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can’t predict the outcome of a legal dispute.”',
  },
  {
    q: 'How does Samjo show where something came from?',
    a: 'Every point in your briefing has a marker beside it. Tap the marker and you see the exact sentence from your document, the page it’s on, and Samjo’s reading of it kept separate from the quote. If Samjo can’t find the sentence, it drops the point rather than showing it.',
  },
  {
    q: 'What happens to my document?',
    a: 'It’s deleted within 24 hours, or immediately if you ask. Its text is never written into our logs. To analyse it, Samjo does send the text to an AI provider — worth knowing before you start.',
  },
  {
    q: 'Can I listen to the briefing?',
    a: 'Yes, with pause and resume. It never starts on its own. Read-aloud uses your device’s own voices, so a Hindi voice depends on your phone; if yours doesn’t have one, Samjo tells you.',
  },
  {
    q: 'What if Samjo can’t find something in my document?',
    a: 'It says it isn’t in the document. Samjo won’t fill the gap with something plausible.',
  },
  {
    q: 'What if my photo is blurry?',
    a: 'Samjo will still try, and will warn you that it wasn’t confident about the text it read. You’ll be able to see what it made out and check it before relying on it.',
  },
];

export function FaqSection() {
  return (
    <section id="questions" className="w-full bg-surface">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[4fr_8fr] lg:gap-14 xl:gap-20">
          <div className="rise-in lg:sticky lg:top-[120px] lg:self-start">
            <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
              Answers
            </p>

            <h2
              className="m-0 mt-3.5 max-w-[12ch] font-sans text-[36px] font-medium leading-[1.08]
                         tracking-[-0.026em] text-ink sm:text-[42px] md:text-[48px] lg:text-[52px]"
            >
              Questions people ask
            </h2>

            <p className="m-0 mt-5 max-w-[42ch] font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
              The ones that come up before anyone gives Samjo a document.
            </p>
          </div>

          <div className="border-t border-hairline">
            {QA.map((item) => (
              <FaqRow key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div className="border-b border-hairline">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="group flex w-full cursor-pointer items-start justify-between gap-5 border-0
                     bg-transparent px-0 py-5 text-left font-sans text-[17px] font-medium
                     leading-[1.45] text-ink transition-colors duration-200 ease-out
                     hover:text-primary sm:py-6 sm:text-[18px] lg:text-[19px]"
        >
          <span>{question}</span>

          {/* The only thing that moves is the chevron */}
          <span
            aria-hidden
            data-motion="transform"
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-ink-muted
                        transition-[transform,color] duration-200 ease-out
                        group-hover:text-primary ${open ? 'rotate-180 text-primary' : ''}`}
          >
            <ChevronDownIcon size={18} />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        {/* invisible rather than display:none so the row keeps its animation
            while staying out of the accessibility tree when closed */}
        <div className={`overflow-hidden ${open ? 'visible' : 'invisible'}`}>
          <p
            className={`m-0 max-w-measure pb-6 pr-8 font-sans text-[16px] leading-[1.65]
                        text-ink-secondary transition-opacity duration-200 ease-out lg:text-[17px]
                        ${open ? 'opacity-100' : 'opacity-0'}`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
