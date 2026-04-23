"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClasses: Record<ToastTone, string> = {
  success: "border-[rgba(62,207,184,0.2)]   bg-[var(--bg)] text-[var(--fg)]",
  error: "border-[rgba(255,110,156,0.2)]  bg-[var(--bg)] text-[var(--fg)]",
  info: "border-[rgba(110,115,255,0.2)]  bg-[var(--bg)] text-[var(--fg)]",
};

const toneAccentClasses: Record<ToastTone, string> = {
  success: "bg-[#3ecfb8]",
  error: "bg-[#ff6e9c]",
  info: "bg-[#6e73ff]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    setToasts((current) => [...current, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col gap-2">
        <div className="flex w-72 flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto overflow-hidden rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${toneClasses[toast.tone]}`}
            >
              <div
                className={`h-1.5 w-full ${toneAccentClasses[toast.tone]}`}
              />
              <div className="p-4">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--fg)" }}
                >
                  {toast.title}
                </p>
                {toast.description ? (
                  <p
                    className="mt-1 text-sm leading-6"
                    style={{ color: "var(--fg-2)" }}
                  >
                    {toast.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
