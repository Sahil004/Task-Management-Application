import clsx from "clsx";
import { CSSProperties, ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type SurfaceCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  elevated?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children"> & {
    style?: CSSProperties;
  };

export function SurfaceCard<T extends ElementType = "div">({
  as,
  children,
  className,
  style,
  elevated = false,
  ...rest
}: SurfaceCardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx("rounded-2xl border p-4", elevated && "shadow-sm", className)}
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-card)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
