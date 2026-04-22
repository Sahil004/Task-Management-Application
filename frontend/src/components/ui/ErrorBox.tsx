"use client";

import { CircleAlert } from "lucide-react";

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
      <CircleAlert size={14} style={{ marginTop: 2 }} />
      {message}
    </div>
  );
}
