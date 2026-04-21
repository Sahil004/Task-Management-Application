import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-clay">TaskFlow</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Plan the work. See the signal. Ship with calm.
            </h1>
          </div>
          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-ink/10 bg-white/70 px-5 py-2 text-sm font-medium text-ink transition hover:bg-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-ink/90"
            >
              Create Account
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <div className="inline-flex items-center rounded-full border border-clay/20 bg-white/70 px-4 py-2 text-sm text-ink/70 shadow-panel">
              Personal task management with JWT auth, dashboard insights, and board-ready workflows
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-ink/75">
              The frontend is tuned for fast daily use: focused forms, clear priority cues, a responsive
              dashboard, and task controls that stay understandable on mobile and desktop.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white transition hover:bg-clay/90"
              >
                Start Managing Tasks
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-ink/10 bg-white/80 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              >
                I Already Have an Account
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-butter/60 blur-2xl" />
            <div className="absolute -right-4 bottom-12 h-32 w-32 rounded-full bg-dusk/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-panel backdrop-blur">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-sand p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">Today&apos;s Focus</p>
                    <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold text-clay">
                      High Priority
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-ink">Launch the assignment frontend</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    Wire auth, show dashboard stats, and make task state feel clear at a glance.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'To Do', value: '05', tone: 'bg-butter/30 text-ink' },
                    { label: 'In Progress', value: '03', tone: 'bg-dusk/10 text-dusk' },
                    { label: 'Done', value: '14', tone: 'bg-pine/10 text-pine' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-3xl p-4 ${item.tone}`}>
                      <p className="text-xs uppercase tracking-[0.2em]">{item.label}</p>
                      <p className="mt-4 text-3xl font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
