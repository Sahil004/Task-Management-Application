"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LayoutGrid, LogOut, SquareCheckBig } from "lucide-react";

const NAV = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutGrid size={14} />,
  },
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: <SquareCheckBig size={14} />,
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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <Logo />

        {/* Divider */}
        <div
          className="w-px h-5 shrink-0"
          style={{ background: "var(--border-2)" }}
        />

        {/* Nav links */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={{
                  color: active ? "#6e73ff" : "var(--fg-2)",
                  background: active ? "rgba(110,115,255,0.08)" : "transparent",
                }}
              >
                <span style={{ color: active ? "#6e73ff" : "var(--fg-3)" }}>
                  {item.icon}
                </span>
                <span className="hidden md:inline">{item.label}</span>{" "}
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
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
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
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              border: "1px solid var(--border-2)",
              color: "var(--fg-2)",
              background: "var(--bg-card)",
            }}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
