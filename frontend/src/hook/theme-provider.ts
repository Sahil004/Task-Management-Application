"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { initializeTheme, toggleTheme } from "@/lib/store/theme-slice";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    const saved = localStorage.getItem("tf-theme") as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = saved ?? preferred;
    dispatch(initializeTheme(initial));
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tf-theme", theme);
  }, [theme]);

  return children;
}

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);

  return {
    theme,
    toggle: () => dispatch(toggleTheme()),
  };
};
