'use client';

import clsx from 'clsx';

import { Task } from '@/lib/types';

const statusLabels: Record<Task['status'], string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const priorityTone: Record<Task['priority'], string> = {
  low: 'bg-pine/10 text-pine',
  medium: 'bg-butter/35 text-ink',
  high: 'bg-clay/15 text-clay',
};

export function TaskBoard({
  tasks,
  loading,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  loading: boolean;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}) {
  const grouped = {
    todo: tasks.filter((task) => task.status === 'todo'),
    'in-progress': tasks.filter((task) => task.status === 'in-progress'),
    done: tasks.filter((task) => task.status === 'done'),
  };

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {(Object.keys(grouped) as Array<keyof typeof grouped>).map((status) => (
        <section key={status} className="rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">{statusLabels[status]}</h3>
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/65">
              {grouped[status].length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-ink/10 px-4 py-8 text-center text-sm text-ink/50">
                Loading tasks...
              </div>
            ) : grouped[status].length === 0 ? (
              <div className="rounded-3xl border border-dashed border-ink/10 px-4 py-8 text-center text-sm text-ink/50">
                No tasks in this column yet.
              </div>
            ) : (
              grouped[status].map((task) => (
                <article key={task._id} className="rounded-3xl bg-sand/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-ink">{task.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-ink/65">
                        {task.description || 'No description added yet.'}
                      </p>
                    </div>
                    <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', priorityTone[task.priority])}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-ink/55">
                      {task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                    </div>
                    {task.isOverdue && <span className="text-xs font-semibold text-clay">Overdue</span>}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(task._id)}
                      className="flex-1 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white/80"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(task._id)}
                      className="flex-1 rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
