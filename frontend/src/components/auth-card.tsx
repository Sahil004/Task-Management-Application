import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  alternateLabel,
  alternateHref,
  alternateText,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  alternateLabel: string;
  alternateHref: string;
  alternateText: string;
  children: React.ReactNode;
}) {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 py-6 sm:py-10 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* bg glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(110,115,255,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(62,207,184,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl animate-fade-up">
        <div
          className="grid overflow-hidden rounded-2xl lg:grid-cols-[0.95fr_1.05fr] w-full"
          style={{
            border: "1px solid var(--border-2)",
            background: "var(--bg-card)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
          }}
        >
          {/* left panel */}
          <section
            className="relative hidden overflow-hidden lg:block"
            style={{
              background: "linear-gradient(135deg, #0f0f18 0%, #13131f 100%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at top right, rgba(110,115,255,0.25) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(62,207,184,0.2) 0%, transparent 50%)",
              }}
            />

            {/* accent bar top */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background:
                  "linear-gradient(to right, #6e73ff, #3ecfb8, #ff6e9c)",
              }}
            />

            <div className="relative p-10 py-12 flex flex-col h-full">
              <Logo href="/" />

              <div className="flex-1 flex flex-col justify-center mt-10">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit"
                  style={{
                    background: "rgba(110,115,255,0.15)",
                    color: "#6e73ff",
                    border: "0.5px solid rgba(110,115,255,0.3)",
                  }}
                >
                  {eyebrow}
                </span>
                <h1
                  className="text-3xl font-bold leading-tight mb-4"
                  style={{ color: "#f4f4f6" }}
                >
                  {title}
                </h1>
                <p
                  className="text-sm leading-7"
                  style={{ color: "rgba(244,244,246,0.6)" }}
                >
                  {subtitle}
                </p>
              </div>

              {/* feature list */}
              <div className="mt-auto pt-8 flex flex-col gap-3">
                {[
                  { icon: "⚡", text: "JWT authentication & protected routes" },
                  { icon: "✦", text: "Full task CRUD with priority & status" },
                  { icon: "◈", text: "Dashboard with real-time statistics" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm" style={{ color: "#6e73ff" }}>
                      {f.icon}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(244,244,246,0.5)" }}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* right panel - form */}
          <section
            className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 flex-wrap">
              {" "}
              <div className="lg:hidden">
                <Logo href="/" size={32} />
              </div>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <div className="hidden lg:block" />
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>

                <p
                  className="text-xs sm:text-sm leading-5 sm:leading-normal"
                  style={{ color: "var(--fg-2)" }}
                >
                  {" "}
                  {alternateLabel}{" "}
                  <Link
                    href={alternateHref}
                    className="font-semibold"
                    style={{ color: "#6e73ff" }}
                  >
                    {alternateText}
                  </Link>
                </p>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
