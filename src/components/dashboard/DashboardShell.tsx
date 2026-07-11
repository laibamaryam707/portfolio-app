"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { DashboardProvider, type DashboardUser } from "./DashboardContent";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) =>
        setUser({
          username: d.user.username,
          email: d.user.email,
          role: d.user.role || "admin",
        })
      )
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardProvider value={user}>
      <div className="min-h-screen bg-slate-950 lg:flex">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-xl px-4 py-3">
          <span className="text-lg font-bold text-white">
            Portfolio <span className="text-indigo-400">Vault</span>
          </span>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </header>

        <Sidebar
          username={user.username}
          role={user.role}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">{children}</main>
      </div>
    </DashboardProvider>
  );
}