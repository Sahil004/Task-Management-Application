'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AuthRedirect } from '@/components/auth-redirect';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { DashboardShell } from '@/components/dashboard-shell';
import { TaskBoard } from '@/components/task-board';
import { TaskForm } from '@/components/task-form';
import { useToast } from '@/components/toast-provider';
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
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [mobilePanel, setMobilePanel] = useState<'compose' | 'board'>('board');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
      showToast({
        tone: 'success',
        title: 'Task updated',
        description: 'Your changes were saved to the board.',
      });
      setMobilePanel('board');
      setEditingTaskId(null);
      return;
    }

    await dispatch(createTask(values)).unwrap();
    await Promise.all([
      dispatch(fetchTasks({ status: statusFilter, priority: priorityFilter, sortBy, order })),
      dispatch(fetchDashboard()),
    ]);
    showToast({
      tone: 'success',
      title: 'Task created',
      description: 'A new task was added to your workflow.',
    });
    setMobilePanel('board');
  };

  const handleDelete = async () => {
    if (!deleteTargetId) {
      return;
    }

    await dispatch(deleteTask(deleteTargetId)).unwrap();
    await Promise.all([
      dispatch(fetchTasks({ status: statusFilter, priority: priorityFilter, sortBy, order })),
      dispatch(fetchDashboard()),
    ]);
    showToast({
      tone: 'info',
      title: 'Task deleted',
      description: 'The task was removed from your workspace.',
    });
    setDeleteTargetId(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    showToast({
      tone: 'info',
      title: 'Signed out',
      description: 'Your session has been cleared on this device.',
    });
    router.replace('/login');
  };

  return (
    <AuthRedirect mode="protected">
      {!auth.hydrated || !auth.token ? (
        <DashboardSkeleton />
      ) : (
        <DashboardShell
          user={auth.user}
          dashboard={taskState.dashboard}
          loading={taskState.loading}
          mobilePanel={mobilePanel}
          filters={{ statusFilter, priorityFilter, sortBy, order }}
          onFilterChange={{ setStatusFilter, setPriorityFilter, setSortBy, setOrder, setMobilePanel }}
          onLogout={handleLogout}
        >
          <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
            <div className={mobilePanel === 'board' ? 'hidden lg:block' : 'block'}>
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
                onCancel={
                  editingTask
                    ? () => {
                        setEditingTaskId(null);
                        setMobilePanel('board');
                      }
                    : undefined
                }
                onSubmit={handleSubmit}
              />
            </div>

            <div className={mobilePanel === 'compose' ? 'hidden lg:block' : 'block'}>
              <TaskBoard
                tasks={taskState.items}
                loading={taskState.loading}
                onEdit={(taskId) => {
                  setEditingTaskId(taskId);
                  setMobilePanel('compose');
                }}
                onDelete={(taskId) => setDeleteTargetId(taskId)}
              />
            </div>
          </div>

          <ConfirmDialog
            open={Boolean(deleteTargetId)}
            title="Delete task?"
            description="This removes the task from your list and dashboard summaries. This action cannot be undone."
            confirmLabel="Delete Task"
            cancelLabel="Keep Task"
            onCancel={() => setDeleteTargetId(null)}
            onConfirm={handleDelete}
          />
        </DashboardShell>
      )}
    </AuthRedirect>
  );
}
