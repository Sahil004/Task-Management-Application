"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/store/auth-slice";
import { useToast } from "@/components/toast-provider";
import { User } from "@/lib/types";
import { Navbar } from "./navbar";

export function DashboardShell({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    showToast({
      tone: "info",
      title: "Signed out",
      description: "Your session has been cleared.",
    });
    router.replace("/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* bg glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(110,115,255,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(62,207,184,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <Navbar userName={user?.name?.split(" ")[0]} onLogout={handleLogout} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
