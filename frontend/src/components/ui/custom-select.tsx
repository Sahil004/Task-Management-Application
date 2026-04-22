"use client";

import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
    <div className={clsx("relative", className)} ref={rootRef}>
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

      {open && (
        <div
          role="listbox"
          className={clsx(
            "absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-xl border p-1 shadow-xl",
            menuClassName,
          )}
          style={{
            borderColor: "var(--border-2)",
            background: "var(--bg-card)",
          }}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value || "__empty"}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all"
                style={{
                  color: active ? "#6e73ff" : "var(--fg-2)",
                  background: active ? "rgba(110,115,255,0.1)" : "transparent",
                }}
              >
                <span className="truncate">{option.label}</span>
                {active && <Check size={13} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
