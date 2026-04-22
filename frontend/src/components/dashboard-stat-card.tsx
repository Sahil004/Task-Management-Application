"use client";

import { ReactNode } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";

export function DashboardStatCard({
  label,
  value,
  color,
  bg,
  icon,
  loading,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: ReactNode;
  loading: boolean;
}) {
  return (
    <SurfaceCard
      elevated
      className="flex cursor-default flex-col gap-3 p-5 transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--fg-3)" }}>
          {label}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: bg, color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold" style={{ color }}>
        {loading ? (
          <span
            className="inline-block h-8 w-8 animate-pulse rounded-xl"
            style={{ background: bg }}
          />
        ) : (
          value
        )}
      </p>
      <div className="h-0.5 rounded-full" style={{ background: bg }} />
    </SurfaceCard>
  );
}
