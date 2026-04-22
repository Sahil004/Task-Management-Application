"use client";

import clsx from "clsx";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

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
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [value, options],
  );

  // 🔥 Positioning (like floating-ui lite)
  const updatePosition = () => {
    if (!rootRef.current) return;

    const rect = rootRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 6;

    // flip if overflow bottom
    if (rect.bottom + 240 > viewportHeight) {
      top = rect.top - 240 - 6;
    }

    setMenuStyle({
      top,
      left: rect.left,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handler = () => updatePosition();

    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);

    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [open]);

  // 🔥 Outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // 🔥 Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % options.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + options.length) % options.length);
      }

      if (e.key === "Enter") {
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setOpen(false);
        }
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, highlightedIndex, options, onChange]);

  // 🔥 Typeahead
  useEffect(() => {
    if (!open) return;

    let buffer = "";
    let timeout: NodeJS.Timeout;

    const handler = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        buffer += e.key.toLowerCase();

        const index = options.findIndex((o) =>
          o.label.toLowerCase().startsWith(buffer),
        );

        if (index !== -1) setHighlightedIndex(index);

        clearTimeout(timeout);
        timeout = setTimeout(() => (buffer = ""), 500);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, options]);

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          setHighlightedIndex(options.findIndex((o) => o.value === value));
        }}
        className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs"
        style={{
          background: "var(--bg-card)",
          borderColor: open ? "#6e73ff" : "var(--border-2)",
        }}
      >
        <span>{selected?.label ?? placeholder ?? "Select"}</span>
        <ChevronDown
          size={14}
          className={clsx("transition", open && "rotate-180")}
        />
      </button>

      {/* Dropdown */}
      {open &&
        menuStyle &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            className="fixed z-[9999] max-h-60 overflow-auto rounded-xl border p-1 shadow-xl"
            style={{
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
              background: "rgba(20,20,28,0.95)",
              backdropFilter: "blur(12px)",
            }}
          >
            {options.map((option, i) => {
              const active = option.value === value;
              const highlighted = i === highlightedIndex;

              return (
                <button
                  key={option.value}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs"
                  style={{
                    background: highlighted
                      ? "rgba(110,115,255,0.2)"
                      : "transparent",
                    color: active ? "#6e73ff" : "var(--fg-2)",
                  }}
                >
                  {option.label}
                  {active && <Check size={12} />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
