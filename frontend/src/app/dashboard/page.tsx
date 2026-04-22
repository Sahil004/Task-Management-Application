"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthRedirect } from "@/components/auth-redirect";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import {
  gradientCtaClassName,
  gradientCtaStyle,
} from "@/components/ui/gradient-cta-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { restoreAuth, selectAuth } from "@/lib/store/auth-slice";
import { fetchDashboard, selectTasks } from "@/lib/store/tasks-slice";
import {
  TASK_PRIORITY_META,
  TASK_STATUS_LABELS,
} from "@/lib/task-options";
import {
  CircleAlert,
  CircleCheckBig,
  Clock,
  Loader,
  Plus,
  SquareCheckBig,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { dashboard, loading } = useAppSelector(selectTasks);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.hydrated) return;
    if (!auth.token) {
      router.replace("/login");
      return;
    }
    void dispatch(fetchDashboard());
  }, [auth.hydrated, auth.token, dispatch, router]);

  const stats = dashboard?.stats;
  const total = stats?.total ?? 0;
  const todo = stats?.todo ?? 0;
  const inProg = stats?.inProgress ?? 0;
  const done = stats?.done ?? 0;
  const overdue = stats?.overdue ?? 0;
  const highPri = stats?.highPriority ?? 0;
  const doneRatio = total > 0 ? Math.round((done / total) * 100) : 0;
  const backlog = total > 0 ? Math.round(((todo + inProg) / total) * 100) : 0;

  const firstName = auth.user?.name?.split(" ")[0] ?? "there";

  return (
    <AuthRedirect mode="protected">
      {!auth.hydrated || !auth.token ? (
        <DashboardSkeleton />
      ) : (
        <DashboardShell user={auth.user}>
          {/* Page header */}
          <div className="flex items-start justify-between mb-8 animate-fade-up">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "#6e73ff" }}
              >
                Overview
              </p>
              <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--fg-2)" }}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Link
              href="/dashboard/tasks"
              className={gradientCtaClassName}
              style={gradientCtaStyle}
            >
              <Plus size={14} />
              New Task
            </Link>
          </div>

          {/* accent bar */}
          <div
            className="h-0.5 rounded-full mb-8"
            style={{
              background:
                "linear-gradient(to right, #6e73ff, #3ecfb8, #ff6e9c)",
            }}
          />

          {/* Stat cards */}
          <div
            className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <DashboardStatCard
              label="Total"
              value={total}
              color="#6e73ff"
              bg="rgba(110,115,255,0.1)"
              loading={loading}
              icon={<SquareCheckBig size={14} />}
            />
            <DashboardStatCard
              label="To Do"
              value={todo}
              color="var(--fg-2)"
              bg="var(--bg)"
              loading={loading}
              icon={<CircleAlert size={14} />}
            />
            <DashboardStatCard
              label="In Progress"
              value={inProg}
              color="#6e73ff"
              bg="rgba(110,115,255,0.1)"
              loading={loading}
              icon={<Loader size={14} />}
            />
            <DashboardStatCard
              label="Done"
              value={done}
              color="#3ecfb8"
              bg="rgba(62,207,184,0.1)"
              loading={loading}
              icon={<CircleCheckBig size={14} />}
            />
            <DashboardStatCard
              label="Overdue"
              value={overdue}
              color="#ff6e9c"
              bg="rgba(255,110,156,0.1)"
              loading={loading}
              icon={<Clock size={14} />}
            />
          </div>

          {/* Progress + Workload row */}
          <div
            className="grid lg:grid-cols-2 gap-4 mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Progress card */}
            <SurfaceCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p
                    className="text-xs font-medium mb-0.5"
                    style={{ color: "var(--fg-3)" }}
                  >
                    Overall completion
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#3ecfb8" }}
                  >
                    {doneRatio}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--fg-3)" }}>
                    Remaining
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--fg)" }}
                  >
                    {todo + inProg} tasks
                  </p>
                </div>
              </div>
              <div
                className="h-2.5 rounded-full overflow-hidden mb-3"
                style={{ background: "var(--bg)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${doneRatio}%`,
                    background: "linear-gradient(to right, #6e73ff, #3ecfb8)",
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                {(
                  [
                    ["To Do", todo, "#6e73ff"],
                    ["In Progress", inProg, "#3ecfb8"],
                    ["Done", done, "#ff6e9c"],
                  ] as [string, number, string][]
                ).map(([l, v, c]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: c }}
                    />
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--fg-3)" }}
                    >
                      {l}: {v}
                    </span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            {/* Workload pulse */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "#0f0f18",
                border: "1px solid rgba(110,115,255,0.2)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "#6e73ff" }}
              >
                Workload pulse
              </p>
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "#f4f4f6" }}
              >
                {loading ? "..." : `${backlog}% of tasks still need attention`}
              </h2>
              <div
                className="h-2.5 overflow-hidden rounded-full mb-3"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${backlog}%`,
                    background: "linear-gradient(to right, #6e73ff, #ff6e9c)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs"
                  style={{ color: "rgba(244,244,246,0.5)" }}
                >
                  {highPri} high-priority open
                </span>
                <Link
                  href="/dashboard/tasks"
                  className="text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "#6e73ff" }}
                >
                  View board →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent tasks */}
          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--fg)" }}
              >
                Recent tasks
              </h2>
              <Link
                href="/dashboard/tasks"
                className="text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: "#6e73ff" }}
              >
                View all →
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl animate-pulse"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                ))
              ) : (dashboard?.recentTasks ?? []).length === 0 ? (
                <div
                  className="py-12 text-center rounded-2xl"
                  style={{ border: "1px dashed var(--border-2)" }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--fg-2)" }}
                  >
                    No tasks yet
                  </p>
                  <p className="text-xs mb-4" style={{ color: "var(--fg-3)" }}>
                    Create your first task to get started
                  </p>
                  <Link
                    href="/dashboard/tasks"
                    className={`${gradientCtaClassName} px-4 py-2 text-xs`}
                    style={gradientCtaStyle}
                  >
                    Add task
                  </Link>
                </div>
              ) : (
                (dashboard?.recentTasks ?? []).slice(0, 5).map((task, i) => {
                  const STATUS_COLOR: Record<string, string> = {
                    todo: "var(--fg-3)",
                    "in-progress": "#6e73ff",
                    done: "#3ecfb8",
                  };
                  const priorityMeta = TASK_PRIORITY_META[task.priority];
                  const pc = priorityMeta?.color ?? "#6e73ff";
                  const sc = STATUS_COLOR[task.status] ?? "var(--fg-3)";
                  return (
                    <SurfaceCard
                      key={task._id}
                      className="flex items-center gap-3 p-4 transition-all duration-200 hover:scale-[1.005] animate-fade-up"
                      style={{
                        animationDelay: `${0.15 + i * 0.04}s`,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: pc, boxShadow: `0 0 6px ${pc}80` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{
                            color:
                              task.status === "done"
                                ? "var(--fg-3)"
                                : "var(--fg)",
                            textDecoration:
                              task.status === "done" ? "line-through" : "none",
                          }}
                        >
                          {task.title}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                        style={{ color: sc, background: `${sc}18` }}
                      >
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                        style={{
                          color: pc,
                          background: `${pc}14`,
                          border: `0.5px solid ${pc}40`,
                        }}
                      >
                        {task.priority}
                      </span>
                    </SurfaceCard>
                  );
                })
              )}
            </div>
          </div>
        </DashboardShell>
      )}
    </AuthRedirect>
  );
}
