"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export function Navbar({
  userName,
  onLogout,
}: {
  userName?: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-30 h-16 flex items-center"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 flex items-center gap-6">
        {/* Logo */}
        <Logo />

        {/* Divider */}
        <div
          className="w-px h-5 shrink-0"
          style={{ background: "var(--border-2)" }}
        />

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: active ? "#6e73ff" : "var(--fg-2)",
                  background: active ? "rgba(110,115,255,0.08)" : "transparent",
                }}
              >
                <span style={{ color: active ? "#6e73ff" : "var(--fg-3)" }}>
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: "#6e73ff" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* User pill */}
          {userName && (
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--fg-2)",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #6e73ff, #3ecfb8)",
                }}
              >
                {userName[0].toUpperCase()}
              </div>
              {userName}
            </div>
          )}

          <ThemeToggle />

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              border: "1px solid var(--border-2)",
              color: "var(--fg-2)",
              background: "var(--bg-card)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
