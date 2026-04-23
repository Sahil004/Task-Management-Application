"use client";

import { FormEvent, useState } from "react";
import { TaskFormValues } from "@/lib/types";
import { CircleAlert, Loader } from "lucide-react";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { GradientCtaButton } from "@/components/ui/gradient-cta-button";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/lib/task-options";

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
    try {
      await onSubmit(values);
      if (mode === "create") setValues(DEFAULT);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to save task.");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all duration-200";
  const inputStyle = {
    border: "1px solid var(--border-2)",
    background: "var(--bg)",
    color: "var(--fg)",
  } as React.CSSProperties;

  const focusIn = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.currentTarget.style.borderColor = "#6e73ff";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(110,115,255,0.1)";
  };
  const focusOut = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.currentTarget.style.borderColor = "var(--border-2)";
    e.currentTarget.style.boxShadow = "none";
  };

  const priorityOptions: SelectOption[] = TASK_PRIORITY_OPTIONS;
  const statusOptions: SelectOption[] = TASK_STATUS_OPTIONS;

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
          <CustomSelect
            value={values.priority}
            onChange={(nextValue) => set("priority", nextValue)}
            options={priorityOptions}
            placeholder="Select priority"
          />
        </div>
        <div>
          <label
            className="block text-xs font-medium mb-2"
            style={{ color: "var(--fg-2)" }}
          >
            Status
          </label>
          <CustomSelect
            value={values.status}
            onChange={(nextValue) => set("status", nextValue)}
            options={statusOptions}
            placeholder="Select status"
          />
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
          <CircleAlert size={14} />
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
        <GradientCtaButton
          type="submit"
          disabled={loading}
          className="flex-1 justify-center py-3"
          style={{ boxShadow: "0 0 16px rgba(110,115,255,0.25)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader size={14} className="animate-spin" />
              Saving...
            </span>
          ) : mode === "create" ? (
            "Create Task"
          ) : (
            "Save Changes"
          )}
        </GradientCtaButton>
      </div>
    </form>
  );
}
