"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ToastProvider } from "@/components/toast-provider";
import { ThemeProvider } from "@/hook/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* ThemeProvider must be inside Provider so it can dispatch to the store */}
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}
