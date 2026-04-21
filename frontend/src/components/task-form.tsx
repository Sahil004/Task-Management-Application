'use client';

import { FormEvent, useEffect, useState } from 'react';

import { TaskFormValues } from '@/lib/types';

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
};

export function TaskForm({
  initialValues,
  loading,
  mode,
  error,
  onCancel,
  onSubmit,
}: {
  initialValues?: TaskFormValues;
  loading: boolean;
  mode: 'create' | 'edit';
  error: string | null;
  onCancel?: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<TaskFormValues>(initialValues ?? defaultValues);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setValues(initialValues ?? defaultValues);
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!values.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    await onSubmit(values);

    if (mode === 'create') {
      setValues(defaultValues);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">
            {mode === 'create' ? 'Create Task' : 'Edit Task'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {mode === 'create' ? 'Add a fresh task' : 'Update task details'}
          </h2>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-semibold text-ink/55">
            Cancel
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {mode === 'create' && !loading && (
          <div className="rounded-3xl border border-dashed border-clay/20 bg-clay/5 px-4 py-4 text-sm leading-6 text-ink/65">
            Tip: start with a concise title, give high-priority items a due date, and use status to
            keep the board readable in screenshots and daily use.
          </div>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Title</span>
          <input
            type="text"
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3 outline-none focus:border-dusk"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Description</span>
          <textarea
            rows={4}
            value={values.description}
            onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
            className="w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3 outline-none focus:border-dusk"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">Priority</span>
            <select
              value={values.priority}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  priority: event.target.value as TaskFormValues['priority'],
                }))
              }
              className="w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3 outline-none focus:border-dusk"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">Status</span>
            <select
              value={values.status}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  status: event.target.value as TaskFormValues['status'],
                }))
              }
              className="w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3 outline-none focus:border-dusk"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">Due Date</span>
            <input
              type="date"
              value={values.dueDate}
              onChange={(event) => setValues((current) => ({ ...current, dueDate: event.target.value }))}
              className="w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3 outline-none focus:border-dusk"
            />
          </label>
        </div>

        {(formError || error) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError || error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
