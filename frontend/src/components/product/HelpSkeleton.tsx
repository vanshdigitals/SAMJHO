export function HelpSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1040px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20 animate-pulse"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading help questions...</span>

      {/* Back button skeleton */}
      <div className="h-5 w-40 rounded bg-hairline-strong/30" />

      {/* Heading skeleton */}
      <div className="mt-6 h-10 w-80 rounded bg-hairline-strong/40 sm:h-12 sm:w-96" />
      <div className="mt-4 h-6 w-full max-w-[560px] rounded bg-hairline-strong/20" />

      {/* Questions section skeleton */}
      <section className="mt-10 lg:mt-12">
        <div className="h-4 w-36 rounded bg-hairline-strong/35" />

        <div className="mt-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex gap-4 sm:gap-5 py-6 ${i > 1 ? 'border-t border-hairline' : 'pt-0'}`}
            >
              <div className="h-6 w-6 rounded bg-hairline-strong/30 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 rounded bg-hairline-strong/30" />
                <div className="h-4 w-1/2 rounded bg-hairline-strong/20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cards skeleton */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="h-56 rounded-md border border-hairline bg-surface p-5 sm:p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-hairline-strong/35" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-hairline-strong/20" />
            <div className="h-4 w-5/6 rounded bg-hairline-strong/20" />
            <div className="h-4 w-4/6 rounded bg-hairline-strong/20" />
          </div>
        </div>
        <div className="h-56 rounded-md border border-hairline bg-surface p-5 sm:p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-hairline-strong/35" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-hairline-strong/20" />
            <div className="h-4 w-5/6 rounded bg-hairline-strong/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
