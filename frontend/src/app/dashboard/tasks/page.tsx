"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthRedirect } from "@/components/auth-redirect";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { DashboardShell } from "@/components/dashboard-shell";
import { TaskBoard } from "@/components/task-board";
import { TaskForm } from "@/components/task-form";
import { TaskFilterSelect } from "@/components/task-filter-select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast-provider";
import { GradientCtaButton } from "@/components/ui/gradient-cta-button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { restoreAuth, selectAuth } from "@/lib/store/auth-slice";
import {
  clearTasks,
  createTask,
  deleteTask,
  fetchDashboard,
  fetchTasks,
  reorderTasks,
  selectTasks,
  updateTask,
} from "@/lib/store/tasks-slice";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/lib/task-options";
import { Task, TaskFormValues } from "@/lib/types";
import { SelectOption } from "@/components/ui/custom-select";
import { Plus, X } from "lucide-react";

export default function TasksPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const taskState = useAppSelector(selectTasks);
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.hydrated) return;
    if (!auth.token) {
      router.replace("/login");
      dispatch(clearTasks());
      return;
    }
    void dispatch(fetchDashboard());
  }, [auth.hydrated, auth.token, dispatch, router]);

  useEffect(() => {
    if (!auth.token) return;
    void dispatch(
      fetchTasks({
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        order,
      }),
    );
  }, [auth.token, dispatch, order, priorityFilter, sortBy, statusFilter]);

  const editingTask = useMemo(
    () => taskState.items.find((t) => t._id === editingTaskId) ?? null,
    [editingTaskId, taskState.items],
  );

  const handleSubmit = async (values: TaskFormValues) => {
    if (editingTaskId) {
      await dispatch(updateTask({ id: editingTaskId, values })).unwrap();
      await Promise.all([
        dispatch(
          fetchTasks({
            status: statusFilter,
            priority: priorityFilter,
            sortBy,
            order,
          }),
        ),
        dispatch(fetchDashboard()),
      ]);
      showToast({
        tone: "success",
        title: "Task updated",
        description: "Your changes were saved.",
      });
      setEditingTaskId(null);
      setShowForm(false);
      return;
    }
    await dispatch(createTask(values)).unwrap();
    await Promise.all([
      dispatch(
        fetchTasks({
          status: statusFilter,
          priority: priorityFilter,
          sortBy,
          order,
        }),
      ),
      dispatch(fetchDashboard()),
    ]);
    showToast({
      tone: "success",
      title: "Task created",
      description: "A new task was added to your board.",
    });
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await dispatch(deleteTask(deleteTargetId)).unwrap();
    await Promise.all([
      dispatch(
        fetchTasks({
          status: statusFilter,
          priority: priorityFilter,
          sortBy,
          order,
        }),
      ),
      dispatch(fetchDashboard()),
    ]);
    showToast({
      tone: "info",
      title: "Task deleted",
      description: "The task was removed from your board.",
    });
    setDeleteTargetId(null);
  };

  const handleReorder = async (
    taskId: string,
    nextStatus: Task["status"],
    beforeTaskId?: string,
  ) => {
    const dragged = taskState.items.find((t) => t._id === taskId);
    if (!dragged) return;
    const remaining = taskState.items.filter((t) => t._id !== taskId);
    const destTasks = remaining
      .filter((t) => t.status === nextStatus)
      .sort((a, b) => a.position - b.position);
    const insertIndex = beforeTaskId
      ? destTasks.findIndex((t) => t._id === beforeTaskId)
      : destTasks.length;
    const movedTask: Task = { ...dragged, status: nextStatus };
    if (insertIndex >= 0) destTasks.splice(insertIndex, 0, movedTask);
    else destTasks.push(movedTask);
    const byStatus: Record<Task["status"], Task[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    remaining
      .filter((t) => t.status !== nextStatus)
      .forEach((t) => {
        byStatus[t.status].push(t);
      });
    byStatus[nextStatus] = destTasks;
    const normalized = (Object.keys(byStatus) as Task["status"][]).flatMap(
      (s) =>
        byStatus[s]
          .sort((a, b) => a.position - b.position)
          .map((t, i) => ({ ...t, status: s, position: i })),
    );
    await dispatch(
      reorderTasks({
        tasks: normalized.map((t) => ({
          id: t._id,
          status: t.status,
          position: t.position,
        })),
        nextItems: normalized,
      }),
    ).unwrap();
    await dispatch(fetchDashboard());
    showToast({
      tone: "info",
      title: "Board updated",
      description: "Task positions saved.",
    });
  };

  const statusFilterOptions: SelectOption[] = [
    { value: "", label: "All Statuses" },
    ...TASK_STATUS_OPTIONS,
  ];

  const priorityFilterOptions: SelectOption[] = [
    { value: "", label: "All Priorities" },
    ...TASK_PRIORITY_OPTIONS,
  ];

  const sortByOptions: SelectOption[] = [
    { value: "createdAt", label: "Sort: Created" },
    { value: "dueDate", label: "Sort: Due Date" },
  ];

  const orderOptions: SelectOption[] = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
  ];

  return (
    <AuthRedirect mode="protected">
      {!auth.hydrated || !auth.token ? (
        <DashboardSkeleton />
      ) : (
        <DashboardShell user={auth.user}>
          {/* Page header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5 sm:mb-6 animate-fade-up">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "#6e73ff" }}
              >
                Task Board
              </p>
              <h1
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--fg)" }}
              >
                Manage Tasks
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--fg-2)" }}>
                {taskState.items.length} tasks · drag to reorder across columns
              </p>
            </div>
            <GradientCtaButton
              className="text-xs sm:text-sm px-3 py-2 sm:px-4"
              onClick={() => {
                setEditingTaskId(null);
                setShowForm(true);
              }}
              leftIcon={<Plus size={14} />}
            >
              New Task
            </GradientCtaButton>
          </div>

          {/* accent bar */}
          <div
            className="h-0.5 rounded-full mb-5 sm:mb-6"
            style={{
              background:
                "linear-gradient(to right, #6e73ff, #3ecfb8, #ff6e9c)",
            }}
          />

          {/* Filters */}
          <div
            className="flex overflow-x-auto items-center gap-2 sm:gap-3 mb-5 sm:mb-6 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <TaskFilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusFilterOptions}
              placeholder="All Statuses"
            />
            <TaskFilterSelect
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={priorityFilterOptions}
              placeholder="All Priorities"
            />
            <TaskFilterSelect
              value={sortBy}
              onChange={(value) => setSortBy(value as "createdAt" | "dueDate")}
              options={sortByOptions}
              placeholder="Sort"
            />
            <TaskFilterSelect
              value={order}
              onChange={(value) => setOrder(value as "asc" | "desc")}
              options={orderOptions}
              placeholder="Order"
            />
            {(statusFilter || priorityFilter) && (
              <button
                onClick={() => {
                  setStatusFilter("");
                  setPriorityFilter("");
                  setSortBy("createdAt");
                  setOrder("desc");
                }}
                className="px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  border: "1px solid rgba(255,110,156,0.3)",
                  color: "#ff6e9c",
                  background: "rgba(255,110,156,0.08)",
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Board */}
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <TaskBoard
              tasks={taskState.items}
              loading={taskState.loading}
              dragging={taskState.submitting}
              onEdit={(id) => {
                setEditingTaskId(id);
                setShowForm(true);
              }}
              onDelete={(id) => setDeleteTargetId(id)}
              onReorder={handleReorder}
            />
          </div>

          {/* Task form slide-in panel */}
          {showForm && (
            <div
              className="fixed inset-0 z-50 flex justify-end"
              style={{
                paddingTop: "64px",
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowForm(false);
                  setEditingTaskId(null);
                }
              }}
            >
              <div
                className="h-full w-full max-w-md overflow-y-auto animate-fade-up"
                style={{
                  background: "var(--bg)",
                  borderLeft: "1px solid var(--border-2)",
                  padding: "24px 16px",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-1"
                      style={{ color: "#6e73ff" }}
                    >
                      {editingTaskId ? "Edit Task" : "New Task"}
                    </p>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--fg)" }}
                    >
                      {editingTaskId
                        ? "Update task details"
                        : "Add a fresh task"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTaskId(null);
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-2)",
                      color: "var(--fg-2)",
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div
                  className="h-0.5 rounded-full mb-5 sm:mb-6"
                  style={{
                    background:
                      "linear-gradient(to right, #6e73ff, #3ecfb8, #ff6e9c)",
                  }}
                />
                <TaskForm
                  key={editingTaskId ?? "new"}
                  initialValues={
                    editingTask
                      ? {
                          title: editingTask.title,
                          description: editingTask.description,
                          priority: editingTask.priority,
                          status: editingTask.status,
                          dueDate: editingTask.dueDate
                            ? editingTask.dueDate.slice(0, 10)
                            : "",
                        }
                      : undefined
                  }
                  loading={taskState.submitting}
                  mode={editingTask ? "edit" : "create"}
                  error={taskState.error}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTaskId(null);
                  }}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}

          <ConfirmDialog
            open={Boolean(deleteTargetId)}
            title="Delete task?"
            description="This removes the task from your board and dashboard. This action cannot be undone."
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
