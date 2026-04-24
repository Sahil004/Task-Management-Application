"use client";

import clsx from "clsx";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "@/lib/types";
import { TASK_PRIORITY_META } from "@/lib/task-options";
import { SurfaceCard } from "@/components/ui/surface-card";

function TaskCard({
  task,
  dragging,
  onEdit,
  onDelete,
  overlay = false,
}: {
  task: Task;
  dragging: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  overlay?: boolean;
}) {
  const pm = TASK_PRIORITY_META[task.priority];
  const isDone = task.status === "done";

  return (
    <SurfaceCard
      as="article"
      className={clsx(
        "p-3 sm:p-4 transition-colors duration-200 w-[280px] cursor-pointer lg:w-auto",
        overlay && "shadow-2xl",
      )}
    >
      <div className="flex items-start gap-2.5 mb-3">
        <div
          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ background: pm.color, boxShadow: `0 0 6px ${pm.color}80` }}
        />
        <p
          className="text-xs sm:text-sm font-medium leading-snug flex-1 break-words"
          style={{
            color: isDone ? "var(--fg-3)" : "var(--fg)",
            textDecoration: isDone ? "line-through" : "none",
          }}
        >
          {task.title}
        </p>
      </div>

      {task.description && (
        <p
          className="text-[11px] sm:text-xs leading-relaxed mb-3 pl-4 break-words"
          style={{ color: "var(--fg-3)" }}
        >
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pl-4 mb-3">
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

      {!overlay && (
        <div className="flex gap-2 pl-4 flex-wrap">
          <button
            disabled={dragging}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task._id);
            }}
            className="flex-1 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all disabled:opacity-50"
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task._id);
            }}
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
      )}
    </SurfaceCard>
  );
}

export function SortableTaskCard({
  task,
  dragging,
  onEdit,
  onDelete,
}: {
  task: Task;
  dragging: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <TaskCard
        task={task}
        dragging={dragging}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

export { TaskCard };
