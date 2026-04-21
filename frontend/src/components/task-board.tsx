'use client';

import clsx from 'clsx';
import { useState } from 'react';

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
  dragging,
  onEdit,
  onDelete,
  onReorder,
}: {
  tasks: Task[];
  loading: boolean;
  dragging: boolean;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onReorder: (taskId: string, nextStatus: Task['status'], beforeTaskId?: string) => void | Promise<void>;
}) {
  const grouped = {
    todo: tasks.filter((task) => task.status === 'todo'),
    'in-progress': tasks.filter((task) => task.status === 'in-progress'),
    done: tasks.filter((task) => task.status === 'done'),
  };
  const total = tasks.length;
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<Task['status'] | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">Task Board</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {loading ? 'Loading your tasks...' : `${total} tasks in view`}
            </h2>
            <p className="mt-2 text-sm leading-7 text-ink/65">
              Move between columns by editing task status, and use priority badges to scan urgency fast.
            </p>
          </div>
          <div className="rounded-3xl bg-sand px-4 py-3 text-sm text-ink/70">
            <span className="font-semibold text-ink">{grouped['in-progress'].length}</span> currently in progress
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((status) => (
          <section
            key={status}
            onDragOver={(event) => {
              event.preventDefault();
              setActiveColumn(status);
            }}
            onDrop={(event) => {
              event.preventDefault();
              const taskId = event.dataTransfer.getData('text/task-id');
              if (taskId) {
                void onReorder(taskId, status);
              }
              setDraggingTaskId(null);
              setActiveColumn(null);
            }}
            onDragLeave={() => {
              if (activeColumn === status) {
                setActiveColumn(null);
              }
            }}
            className={clsx(
              'rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-sm transition',
              activeColumn === status && 'border-dusk/40 bg-dusk/5',
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">{statusLabels[status]}</h3>
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/65">
                {grouped[status].length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-3xl bg-sand/50 p-4">
                    <div className="animate-pulse">
                      <div className="h-4 w-2/3 rounded-full bg-white" />
                      <div className="mt-3 h-3 w-full rounded-full bg-white/80" />
                      <div className="mt-2 h-3 w-4/5 rounded-full bg-white/80" />
                      <div className="mt-4 flex gap-2">
                        <div className="h-9 flex-1 rounded-2xl bg-white" />
                        <div className="h-9 flex-1 rounded-2xl bg-white" />
                      </div>
                    </div>
                  </div>
                ))
              ) : grouped[status].length === 0 ? (
                <div className="rounded-3xl border border-dashed border-ink/10 px-4 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand text-lg">
                    {status === 'todo' ? 'T' : status === 'in-progress' ? 'P' : 'D'}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-ink">Nothing in {statusLabels[status]} yet</p>
                  <p className="mt-2 text-sm leading-6 text-ink/50">
                    {status === 'todo'
                      ? 'Create a task to start shaping your board.'
                      : status === 'in-progress'
                        ? 'Update a task status to show active work here.'
                        : 'Completed tasks will collect here as you finish them.'}
                  </p>
                </div>
              ) : (
                grouped[status].map((task) => (
                  <article
                    key={task._id}
                    draggable={!dragging}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/task-id', task._id);
                      event.dataTransfer.effectAllowed = 'move';
                      setDraggingTaskId(task._id);
                      setActiveColumn(task.status);
                    }}
                    onDragEnd={() => {
                      setDraggingTaskId(null);
                      setActiveColumn(null);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const taskId = event.dataTransfer.getData('text/task-id');
                      if (taskId && taskId !== task._id) {
                        void onReorder(taskId, status, task._id);
                      }
                      setDraggingTaskId(null);
                      setActiveColumn(null);
                    }}
                    className={clsx(
                      'rounded-3xl bg-sand/60 p-4 transition',
                      draggingTaskId === task._id && 'opacity-50 ring-2 ring-dusk/30',
                    )}
                  >
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
                        disabled={dragging}
                        onClick={() => onEdit(task._id)}
                        className="flex-1 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={dragging}
                        onClick={() => onDelete(task._id)}
                        className="flex-1 rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/35">
                      Drag to reorder or move across columns
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
