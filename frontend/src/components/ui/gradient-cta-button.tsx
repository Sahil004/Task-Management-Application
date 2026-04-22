"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

export const gradientCtaClassName =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

export const gradientCtaStyle = {
  background: "linear-gradient(135deg, #6e73ff, #3ecfb8)",
  boxShadow: "0 0 20px rgba(110,115,255,0.3)",
};

type GradientCtaButtonProps = {
  children: ReactNode;
  leftIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function GradientCtaButton({
  children,
  leftIcon,
  className,
  style,
  ...props
}: GradientCtaButtonProps) {
  return (
    <button
      className={clsx(
        gradientCtaClassName,
        className,
      )}
      style={{
        ...gradientCtaStyle,
        ...style,
      }}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}
