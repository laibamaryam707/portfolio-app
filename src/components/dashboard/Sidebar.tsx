"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Code2, FolderKanban, Briefcase,
  Award, Sparkles, Palette, LogOut, ExternalLink, Activity, Trash2, X, ShieldCheck, Eye,
  Layers,
  Monitor,
} from "lucide-react";
import toast from "react-hot-toast";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/skills", label: "Skills", icon: Code2 },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/custom-cards", label: "Custom Cards", icon: Sparkles },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/trash", label: "Trash", icon: Trash2 },
  { href: "/dashboard/layout", label: "Layout", icon: Palette },
  { href: "/dashboard/categories", label: "Categories", icon: Layers },
{ href: "/dashboard/preview", label: "Live Preview", icon: Monitor },
];

interface SidebarProps {
  username: string;
  role?: "admin" | "viewer";
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ username, role = "admin", mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/login");
  };

  const isViewer = role === "viewer";

  const content = (
    <>
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="text-xl font-bold text-white" onClick={onClose}>
          Portfolio <span className="text-indigo-400">Vault</span>
        </Link>
        <div
          className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isViewer ? "bg-amber-500/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"
          }`}
        >
          {isViewer ? <Eye size={12} /> : <ShieldCheck size={12} />}
          {isViewer ? "Viewer" : "Admin"}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <a
          href={`/portfolio/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition"
        >
          <ExternalLink size={18} />
          View Portfolio
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl flex-col h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85%] border-r border-white/10 bg-slate-900 flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-white/10 transition"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}