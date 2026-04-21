'use client';

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
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/60 bg-white p-6 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">Confirm Action</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-ink/65">{description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            className="flex-1 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
