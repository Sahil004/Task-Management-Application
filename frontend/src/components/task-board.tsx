"use client";

import clsx from "clsx";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  UniqueIdentifier,
  MeasuringStrategy,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState } from "react";
import { Task } from "@/lib/types";
import { CircleAlert, CircleCheckBig, Loader } from "lucide-react";
import { TASK_PRIORITY_META, TASK_STATUS_LABELS } from "@/lib/task-options";
import { SurfaceCard } from "@/components/ui/surface-card";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";

const STATUSES = ["todo", "in-progress", "done"] as Task["status"][];

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
      className="flex flex-col items-center justify-center py-10 sm:py-12 text-center rounded-2xl px-4"
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
        "p-3 sm:p-4 transition-colors duration-200",
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

function SortableTaskCard({
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

function Column({
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
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumn, setOverColumn] = useState<Task["status"] | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const grouped: Record<Task["status"], Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  function handleDragStart({ active }: DragStartEvent) {
    setActiveTask(tasks.find((t) => t._id === active.id) ?? null);
  }

  function handleDragOver({ over }: DragOverEvent) {
    if (!over) {
      setOverColumn(null);
      return;
    }
    const id = over.id as string;
    if (STATUSES.includes(id as Task["status"])) {
      setOverColumn(id as Task["status"]);
    } else {
      const t = tasks.find((t) => t._id === id);
      setOverColumn(t?.status ?? null);
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    setOverColumn(null);
    lastOverId.current = null;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (STATUSES.includes(overId as Task["status"])) {
      void onReorder(taskId, overId as Task["status"]);
      return;
    }

    const overTask = tasks.find((t) => t._id === overId);
    if (overTask) {
      void onReorder(taskId, overTask.status, overTask._id);
    }
  }

  return (
    <DndContext
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 items-start">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={grouped[status]}
            loading={loading}
            dragging={dragging}
            isOver={overColumn === status}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay
        adjustScale={false}
        modifiers={[restrictToFirstScrollableAncestor]}
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeTask ? (
          <div
            style={{
              width: "280px",
              transform: "rotate(2deg)",
              opacity: 0.95,
              pointerEvents: "none",
            }}
          >
            <TaskCard task={activeTask} dragging={false} overlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
