'use client';

import { DashboardData, User } from '@/lib/types';

export function DashboardShell({
  user,
  dashboard,
  loading,
  filters,
  onFilterChange,
  onLogout,
  children,
}: {
  user: User | null;
  dashboard: DashboardData | null;
  loading: boolean;
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

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {cards.map((card) => (
            <div key={card.label} className={`rounded-3xl border border-ink/5 p-4 ${card.tone}`}>
              <p className="text-xs uppercase tracking-[0.2em]">{card.label}</p>
              <p className="mt-4 text-3xl font-semibold">{loading ? '--' : card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-ink/10 bg-sand/60 p-4 lg:flex-row lg:items-center">
          <select
            value={filters.statusFilter}
            onChange={(event) => onFilterChange.setStatusFilter(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filters.priorityFilter}
            onChange={(event) => onFilterChange.setPriorityFilter(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(event) => onFilterChange.setSortBy(event.target.value as 'createdAt' | 'dueDate')}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none"
          >
            <option value="createdAt">Sort by Created Date</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
          <select
            value={filters.order}
            onChange={(event) => onFilterChange.setOrder(event.target.value as 'asc' | 'desc')}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
