/* The source document the briefing is derived from. Deliberately not a
   readable document viewer: just enough structure — a title, ruled lines, and
   one highlighted run — to make the relationship legible at a glance.

   Purely decorative, so it is aria-hidden: the briefing card beside it carries
   all the real content. */

export function SourceDocument() {
  return (
    <div
      aria-hidden
      /* Warm paper rather than surface white: the hero is now white, so a white
         fill would leave this readable only by its 1px border. It also reads
         better conceptually — paper document behind, white app briefing in
         front. */
      className="h-full w-full rounded-lg border border-hairline bg-background p-6 sm:p-7"
    >
      <p className="m-0 font-sans text-[12.5px] font-medium uppercase tracking-[0.14em] text-ink-secondary">
        Notice to vacate
      </p>

      <div className="mt-5 space-y-2.5">
        <Line w="w-[92%]" />
        <Line w="w-[78%]" />
        <Line w="w-[86%]" />
      </div>

      {/* The quoted run, marked the way the briefing cites it */}
      <div className="relative mt-6 space-y-2.5 pl-3">
        <span className="absolute bottom-0 left-0 top-0 w-[2px] rounded-full bg-primary opacity-40" />
        <Line w="w-[88%]" tone="bg-primary opacity-20" />
        <Line w="w-[72%]" tone="bg-primary opacity-20" />
      </div>

      <div className="mt-6 space-y-2.5">
        <Line w="w-[80%]" />
        <Line w="w-[90%]" />
        <Line w="w-[64%]" />
        <Line w="w-[84%]" />
        <Line w="w-[70%]" />
      </div>
    </div>
  );
}

function Line({ w, tone = 'bg-hairline-strong' }: { w: string; tone?: string }) {
  return <div className={`h-[7px] rounded-full opacity-60 ${tone} ${w}`} />;
}
