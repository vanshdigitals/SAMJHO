export function BriefingSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-shell px-5 py-10 sm:px-6 md:py-12 lg:px-8 lg:py-14 animate-pulse"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading document briefing...</span>

      {/* Document header skeleton */}
      <div className="border-b border-hairline pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-4 w-4 rounded bg-hairline-strong/40" />
          <div className="h-4 w-32 rounded bg-hairline-strong/30" />
          <span className="text-hairline-strong">·</span>
          <div className="h-4 w-16 rounded bg-hairline-strong/30" />
          <span className="text-hairline-strong">·</span>
          <div className="h-4 w-20 rounded bg-hairline-strong/30" />
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-4">
          <div className="h-9 w-64 rounded bg-hairline-strong/40 sm:h-10 sm:w-80" />
          <div className="h-5 w-24 rounded bg-hairline-strong/25" />
        </div>

        {/* Grounding strip skeleton */}
        <div className="mt-5 h-16 w-full rounded-sm border border-hairline bg-surface-subtle" />
      </div>

      {/* Main 3-pane layout skeleton */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[200px_minmax(0,68ch)] xl:grid-cols-[200px_minmax(0,68ch)_minmax(280px,1fr)]">
        {/* Jump list skeleton (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <div className="h-3 w-16 rounded bg-hairline-strong/40" />
            <div className="space-y-2.5">
              {[
                'w-28',
                'w-24',
                'w-36',
                'w-20',
                'w-32',
                'w-28',
                'w-30',
                'w-28',
              ].map((w, idx) => (
                <div key={idx} className={`h-4 ${w} rounded bg-hairline-strong/20`} />
              ))}
            </div>
          </div>
        </aside>

        {/* Reading column skeleton */}
        <div className="min-w-0 space-y-10">
          {/* Time-sensitive banner placeholder */}
          <div className="rounded-md border border-hairline bg-surface-subtle p-4 space-y-2">
            <div className="h-3 w-24 rounded bg-hairline-strong/30" />
            <div className="h-5 w-3/4 rounded bg-hairline-strong/25" />
          </div>

          {/* Section 1: What this is */}
          <div className="space-y-3">
            <div className="h-3.5 w-24 rounded bg-hairline-strong/35" />
            <div className="h-6 w-full rounded bg-hairline-strong/20" />
            <div className="h-6 w-4/5 rounded bg-hairline-strong/20" />
          </div>

          {/* Section 2: What you need to do */}
          <div className="space-y-4 border-t border-hairline pt-8">
            <div className="h-3.5 w-36 rounded bg-hairline-strong/35" />
            <div className="space-y-3">
              <div className="h-5 w-11/12 rounded bg-hairline-strong/20" />
              <div className="h-5 w-3/4 rounded bg-hairline-strong/20" />
            </div>
          </div>

          {/* Section 3: Watch out */}
          <div className="space-y-4 border-t border-hairline pt-8">
            <div className="h-3.5 w-24 rounded bg-hairline-strong/35" />
            <div className="space-y-3">
              <div className="h-5 w-10/12 rounded bg-hairline-strong/20" />
              <div className="h-5 w-2/3 rounded bg-hairline-strong/20" />
            </div>
          </div>

          {/* Section 4 & 5: Details & Dates */}
          <div className="space-y-4 border-t border-hairline pt-8">
            <div className="h-3.5 w-32 rounded bg-hairline-strong/35" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-16 rounded border border-hairline bg-surface-subtle p-3 space-y-2">
                <div className="h-3 w-20 rounded bg-hairline-strong/30" />
                <div className="h-5 w-24 rounded bg-hairline-strong/20" />
              </div>
              <div className="h-16 rounded border border-hairline bg-surface-subtle p-3 space-y-2">
                <div className="h-3 w-20 rounded bg-hairline-strong/30" />
                <div className="h-5 w-24 rounded bg-hairline-strong/20" />
              </div>
            </div>
          </div>

          {/* Section 6: Questions */}
          <div className="space-y-4 border-t border-hairline pt-8">
            <div className="h-3.5 w-32 rounded bg-hairline-strong/35" />
            <div className="space-y-2">
              <div className="h-5 w-full rounded bg-hairline-strong/20" />
              <div className="h-5 w-4/5 rounded bg-hairline-strong/20" />
            </div>
          </div>

          {/* Section 7: Next steps */}
          <div className="space-y-4 border-t border-hairline pt-8">
            <div className="h-3.5 w-32 rounded bg-hairline-strong/35" />
            <div className="h-10 w-full rounded bg-hairline-strong/20" />
          </div>
        </div>

        {/* Evidence panel skeleton (desktop) */}
        <aside className="hidden xl:block">
          <div className="sticky top-20 rounded-md border border-hairline bg-surface p-5 space-y-4 shadow-subtle">
            <div className="h-3.5 w-28 rounded bg-hairline-strong/35" />
            <div className="h-20 w-full rounded bg-hairline-strong/15" />
            <div className="h-3.5 w-24 rounded bg-hairline-strong/30" />
            <div className="h-12 w-full rounded bg-hairline-strong/15" />
          </div>
        </aside>
      </div>
    </div>
  );
}
