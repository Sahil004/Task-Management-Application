import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <main
      className="relative overflow-hidden min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(110,115,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(62,207,184,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,110,156,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 lg:px-10">
        {/* navbar */}
        <header className="flex items-center justify-between mb-20">
          <Logo />
          <nav className="flex items-center gap-3">
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
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #6e73ff, #3ecfb8)",
                boxShadow: "0 0 20px rgba(110,115,255,0.3)",
              }}
            >
              Get Started
            </Link>
          </nav>
        </header>

        {/* hero */}
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center py-8">
          <div className="animate-fade-up">
            {/* badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium"
              style={{
                border: "1px solid rgba(110,115,255,0.3)",
                background: "rgba(110,115,255,0.08)",
                color: "#6e73ff",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6e73ff] animate-pulse-soft" />
              JWT Auth · CRUD · Dashboard · Redux
            </div>

            <h1
              className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              style={{ color: "var(--fg)" }}
            >
              Plan the work.{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6e73ff 0%, #3ecfb8 50%, #ff6e9c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ship with calm.
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--fg-2)" }}
            >
              A focused task management system with JWT authentication, priority
              tracking, real-time status updates, and a clean dashboard built
              for daily use.
            </p>

            {/* tech pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {[
                "Next.js 15",
                "Redux Toolkit",
                "Tailwind CSS",
                "Node.js",
                "PostgreSQL",
                "JWT Auth",
              ].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    border: "1px solid var(--border-2)",
                    color: "var(--fg-2)",
                    background: "var(--bg-card)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #6e73ff, #3ecfb8)",
                  boxShadow: "0 0 24px rgba(110,115,255,0.35)",
                }}
              >
                Start Managing Tasks
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200"
                style={{
                  border: "1px solid var(--border-2)",
                  color: "var(--fg-2)",
                  background: "var(--bg-card)",
                }}
              >
                I have an account
              </Link>
            </div>
          </div>

          {/* preview card */}
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div
              className="absolute -top-8 -left-8 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(110,115,255,0.15) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(62,207,184,0.12) 0%, transparent 70%)",
              }}
            />

            <div
              className="relative rounded-2xl p-5"
              style={{
                border: "1px solid var(--border-2)",
                background: "var(--bg-card)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
              }}
            >
              {/* header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p
                    className="text-xs font-medium mb-0.5"
                    style={{ color: "var(--fg-3)" }}
                  >
                    Today&apos;s focus
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--fg)" }}
                  >
                    Launch the assignment
                  </p>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                  style={{
                    background: "rgba(255,110,156,0.12)",
                    color: "#ff6e9c",
                    border: "0.5px solid rgba(255,110,156,0.3)",
                  }}
                >
                  High
                </span>
              </div>

              {/* stat row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {
                    label: "To Do",
                    value: "05",
                    color: "#6e73ff",
                    bg: "rgba(110,115,255,0.08)",
                  },
                  {
                    label: "In Progress",
                    value: "03",
                    color: "#3ecfb8",
                    bg: "rgba(62,207,184,0.08)",
                  },
                  {
                    label: "Done",
                    value: "14",
                    color: "#ff6e9c",
                    bg: "rgba(255,110,156,0.08)",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: s.bg }}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="text-[10px] mt-0.5 font-medium"
                      style={{ color: "var(--fg-3)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* task list preview */}
              <div className="flex flex-col gap-2">
                {[
                  {
                    title: "Set up JWT authentication",
                    status: "Done",
                    priority: "High",
                    pc: "#ff6e9c",
                    sc: "#3ecfb8",
                  },
                  {
                    title: "Build task CRUD API",
                    status: "In Progress",
                    priority: "High",
                    pc: "#ff6e9c",
                    sc: "#6e73ff",
                  },
                  {
                    title: "Design dashboard UI",
                    status: "To Do",
                    priority: "Medium",
                    pc: "#6e73ff",
                    sc: "var(--fg-3)",
                  },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{
                      background:
                        i === 1 ? "rgba(110,115,255,0.05)" : "transparent",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                      style={{
                        border: `1.5px solid ${t.sc}`,
                        background: t.status === "Done" ? t.sc : "transparent",
                      }}
                    >
                      {t.status === "Done" && (
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
                      className="flex-1 text-xs font-medium truncate"
                      style={{
                        color:
                          t.status === "Done" ? "var(--fg-3)" : "var(--fg)",
                        textDecoration:
                          t.status === "Done" ? "line-through" : "none",
                      }}
                    >
                      {t.title}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ color: t.pc, background: `${t.pc}18` }}
                    >
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>

              {/* accent bar */}
              <div
                className="mt-4 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, #6e73ff, #3ecfb8, #ff6e9c)",
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
