"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@/lib/types";
import { TASK_STATUS_LABELS } from "@/lib/task-options";
import { STATUS_META } from "@/lib/constants";
import { SortableTaskCard } from "./task-card";
import { EmptyCol } from "./empty-col";

export function Column({
  status,
  tasks,
  loading,
  dragging,
  isOver,
  onEdit,
  onDelete,
}: {
  status: Task["status"];
  tasks: Task[];
  loading: boolean;
  dragging: boolean;
  isOver: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const meta = STATUS_META[status];
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className="rounded-2xl p-3 sm:p-4 flex flex-col gap-3 transition-all duration-200 min-h-[200px] max-h-screen overflow-y-auto min-w-[280px] md:w-auto shrink-0"
      style={{
        border: `1px solid ${isOver ? meta.color + "80" : "var(--border)"}`,
        background: isOver ? meta.bg : "var(--bg-card)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: meta.color }}
          />
          <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
            {TASK_STATUS_LABELS[status]}
          </h3>
        </div>
        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ color: meta.color, background: meta.bg }}
        >
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-24 sm:h-28 rounded-2xl animate-pulse"
              style={{ background: "var(--bg)" }}
            />
          ))
        ) : tasks.length === 0 ? (
          <EmptyCol status={status} />
        ) : (
          tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              dragging={dragging}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </SortableContext>
    </section>
  );
}
