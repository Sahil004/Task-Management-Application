"use client";

import clsx from "clsx";
import { useState } from "react";
import { Task } from "@/lib/types";
import { CircleAlert, CircleCheckBig, Loader } from "lucide-react";
import { TASK_PRIORITY_META, TASK_STATUS_LABELS } from "@/lib/task-options";
import { SurfaceCard } from "@/components/ui/surface-card";

const STATUS_META: Record<
  Task["status"],
  { color: string; bg: string; border: string }
> = {
  todo: { color: "var(--fg-2)", bg: "var(--bg)", border: "var(--border)" },
  "in-progress": {
    color: "#6e73ff",
    bg: "rgba(110,115,255,0.08)",
    border: "rgba(110,115,255,0.2)",
  },
  done: {
    color: "#3ecfb8",
    bg: "rgba(62,207,184,0.08)",
    border: "rgba(62,207,184,0.2)",
  },
};

function EmptyCol({ status }: { status: Task["status"] }) {
  const msgs: Record<Task["status"], string> = {
    todo: "Create a task to start shaping your board.",
    "in-progress": "Update a task status to show active work here.",
    done: "Completed tasks will appear here as you finish them.",
  };
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center rounded-2xl"
      style={{ border: "1px dashed var(--border-2)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: STATUS_META[status].bg,
          color: STATUS_META[status].color,
        }}
      >
        {status === "todo" ? (
          <CircleAlert size={14} />
        ) : status === "in-progress" ? (
          <Loader size={14} />
        ) : (
          <CircleCheckBig size={14} />
        )}
      </div>
      <p className="text-xs font-medium mb-1" style={{ color: "var(--fg-2)" }}>
        Nothing in {TASK_STATUS_LABELS[status]} yet
      </p>
      <p className="text-xs max-w-[160px]" style={{ color: "var(--fg-3)" }}>
        {msgs[status]}
      </p>
    </div>
  );
}

function TaskCard({
  task,
  dragging,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
}: {
  task: Task;
  dragging: boolean;
  isDragging: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, beforeId: string) => void;
}) {
  const pm = TASK_PRIORITY_META[task.priority];
  const isDone = task.status === "done";

  return (
    <SurfaceCard
      as="article"
      draggable={!dragging}
      onDragStart={(e) => onDragStart(e, task._id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task._id)}
      className={clsx(
        "group cursor-grab p-4 transition-all duration-200 active:cursor-grabbing",
        isDragging && "scale-95 opacity-40",
      )}
    >
      {/* priority dot + title */}
      <div className="flex items-start gap-2.5 mb-3">
        <div
          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ background: pm.color, boxShadow: `0 0 6px ${pm.color}80` }}
        />
        <p
          className="text-sm font-medium leading-snug flex-1"
          style={{
            color: isDone ? "var(--fg-3)" : "var(--fg)",
            textDecoration: isDone ? "line-through" : "none",
          }}
        >
          {task.title}
        </p>
      </div>

      {/* description */}
      {task.description && (
        <p
          className="text-xs leading-relaxed mb-3 pl-4"
          style={{ color: "var(--fg-3)" }}
        >
          {task.description}
        </p>
      )}

      {/* meta row */}
      <div className="flex items-center justify-between gap-2 pl-4 mb-3">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            color: pm.color,
            background: pm.bg,
            border: `0.5px solid ${pm.color}40`,
          }}
        >
          {task.priority}
        </span>
        <div className="flex items-center gap-2">
          {task.isOverdue && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ color: "#ff6e9c", background: "rgba(255,110,156,0.1)" }}
            >
              ⚠ overdue
            </span>
          )}
          {task.dueDate && (
            <span
              className="text-[10px] font-mono"
              style={{ color: "var(--fg-3)" }}
            >
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-2 pl-4">
        <button
          disabled={dragging}
          onClick={() => onEdit(task._id)}
          className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
          style={{
            border: "1px solid var(--border-2)",
            color: "var(--fg-2)",
            background: "var(--bg)",
          }}
        >
          Edit
        </button>
        <button
          disabled={dragging}
          onClick={() => onDelete(task._id)}
          className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
          style={{
            color: "#ff6e9c",
            background: "rgba(255,110,156,0.08)",
            border: "0.5px solid rgba(255,110,156,0.25)",
          }}
        >
          Delete
        </button>
      </div>

      {/* drag hint */}
      <p
        className="text-[10px] mt-2.5 pl-4 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--fg-3)" }}
      >
        ⠿ drag to move
      </p>
    </SurfaceCard>
  );
}

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
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (
    taskId: string,
    nextStatus: Task["status"],
    beforeTaskId?: string,
  ) => void | Promise<void>;
}) {
  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<Task["status"] | null>(null);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {(Object.keys(grouped) as Task["status"][]).map((status) => {
        const meta = STATUS_META[status];
        const isActive = activeColumn === status;

        return (
          <section
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setActiveColumn(status);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/task-id");
              if (id) void onReorder(id, status);
              setDraggingId(null);
              setActiveColumn(null);
            }}
            onDragLeave={() => {
              if (activeColumn === status) setActiveColumn(null);
            }}
            className="rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 min-h-[200px]"
            style={{
              border: `1px solid ${isActive ? meta.color + "60" : "var(--border)"}`,
              background: isActive ? meta.bg : "var(--bg-card)",
            }}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: meta.color }}
                />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--fg)" }}
                >
                  {TASK_STATUS_LABELS[status]}
                </h3>
              </div>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ color: meta.color, background: meta.bg }}
              >
                {grouped[status].length}
              </span>
            </div>

            {/* Tasks */}
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl animate-pulse"
                  style={{ background: "var(--bg)" }}
                />
              ))
            ) : grouped[status].length === 0 ? (
              <EmptyCol status={status} />
            ) : (
              grouped[status].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  dragging={dragging}
                  isDragging={draggingId === task._id}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={(e, id) => {
                    e.dataTransfer.setData("text/task-id", id);
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingId(id);
                    setActiveColumn(task.status);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setActiveColumn(null);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e, beforeId) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/task-id");
                    if (id && id !== task._id)
                      void onReorder(id, status, beforeId);
                    setDraggingId(null);
                    setActiveColumn(null);
                  }}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
