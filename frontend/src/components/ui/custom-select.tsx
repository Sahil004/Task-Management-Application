"use client";

import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
export type SelectOption = {
  value: string;
  label: string;
};

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  menuClassName,
}: {
  value: string;
  onChange: (nextValue: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  menuClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className={clsx("relative isolate z-50", className)} ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2 text-left text-xs font-medium transition-all hover:border-[#6e73ff66]"
        style={{
          borderColor: open ? "#6e73ff" : "var(--border-2)",
          background: "var(--bg-card)",
          color: "var(--fg-2)",
          boxShadow: open ? "0 0 0 3px rgba(110,115,255,0.1)" : "none",
        }}
      >
        <span className="truncate">{selected?.label ?? placeholder ?? "Select"}</span>
        <ChevronDown
          size={14}
          className={clsx(
            "shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open &&
        rootRef.current &&
        createPortal(
          <div
            role="listbox"
            className="fixed z-[99999] max-h-60 overflow-auto rounded-xl border p-1 shadow-2xl backdrop-blur-md"
            style={{
              top: rootRef.current.getBoundingClientRect().bottom + 8,
              left: rootRef.current.getBoundingClientRect().left,
              width: rootRef.current.offsetWidth,
              background: "rgba(20,20,28,0.75)",
              backdropFilter: "blur(16px)",
            }}
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs"
                  style={{
                    color: active ? "#6e73ff" : "var(--fg-2)",
                    background: active
                      ? "rgba(110,115,255,0.12)"
                      : "transparent",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}