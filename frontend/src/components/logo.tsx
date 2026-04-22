"use client";

import Link from "next/link";

export function Logo({
  href = "/",
  size = 36,
}: {
  href?: string;
  size?: number;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5 group">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6e73ff" />
            <stop offset="50%" stopColor="#3ecfb8" />
            <stop offset="100%" stopColor="#ff6e9c" />
          </linearGradient>
          <filter id="logo-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <rect
          x="10"
          y="10"
          width="100"
          height="100"
          rx="26"
          fill="rgba(255,255,255,0.07)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="36"
          fill="url(#logo-grad)"
          filter="url(#logo-blur)"
          opacity="0.8"
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="34"
          fontWeight="700"
          fontFamily="DM Sans, system-ui, sans-serif"
          letterSpacing="-1"
        >
          TF
        </text>
      </svg>
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 600,
          fontSize: 16,
          color: "var(--fg)",
        }}
      >
        Task<span style={{ color: "#3ecfb8" }}>.</span>
        <span
          style={{
            background: "linear-gradient(90deg, #6e73ff, #3ecfb8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Flow
        </span>
      </span>
    </Link>
  );
}
