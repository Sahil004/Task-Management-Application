import { Task } from "@/lib/types";

export const TASK_STATUS_OPTIONS: Array<{ value: Task["status"]; label: string }> =
  [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

export const TASK_PRIORITY_OPTIONS: Array<{
  value: Task["priority"];
  label: string;
}> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const TASK_STATUS_LABELS: Record<Task["status"], string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const TASK_PRIORITY_META: Record<
  Task["priority"],
  { color: string; bg: string }
> = {
  high: { color: "#ff6e9c", bg: "rgba(255,110,156,0.12)" },
  medium: { color: "#6e73ff", bg: "rgba(110,115,255,0.12)" },
  low: { color: "#3ecfb8", bg: "rgba(62,207,184,0.12)" },
};
