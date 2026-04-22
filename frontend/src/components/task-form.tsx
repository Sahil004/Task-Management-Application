"use client";

import { FormEvent, useState } from "react";
import { TaskFormValues } from "@/lib/types";

const DEFAULT: TaskFormValues = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};

export function TaskForm({
  initialValues,
  loading,
  mode,
  error,
  onCancel,
  onSubmit,
}: {
  initialValues?: TaskFormValues;
  loading: boolean;
  mode: "create" | "edit";
  error: string | null;
  onCancel?: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<TaskFormValues>(
    initialValues ?? DEFAULT,
  );
  const [formError, setFormError] = useState("");

  const set = (k: keyof TaskFormValues, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!values.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    await onSubmit(values);
    if (mode === "create") setValues(DEFAULT);
  };

  const inputCls =
    "w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all duration-200";
  const inputStyle = {
    border: "1px solid var(--border-2)",
    background: "var(--bg)",
    color: "var(--fg)",
  } as React.CSSProperties;

  const focusIn = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.currentTarget.style.borderColor = "#6e73ff";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(110,115,255,0.1)";
  };
  const focusOut = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.currentTarget.style.borderColor = "var(--border-2)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Tip */}
      {mode === "create" && !loading && (
        <div
          className="px-4 py-3 rounded-2xl text-xs leading-relaxed"
          style={{
            background: "rgba(110,115,255,0.06)",
            border: "1px solid rgba(110,115,255,0.15)",
            color: "var(--fg-2)",
          }}
        >
          💡 Start with a clear title, add a due date for high-priority items,
          and set the initial status.
        </div>
      )}

      {/* Title */}
      <div>
        <label
          className="block text-xs font-medium mb-2"
          style={{ color: "var(--fg-2)" }}
        >
          Title *
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          className={inputCls}
          style={inputStyle}
          onFocus={focusIn}
          onBlur={focusOut}
        />
      </div>

      {/* Description */}
      <div>
        <label
          className="block text-xs font-medium mb-2"
          style={{ color: "var(--fg-2)" }}
        >
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Optional details..."
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputCls}
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={focusIn}
          onBlur={focusOut}
        />
      </div>

      {/* Priority + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="block text-xs font-medium mb-2"
            style={{ color: "var(--fg-2)" }}
          >
            Priority
          </label>
          <select
            value={values.priority}
            onChange={(e) => set("priority", e.target.value)}
            className={inputCls}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label
            className="block text-xs font-medium mb-2"
            style={{ color: "var(--fg-2)" }}
          >
            Status
          </label>
          <select
            value={values.status}
            onChange={(e) => set("status", e.target.value)}
            className={inputCls}
            style={inputStyle}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Due date */}
      <div>
        <label
          className="block text-xs font-medium mb-2"
          style={{ color: "var(--fg-2)" }}
        >
          Due Date
        </label>
        <input
          type="date"
          value={values.dueDate}
          onChange={(e) => set("dueDate", e.target.value)}
          className={inputCls}
          style={inputStyle}
          onFocus={focusIn}
          onBlur={focusOut}
        />
      </div>

      {/* Errors */}
      {(formError || error) && (
        <div
          className="flex items-start gap-2 px-4 py-3 rounded-2xl text-xs"
          style={{
            border: "1px solid rgba(255,110,156,0.3)",
            background: "rgba(255,110,156,0.08)",
            color: "#ff6e9c",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="mt-0.5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
          </svg>
          {formError || error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
            style={{
              border: "1px solid var(--border-2)",
              color: "var(--fg-2)",
              background: "var(--bg)",
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #6e73ff, #3ecfb8)",
            boxShadow: "0 0 16px rgba(110,115,255,0.25)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Saving...
            </span>
          ) : mode === "create" ? (
            "Create Task"
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
