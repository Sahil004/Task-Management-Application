import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const PREVIEW_TASKS = [
  {
    title: "Review design mockups with team",
    priority: "High",
    status: "done",
    pc: "var(--pink)",
    done: true,
  },
  {
    title: "Write API documentation",
    priority: "Medium",
    status: "in-progress",
    pc: "var(--purple)",
    done: false,
  },
  {
    title: "Set up staging environment",
    priority: "High",
    status: "in-progress",
    pc: "var(--pink)",
    done: false,
  },
  {
    title: "Send weekly progress update",
    priority: "Low",
    status: "todo",
    pc: "var(--teal)",
    done: false,
  },
];

export default function HomePage() {
  return (
    <main
      className="relative overflow-hidden min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* bg glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(110,115,255,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(62,207,184,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,110,156,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-5 lg:px-10 lg:py-8">
        {/* ── Navbar ── */}
        <header className="flex items-center justify-between mb-10 sm:mb-16 lg:mb-20">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                border: "1px solid var(--border-2)",
                color: "var(--fg-2)",
                background: "var(--bg-card)",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, var(--purple), var(--teal))",
                boxShadow: "0 0 20px rgba(110,115,255,0.3)",
              }}
            >
              Get started free
            </Link>
          </nav>

          {/* Mobile nav */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                border: "1px solid var(--border-2)",
                color: "var(--fg-2)",
                background: "var(--bg-card)",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, var(--purple), var(--teal))",
                boxShadow: "0 0 16px rgba(110,115,255,0.3)",
              }}
            >
              Get started
            </Link>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center py-2 lg:py-8">
          {/* ── Left copy ── */}
          <div className="animate-fade-up">
            {/* eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 lg:mb-8 text-xs font-medium"
              style={{
                border: "1px solid rgba(110,115,255,0.25)",
                background: "var(--purple-bg)",
                color: "var(--purple)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-soft"
                style={{ background: "var(--purple)" }}
              />
              Free to use · No credit card needed
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-4 lg:mb-6"
              style={{ color: "var(--fg)" }}
            >
              Stop losing track.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--purple) 0%, var(--teal) 50%, var(--pink) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Start shipping more.
              </span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed mb-7 lg:mb-10 max-w-lg"
              style={{ color: "var(--fg-2)" }}
            >
              TaskFlow helps you capture what matters, prioritize ruthlessly,
              and finish the day knowing exactly what got done — and what comes
              next.
            </p>

            {/* social proof */}
            <div className="flex items-center gap-3 mb-7 lg:mb-10">
              <div className="flex -space-x-2">
                {["#6e73ff", "#3ecfb8", "#ff6e9c", "#6e73ff", "#3ecfb8"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white"
                      style={{ borderColor: "var(--bg)", background: c }}
                    >
                      {["S", "A", "M", "R", "K"][i]}
                    </div>
                  ),
                )}
              </div>
              <p className="text-xs" style={{ color: "var(--fg-3)" }}>
                <span
                  className="font-semibold"
                  style={{ color: "var(--fg-2)" }}
                >
                  2,400+
                </span>{" "}
                tasks completed this week
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--purple), var(--teal))",
                  boxShadow: "0 0 28px rgba(110,115,255,0.35)",
                }}
              >
                Start for free
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-sm font-medium transition-all duration-200"
                style={{
                  border: "1px solid var(--border-2)",
                  color: "var(--fg-2)",
                  background: "var(--bg-card)",
                }}
              >
                Already have an account
              </Link>
            </div>
          </div>

          {/* ── Preview card ── */}
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: "0.12s" }}
          >
            {/* decorative glows behind card */}
            <div
              className="absolute -top-10 -left-10 w-40 h-40 lg:w-52 lg:h-52 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(110,115,255,0.14) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-10 -right-10 w-40 h-40 lg:w-52 lg:h-52 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(62,207,184,0.1) 0%, transparent 70%)",
              }}
            />

            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid var(--border-2)",
                background: "var(--bg-card)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.14)",
              }}
            >
              {/* top accent */}
              <div
                className="h-0.5 w-full"
                style={{
                  background:
                    "linear-gradient(to right, var(--purple), var(--teal), var(--pink))",
                }}
              />

              <div className="p-4 sm:p-5">
                {/* mini header */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div>
                    <p
                      className="text-[11px] font-medium mb-0.5"
                      style={{ color: "var(--fg-3)" }}
                    >
                      My workspace
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--fg)" }}
                    >
                      This week
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold"
                    style={{
                      background: "var(--teal-bg)",
                      color: "var(--teal)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--teal)" }}
                    />
                    On track
                  </div>
                </div>

                {/* stat row */}
                <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-5">
                  {[
                    {
                      label: "To Do",
                      value: "4",
                      color: "var(--fg-2)",
                      bg: "var(--bg)",
                    },
                    {
                      label: "In Progress",
                      value: "2",
                      color: "var(--purple)",
                      bg: "var(--purple-bg)",
                    },
                    {
                      label: "Done",
                      value: "11",
                      color: "var(--teal)",
                      bg: "var(--teal-bg)",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-2 sm:p-3 text-center"
                      style={{ background: s.bg }}
                    >
                      <p
                        className="text-xl sm:text-2xl font-bold"
                        style={{ color: s.color }}
                      >
                        {s.value}
                      </p>
                      <p
                        className="text-[9px] sm:text-[10px] mt-0.5"
                        style={{ color: "var(--fg-3)" }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* task rows */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {PREVIEW_TASKS.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl"
                      style={{
                        border: "1px solid var(--border)",
                        background:
                          i === 1 ? "var(--purple-bg)" : "transparent",
                      }}
                    >
                      {/* check circle */}
                      <div
                        className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                        style={{
                          border: `1.5px solid ${t.done ? "var(--teal)" : "var(--border-2)"}`,
                          background: t.done ? "var(--teal)" : "transparent",
                        }}
                      >
                        {t.done && (
                          <svg width="8" height="8" viewBox="0 0 10 10">
                            <path
                              d="M2 5l2.5 2.5 3.5-4"
                              stroke="white"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className="flex-1 text-[11px] sm:text-xs font-medium truncate"
                        style={{
                          color: t.done ? "var(--fg-3)" : "var(--fg)",
                          textDecoration: t.done ? "line-through" : "none",
                        }}
                      >
                        {t.title}
                      </span>
                      <span
                        className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          color: t.pc,
                          background: `${t.pc}18`,
                          border: `0.5px solid ${t.pc}33`,
                        }}
                      >
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>

                {/* progress */}
                <div
                  className="mt-3 sm:mt-4 pt-3 sm:pt-4"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: "var(--fg-3)" }}
                    >
                      Weekly progress
                    </span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "var(--teal)" }}
                    >
                      65%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--bg)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "65%",
                        background:
                          "linear-gradient(to right, var(--purple), var(--teal))",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
