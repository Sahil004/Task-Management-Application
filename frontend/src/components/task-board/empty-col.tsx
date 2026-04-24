import { CircleAlert, CircleCheckBig, Loader } from "lucide-react";
import { Task } from "@/lib/types";
import { TASK_STATUS_LABELS } from "@/lib/task-options";
import { STATUS_META } from "@/lib/constants";

export function EmptyCol({ status }: { status: Task["status"] }) {
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
