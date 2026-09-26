import type { ReactNode } from 'react';
import {
  AlertIcon,
  CalendarIcon,
  DetailsIcon,
  FileTextIcon,
  NextStepsIcon,
  QuestionIcon,
  WatchOutIcon,
} from '../icons';

/* Section 02 — the briefing a reader actually receives.

   Built as one continuous surface rather than a stack of cards: the briefing
   is a reading document with a rail down its side, and boxing each section
   would turn it into the dashboard DESIGN_SYSTEM §1 rules out.

   Section order is fixed by UX_FLOWS.md §4 and is not reorderable — the
   ranking is the product thesis. The numbers make that order explicit.

   Everything here is a static specimen. Nothing implies a control that the
   product does not have. */

export function ProductShowcase() {
  return (
    <section id="briefing" className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1520px] px-5 py-20 sm:px-6 md:py-24 lg:px-8 lg:py-24 xl:px-10">
        {/* ── Intro ─────────────────────────────────────────────── */}
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <p className="m-0 font-sans text-[13px] font-medium leading-5 tracking-[0.12em] text-ink-muted">
            THE BRIEFING
          </p>

          <h2
            className="m-0 mt-4 font-sans text-[34px] font-medium leading-[1.1] tracking-[-0.025em]
                       text-ink sm:text-[40px] md:text-[48px] lg:mt-3.5 lg:text-[58px] lg:leading-[1.08]
                       xl:text-[62px] xl:leading-[1.06]"
          >
            This is what you get
          </h2>

          <p className="m-0 mt-5 max-w-[660px] font-sans text-[17px] leading-[1.6] text-ink-secondary sm:text-[18px] lg:text-[19px]">
            Not a shorter version of your document. An answer to what it means for you, in a
            fixed order, with the urgent part first.
          </p>
        </div>

        {/* ── Product surface ───────────────────────────────────── */}
        <div className="rise-in mx-auto mt-14 w-full max-w-[760px] md:mt-16 lg:mt-16 lg:max-w-[960px] xl:max-w-[1440px]">
          <div className="overflow-hidden rounded-md border border-hairline bg-surface shadow-subtle">
            <ProductBar />

            <div className="px-5 py-6 sm:px-7 sm:py-7 lg:px-7 lg:py-8 xl:px-8">
              <Urgency />

              <div className="mt-7 space-y-7 lg:mt-8 lg:space-y-8">
                <Row n="02" title="What this is">
                  <p className="m-0 max-w-[62ch] font-sans text-[16px] leading-[1.6] text-ink-secondary lg:max-w-[72ch] lg:text-[17px]">
                    A notice to vacate, sent by your landlord under the terms of your rental
                    agreement.
                  </p>
                </Row>

                <Row n="03" title="What you need to do">
                  <ul className="m-0 list-none space-y-3 p-0">
                    <Marker>Respond in writing within 30 days</Marker>
                    <Marker>
                      Pay the outstanding rent of{' '}
                      <span className="font-ui tabular-nums text-ink">₹25,000</span>
                    </Marker>
                  </ul>
                </Row>

                <Row n="04" title="Watch out" icon={<WatchOutIcon className="text-warning" />}>
                  <ul className="m-0 list-none space-y-3 p-0">
                    <Marker verify>
                      The agreement lets the landlord deduct repair costs from your deposit
                      without an itemised list.
                    </Marker>
                  </ul>
                </Row>

                {/* Details and dates sit side by side above lg so the briefing
                    does not become a very tall column. */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                  <Row n="05" title="Important details" icon={<DetailsIcon className="text-ink-muted" />}>
                    <dl className="m-0 space-y-2.5">
                      <Detail label="Security deposit" value="₹25,000" />
                      <Detail label="Monthly rent" value="₹12,000" />
                      <Detail label="Notice period" value="30 days" />
                    </dl>
                  </Row>

                  <Row n="06" title="Dates that matter" icon={<CalendarIcon className="text-ink-muted" />}>
                    <dl className="m-0 space-y-2.5">
                      <Detail label="Notice dated" value="14 March" />
                      <Detail label="Respond by" value="13 April" verify />
                    </dl>
                  </Row>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                  <Row n="07" title="Questions to ask" icon={<QuestionIcon className="text-ink-muted" />}>
                    <p className="m-0 font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
                      Does the notice period start from the date I received the notice?
                    </p>
                    <p className="m-0 mt-2 font-ui text-[13px] leading-5 text-ink-muted">
                      3 more prepared for a legal professional
                    </p>
                  </Row>

                  <Row n="08" title="What to do next" icon={<NextStepsIcon className="text-ink-muted" />}>
                    <p className="m-0 font-sans text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
                      Prepare your response, and take the notice to a legal professional if you
                      are unsure.
                    </p>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Closing statement ─────────────────────────────────── */}
        <p className="mx-auto mt-10 max-w-[560px] text-center font-sans text-[16px] leading-[1.6] text-ink-muted lg:mt-12">
          See the exact sentence behind every important point.
        </p>
      </div>
    </section>
  );
}

/* Product chrome — just enough to place the briefing. No navigation, no
   sidebar, no account furniture. */
function ProductBar() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline bg-surface-subtle px-5 py-3.5 sm:px-7 lg:px-7 xl:px-8">
      <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
        Samjo
      </span>
      <span aria-hidden className="h-3.5 w-px bg-hairline-strong" />
      <span className="font-sans text-[13px] leading-5 text-ink-secondary">Briefing</span>

      <span className="ml-auto flex items-center gap-2 font-ui text-[12.5px] leading-5 text-ink-muted">
        <FileTextIcon size={15} className="shrink-0" />
        Rental notice · Read from your document
      </span>
    </div>
  );
}

function Urgency() {
  return (
    <div className="flex gap-3.5 rounded-sm border border-[color:var(--warning)] border-opacity-20 bg-warning-surface px-4 py-4 sm:px-5">
      <AlertIcon className="mt-0.5 shrink-0 text-warning" />
      <div className="min-w-0">
        <p className="m-0 flex items-baseline gap-2.5 font-sans text-[12.5px] font-medium uppercase leading-4 tracking-[0.09em] text-warning">
          <span className="font-ui not-italic tracking-normal text-warning opacity-70">01</span>
          Time-sensitive
        </p>
        <p className="m-0 mt-2 font-sans text-[18px] font-medium leading-[1.4] text-ink lg:text-[19px]">
          You have <span className="font-ui tabular-nums">30 days</span> from 14 March to
          respond.
        </p>
      </div>
    </div>
  );
}

function Row({
  n,
  title,
  icon,
  children,
}: {
  n: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-hairline pt-5 lg:pt-6">
      <div className="flex items-center gap-2.5">
        <span className="font-ui text-[12px] leading-4 tabular-nums text-ink-muted">{n}</span>
        {icon && <span className="flex shrink-0 items-center">{icon}</span>}
        <h3 className="m-0 font-sans text-[16px] font-medium leading-6 text-ink lg:text-[17px]">
          {title}
        </h3>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/* The rail marker: a claim tied to a place in the document. Hollow plus the
   word "Verify" where a professional should confirm it — never the shape
   alone (ACCESSIBILITY.md §1). */
function Marker({ children, verify = false }: { children: ReactNode; verify?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className={`mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full ${
          verify ? 'border border-warning bg-transparent' : 'bg-primary'
        }`}
      />
      <span className="max-w-[62ch] font-sans text-[16px] leading-[1.6] text-ink-secondary lg:max-w-[72ch] lg:text-[17px]">
        {children}
        {verify && (
          <span className="ml-2 whitespace-nowrap font-sans text-[13px] font-medium text-warning">
            Verify
          </span>
        )}
      </span>
    </li>
  );
}

function Detail({ label, value, verify = false }: { label: string; value: string; verify?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-2.5 last:border-0 last:pb-0">
      <dt className="m-0 font-sans text-[15px] leading-6 text-ink-secondary">{label}</dt>
      <dd className="m-0 flex items-baseline gap-2">
        {verify && (
          <span className="font-sans text-[12.5px] font-medium text-warning">Verify</span>
        )}
        <span className="font-ui text-[15px] leading-6 tabular-nums text-ink">{value}</span>
      </dd>
    </div>
  );
}
