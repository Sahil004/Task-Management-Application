import { Task } from "@/lib/types";

export const STATUSES = ["todo", "in-progress", "done"] as Task["status"][];

export const STATUS_META: Record<
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
