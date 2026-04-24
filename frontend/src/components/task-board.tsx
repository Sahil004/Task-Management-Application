"use client";

import { useRef, useState } from "react";
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
  UniqueIdentifier,
  MeasuringStrategy,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { Task } from "@/lib/types";
import { STATUSES } from "@/lib/constants";
import { Column } from "./task-board/column";
import { TaskCard } from "./task-board/task-card";

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
    if (overTask) void onReorder(taskId, overTask.status, overTask._id);
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
