"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { restoreAuth, selectAuth } from "@/lib/store/auth-slice";
import { Logo } from "@/components/logo";

/* ── AuthRedirect ── */
export function AuthRedirect({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "guest-only" | "protected";
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.hydrated) return;
    if (mode === "guest-only" && auth.token) {
      router.replace("/dashboard");
      return;
    }
    if (mode === "protected" && !auth.token) {
      router.replace("/login");
    }
  }, [auth.hydrated, auth.token, mode, router]);

  if (!auth.hydrated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex flex-col items-center gap-4 animate-fade-up">
          <Logo />
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse-soft"
                style={{
                  background:
                    i === 0 ? "#6e73ff" : i === 1 ? "#3ecfb8" : "#ff6e9c",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          <p className="text-xs font-medium" style={{ color: "var(--fg-3)" }}>
            Restoring your session…
          </p>
        </div>
      </div>
    );
  }

  if (mode === "guest-only" && auth.token) return null;
  if (mode === "protected" && !auth.token) return null;
  return <>{children}</>;
}

/* ── DashboardSkeleton ── */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* navbar skeleton */}
      <div
        className="h-16 border-b flex items-center px-6 gap-4"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <div
          className="w-8 h-8 rounded-xl animate-pulse"
          style={{ background: "var(--bg-card)" }}
        />
        <div
          className="w-20 h-4 rounded-full animate-pulse"
          style={{ background: "var(--bg-card)" }}
        />
        <div className="ml-auto flex gap-3">
          <div
            className="w-24 h-8 rounded-xl animate-pulse"
            style={{ background: "var(--bg-card)" }}
          />
          <div
            className="w-10 h-10 rounded-full animate-pulse"
            style={{ background: "var(--bg-card)" }}
          />
        </div>
      </div>
      {/* content skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div
          className="h-8 w-48 rounded-2xl animate-pulse mb-2"
          style={{ background: "var(--bg-card)" }}
        />
        <div
          className="h-4 w-72 rounded-full animate-pulse mb-8"
          style={{ background: "var(--bg-card)" }}
        />
        <div className="grid grid-cols-5 gap-3 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl animate-pulse"
              style={{ background: "var(--bg-card)" }}
            />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div
            className="h-32 rounded-2xl animate-pulse"
            style={{ background: "var(--bg-card)" }}
          />
          <div
            className="h-32 rounded-2xl animate-pulse"
            style={{ background: "var(--bg-card)" }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl animate-pulse"
              style={{ background: "var(--bg-card)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
