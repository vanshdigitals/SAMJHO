import type { ReactNode } from 'react';
import { GlobeIcon, KeyboardIcon, PhoneIcon, SpeakIcon } from '../icons';

/* Section 08 — copy verbatim from SAMJO_LANDING_PAGE_CONTENT.md §08.

   The four claims are shown as the controls that make them true: a language
   switch with the briefing following it into Hindi, a read-aloud bar that is
   stopped, and a 360px frame. The device-voice caveat sits inside the
   read-aloud visual rather than in a footnote, because that is where a
   reader would meet it — ACCESSIBILITY §1. */

const STATEMENTS = [
  {
    Icon: GlobeIcon,
    title: 'Hindi and English, all the way through',
    body: 'Not just the buttons. The briefing itself, including the explanations.',
  },
  {
    Icon: SpeakIcon,
    title: 'Listen instead of reading',
    body: 'Play the briefing aloud. Pause and pick it up again. It never starts on its own.',
  },
  {
    Icon: PhoneIcon,
    title: 'Works on the phone you have',
    body: 'Designed for a 360-pixel screen and a slow connection first, not as an afterthought.',
  },
  {
    Icon: KeyboardIcon,
    title: 'Keyboard and screen reader throughout',
    body: 'Every part of the flow, including the evidence panel.',
  },
];

export function AccessSection() {
  return (
    <section id="access" className="w-full bg-surface">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* ── Intro ─────────────────────────────────────────────── */}
        <div className="rise-in mx-auto flex max-w-[760px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
            Language and access
          </p>

          <h2
            className="m-0 mt-3.5 font-sans text-[36px] font-medium leading-[1.08] tracking-[-0.026em]
                       text-ink sm:text-[42px] md:text-[48px] lg:text-[54px]"
          >
            Built to be used, not just visited
          </h2>
        </div>

        {/* ── Claims beside the controls that make them true ────── */}
        <div className="mt-14 grid grid-cols-1 items-start gap-12 md:mt-16 lg:mt-20 lg:grid-cols-[6fr_5fr] lg:gap-14 xl:gap-20">
          <ul className="m-0 list-none p-0">
            {STATEMENTS.map(({ Icon, title, body }, i) => (
              <li
                key={title}
                className={`flex gap-4 py-6 sm:gap-5 ${i > 0 ? 'border-t border-hairline' : 'pt-0'}`}
              >
                <Icon className="mt-0.5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <h3 className="m-0 font-sans text-[18px] font-medium leading-[1.35] tracking-[-0.01em] text-ink lg:text-[20px]">
                    {title}
                  </h3>
                  <p className="m-0 mt-2 max-w-measure font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="rise-in-delayed space-y-5">
            <LanguagePanel />
            <ListenPanel />
            <NarrowPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

/* The switch, and the briefing line following it. */
function LanguagePanel() {
  return (
    <Panel label="Language">
      <div aria-hidden className="flex gap-2">
        <Chip>English</Chip>
        <Chip active lang="hi">
          हिन्दी
        </Chip>
      </div>

      <div aria-hidden className="mt-4 rounded-sm border border-hairline bg-background p-3.5">
        <p className="m-0 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.1em] text-warning">
          Time-sensitive
        </p>
        <p
          lang="hi"
          className="m-0 mt-1.5 font-sans text-[15px] font-medium leading-[1.5] text-ink"
        >
          आपको 14 मार्च से 30 दिन के भीतर जवाब देना है।
        </p>
      </div>
    </Panel>
  );
}

/* Stopped at zero, because it never starts on its own. */
function ListenPanel() {
  return (
    <Panel label="Read aloud">
      <div aria-hidden className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-surface">
          <span className="ml-[2px] h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-ink" />
        </span>

        <span className="h-[3px] flex-1 rounded-full bg-hairline">
          <span className="block h-full w-[8%] rounded-full bg-primary" />
        </span>

        <span className="shrink-0 font-ui text-[12px] leading-4 tabular-nums text-ink-muted">
          0:00 / 1:04
        </span>
      </div>

      <p className="m-0 mt-3.5 border-t border-hairline pt-3 font-sans text-[13.5px] leading-[1.55] text-ink-muted">
        Read-aloud uses the voices already on your device, so a Hindi voice depends on your
        phone. If yours doesn’t have one, Samjo tells you instead of reading Hindi in an English
        voice.
      </p>
    </Panel>
  );
}

/* The narrow end of the range, drawn to scale rather than described. */
function NarrowPanel() {
  return (
    <Panel label="360 pixels wide">
      <div aria-hidden className="flex items-stretch gap-3">
        <div className="w-[104px] shrink-0 rounded-sm border border-hairline bg-background p-2.5">
          <div className="h-1.5 w-[60%] rounded-full bg-hairline-strong opacity-50" />
          <div className="mt-2 rounded-[3px] border-l-2 border-warning bg-warning-surface px-1.5 py-1">
            <div className="h-1 w-[80%] rounded-full bg-warning opacity-50" />
            <div className="mt-1 h-1 w-[52%] rounded-full bg-warning opacity-50" />
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="h-1 w-[92%] rounded-full bg-hairline-strong opacity-40" />
            <div className="h-1 w-[74%] rounded-full bg-hairline-strong opacity-40" />
            <div className="h-1 w-[84%] rounded-full bg-hairline-strong opacity-40" />
          </div>
        </div>

        <p className="m-0 self-center font-sans text-[13.5px] leading-[1.55] text-ink-muted">
          The whole briefing fits, and stays readable, without sideways scrolling.
        </p>
      </div>
    </Panel>
  );
}

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-hairline bg-surface p-4 shadow-subtle sm:p-5">
      <p className="m-0 mb-3.5 font-sans text-[11.5px] font-medium uppercase leading-4 tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  children,
  active = false,
  lang,
}: {
  children: ReactNode;
  active?: boolean;
  lang?: string;
}) {
  return (
    <span
      lang={lang}
      className={`inline-flex items-center rounded-sm border px-3 py-1.5 font-sans text-[13.5px] leading-5 ${
        active
          ? 'border-primary bg-primary-subtle font-medium text-primary'
          : 'border-hairline bg-surface text-ink-secondary'
      }`}
    >
      {children}
    </span>
  );
}
