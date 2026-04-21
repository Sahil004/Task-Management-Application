export function DashboardSkeleton() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-panel backdrop-blur sm:p-8">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded-full bg-sand" />
          <div className="mt-4 h-10 w-80 rounded-2xl bg-sand" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-sand/80" />

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-ink/5 bg-white p-4">
                <div className="h-3 w-16 rounded-full bg-sand" />
                <div className="mt-5 h-8 w-12 rounded-xl bg-sand/90" />
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] bg-ink/95 p-5">
              <div className="h-4 w-28 rounded-full bg-white/20" />
              <div className="mt-4 h-8 w-3/4 rounded-2xl bg-white/15" />
              <div className="mt-5 h-3 rounded-full bg-white/10" />
            </div>
            <div className="rounded-[1.75rem] bg-sand/70 p-5">
              <div className="h-4 w-24 rounded-full bg-white" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-3xl bg-white px-4 py-4">
                    <div className="h-4 w-2/3 rounded-full bg-sand" />
                    <div className="mt-3 h-3 w-1/3 rounded-full bg-sand/80" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
            <div className="rounded-[1.75rem] bg-white p-5">
              <div className="h-4 w-24 rounded-full bg-sand" />
              <div className="mt-4 h-9 w-48 rounded-2xl bg-sand/90" />
              <div className="mt-5 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-12 rounded-2xl bg-sand/60" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.75rem] bg-white p-5">
                <div className="h-4 w-24 rounded-full bg-sand" />
                <div className="mt-4 h-8 w-40 rounded-2xl bg-sand/90" />
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, columnIndex) => (
                  <div key={columnIndex} className="rounded-[1.75rem] bg-white p-4">
                    <div className="h-5 w-20 rounded-full bg-sand" />
                    <div className="mt-4 space-y-3">
                      {Array.from({ length: 2 }).map((_, cardIndex) => (
                        <div key={cardIndex} className="rounded-3xl bg-sand/50 p-4">
                          <div className="h-4 w-3/4 rounded-full bg-white" />
                          <div className="mt-3 h-3 w-full rounded-full bg-white/80" />
                          <div className="mt-2 h-3 w-2/3 rounded-full bg-white/80" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
