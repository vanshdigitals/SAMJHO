import type { ReactNode } from 'react';

/* Shell for the three static policy surfaces (/privacy, /safety,
   /accessibility — UX_FLOWS §1). One reading column at the 68ch measure, one
   h1, plain h2 sections. No cards: these are documents, and dressing them up
   as product UI would be the security theatre the brief rules out. */

export function PolicyPage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[840px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <p className="m-0 font-sans text-[12.5px] font-medium uppercase leading-5 tracking-[0.14em] text-primary">
        {eyebrow}
      </p>

      <h1
        className="m-0 mt-3.5 font-sans text-[32px] font-medium leading-[1.1] tracking-[-0.026em]
                   text-ink sm:text-[38px] lg:text-[44px]"
      >
        {title}
      </h1>

      <p className="m-0 mt-5 max-w-measure font-sans text-[18px] leading-[1.6] text-ink-secondary lg:text-[19px]">
        {lead}
      </p>

      <div className="mt-10 lg:mt-12">{children}</div>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-hairline py-8 first:border-t-0 first:pt-0 lg:py-10">
      <h2 className="m-0 font-sans text-[22px] font-medium leading-[1.3] tracking-[-0.015em] text-ink lg:text-[25px]">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 max-w-measure font-sans text-[17px] leading-[1.65] text-ink-secondary lg:text-[18px]">
      {children}
    </p>
  );
}

export function Facts({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="m-0">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-1 border-b border-hairline py-3.5 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <dt className="m-0 font-sans text-[16.5px] leading-6 text-ink">{row.label}</dt>
          <dd className="m-0 font-sans text-[16px] leading-6 text-ink-secondary sm:text-right">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Points({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-none space-y-3 p-0">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className="mt-[11px] h-[6px] w-[6px] shrink-0 rounded-full bg-hairline-strong"
          />
          <span className="max-w-measure font-sans text-[17px] leading-[1.65] text-ink-secondary lg:text-[18px]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
