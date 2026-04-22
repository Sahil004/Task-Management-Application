"use client";

import React from "react";

type InputFieldProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputField({
  label,
  error,
  ...props
}: InputFieldProps) {
  return (
    <label className="block">
      <span
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--fg)" }}
      >
        {label}
      </span>

      <input
        {...props}
        className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all duration-200"
        style={{
          border: error ? "1px solid #ff6e9c" : "1px solid var(--border-2)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#6e73ff";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(110,115,255,0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "#ff6e9c"
            : "var(--border-2)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {error && (
        <span className="text-xs mt-1 block" style={{ color: "#ff6e9c" }}>
          {error}
        </span>
      )}
    </label>
  );
}
