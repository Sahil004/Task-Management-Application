"use client";

/* ── ConfirmDialog ── */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 animate-fade-up"
        style={{
          border: "1px solid rgba(255,110,156,0.25)",
          background: "var(--bg-card)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(255,110,156,0.1)", color: "#ff6e9c" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-2" style={{ color: "var(--fg)" }}>
          {title}
        </h3>
        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: "var(--fg-2)" }}
        >
          {description}
        </p>
        <div
          className="h-0.5 rounded-full mb-5"
          style={{ background: "linear-gradient(to right, #6e73ff, #ff6e9c)" }}
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all"
            style={{
              border: "1px solid var(--border-2)",
              color: "var(--fg-2)",
              background: "var(--bg)",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => void onConfirm()}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: "#ff6e9c",
              boxShadow: "0 0 16px rgba(255,110,156,0.3)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
