'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard-shell';
import { TaskBoard } from '@/components/task-board';
import { TaskForm } from '@/components/task-form';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logoutUser, restoreAuth, selectAuth } from '@/lib/store/auth-slice';
import {
  createTask,
  deleteTask,
  fetchDashboard,
  fetchTasks,
  selectTasks,
  updateTask,
} from '@/lib/store/tasks-slice';
import { TaskFormValues } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const taskState = useAppSelector(selectTasks);

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.hydrated) {
      return;
    }

    if (!auth.token) {
      router.replace('/login');
      return;
    }

    void dispatch(fetchDashboard());
  }, [auth.hydrated, auth.token, dispatch, router]);

  useEffect(() => {
    if (!auth.token) {
      return;
    }

    void dispatch(fetchTasks({ status: statusFilter, priority: priorityFilter, sortBy, order }));
  }, [auth.token, dispatch, order, priorityFilter, sortBy, statusFilter]);

  const editingTask = useMemo(
    () => taskState.items.find((task) => task._id === editingTaskId) ?? null,
    [editingTaskId, taskState.items],
  );

  const handleSubmit = async (values: TaskFormValues) => {
    if (editingTaskId) {
      await dispatch(updateTask({ id: editingTaskId, values })).unwrap();
      await Promise.all([
        dispatch(fetchTasks({ status: statusFilter, priority: priorityFilter, sortBy, order })),
        dispatch(fetchDashboard()),
      ]);
      setEditingTaskId(null);
      return;
    }

    await dispatch(createTask(values)).unwrap();
    await Promise.all([
      dispatch(fetchTasks({ status: statusFilter, priority: priorityFilter, sortBy, order })),
      dispatch(fetchDashboard()),
    ]);
  };

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm('Delete this task? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    await dispatch(deleteTask(taskId)).unwrap();
    await Promise.all([
      dispatch(fetchTasks({ status: statusFilter, priority: priorityFilter, sortBy, order })),
      dispatch(fetchDashboard()),
    ]);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/login');
  };

  if (!auth.hydrated || !auth.token) {
    return null;
  }

  return (
    <DashboardShell
      user={auth.user}
      dashboard={taskState.dashboard}
      loading={taskState.loading}
      filters={{ statusFilter, priorityFilter, sortBy, order }}
      onFilterChange={{ setStatusFilter, setPriorityFilter, setSortBy, setOrder }}
      onLogout={handleLogout}
    >
      <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <TaskForm
          key={editingTaskId ?? 'new-task'}
          initialValues={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description,
                  priority: editingTask.priority,
                  status: editingTask.status,
                  dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
                }
              : undefined
          }
          loading={taskState.submitting}
          mode={editingTask ? 'edit' : 'create'}
          error={taskState.error}
          onCancel={editingTask ? () => setEditingTaskId(null) : undefined}
          onSubmit={handleSubmit}
        />

        <TaskBoard
          tasks={taskState.items}
          loading={taskState.loading}
          onEdit={(taskId) => setEditingTaskId(taskId)}
          onDelete={handleDelete}
        />
      </div>
    </DashboardShell>
  );
}
