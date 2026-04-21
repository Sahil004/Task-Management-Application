'use client';

import { DashboardData, User } from '@/lib/types';

export function DashboardShell({
  user,
  dashboard,
  loading,
  mobilePanel,
  filters,
  onFilterChange,
  onLogout,
  children,
}: {
  user: User | null;
  dashboard: DashboardData | null;
  loading: boolean;
  mobilePanel: 'compose' | 'board';
  filters: {
    statusFilter: string;
    priorityFilter: string;
    sortBy: 'createdAt' | 'dueDate';
    order: 'asc' | 'desc';
  };
  onFilterChange: {
    setStatusFilter: (value: string) => void;
    setPriorityFilter: (value: string) => void;
    setSortBy: (value: 'createdAt' | 'dueDate') => void;
    setOrder: (value: 'asc' | 'desc') => void;
    setMobilePanel: (value: 'compose' | 'board') => void;
  };
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const cards = [
    { label: 'Total', value: dashboard?.stats.total ?? 0, tone: 'bg-white text-ink' },
    { label: 'To Do', value: dashboard?.stats.todo ?? 0, tone: 'bg-butter/25 text-ink' },
    { label: 'In Progress', value: dashboard?.stats.inProgress ?? 0, tone: 'bg-dusk/10 text-dusk' },
    { label: 'Done', value: dashboard?.stats.done ?? 0, tone: 'bg-pine/10 text-pine' },
    { label: 'Overdue', value: dashboard?.stats.overdue ?? 0, tone: 'bg-clay/15 text-clay' },
  ];
  const backlogRatio =
    dashboard && dashboard.stats.total > 0
      ? Math.round(((dashboard.stats.todo + dashboard.stats.inProgress) / dashboard.stats.total) * 100)
      : 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-panel backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 border-b border-ink/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Your TaskFlow workspace'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/65">
              Review your task health, filter your workload, and manage details without losing context.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-ink/10 bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:bg-sand"
          >
            Logout
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[1.5rem] border border-ink/10 bg-white px-4 py-3 lg:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-clay">Mobile Workspace</p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {mobilePanel === 'board' ? 'Browsing the board' : 'Composing task details'}
            </p>
          </div>
          <div className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/65">
            {dashboard?.stats.total ?? 0} total
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {cards.map((card) => (
            <div key={card.label} className={`rounded-3xl border border-ink/5 p-4 ${card.tone}`}>
              <p className="text-xs uppercase tracking-[0.2em]">{card.label}</p>
              <p className="mt-4 text-3xl font-semibold">{loading ? '--' : card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-ink/10 bg-ink p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-butter">Workload Pulse</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {loading ? 'Refreshing...' : `${backlogRatio}% of your tasks still need attention`}
                </h2>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
                {dashboard?.stats.highPriority ?? 0} high-priority open
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-butter transition-all duration-500"
                style={{ width: `${backlogRatio}%` }}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-ink/10 bg-sand/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Recent Tasks</p>
            <div className="mt-4 space-y-3">
              {(dashboard?.recentTasks ?? []).slice(0, 3).map((task) => (
                <div key={task._id} className="rounded-3xl bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">{task.title}</p>
                      <p className="mt-1 text-xs text-ink/55">{task.status.replace('-', ' ')}</p>
                    </div>
                    <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/65">
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
              {!loading && (dashboard?.recentTasks?.length ?? 0) === 0 && (
                <div className="rounded-3xl border border-dashed border-ink/10 px-4 py-6 text-sm text-ink/50">
                  No recent activity yet. Add your first task to start shaping the board.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex rounded-full bg-ink p-1 lg:hidden">
          <button
            type="button"
            onClick={() => onFilterChange.setMobilePanel('board')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mobilePanel === 'board' ? 'bg-white text-ink' : 'text-white/75'
            }`}
          >
            Board
          </button>
          <button
            type="button"
            onClick={() => onFilterChange.setMobilePanel('compose')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mobilePanel === 'compose' ? 'bg-white text-ink' : 'text-white/75'
            }`}
          >
            {filters.statusFilter || filters.priorityFilter ? 'Compose + Filters' : 'Compose'}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-ink/10 bg-sand/60 p-4 lg:flex-row lg:items-center">
          <select
            value={filters.statusFilter}
            onChange={(event) => onFilterChange.setStatusFilter(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none lg:min-w-[11rem]"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filters.priorityFilter}
            onChange={(event) => onFilterChange.setPriorityFilter(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none lg:min-w-[11rem]"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(event) => onFilterChange.setSortBy(event.target.value as 'createdAt' | 'dueDate')}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none lg:min-w-[12rem]"
          >
            <option value="createdAt">Sort by Created Date</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
          <select
            value={filters.order}
            onChange={(event) => onFilterChange.setOrder(event.target.value as 'asc' | 'desc')}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none lg:min-w-[10rem]"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <button
            type="button"
            onClick={() => {
              onFilterChange.setStatusFilter('');
              onFilterChange.setPriorityFilter('');
              onFilterChange.setSortBy('createdAt');
              onFilterChange.setOrder('desc');
            }}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink/70 transition hover:bg-white/80 lg:ml-auto"
          >
            Reset Filters
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
