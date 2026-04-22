"use client";

export default function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl px-4 py-3 text-sm flex items-start gap-2"
      style={{
        border: "1px solid rgba(255,110,156,0.3)",
        background: "rgba(255,110,156,0.08)",
        color: "#ff6e9c",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </div>
  );
}
