"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Code2, FolderKanban, Briefcase,
  Award, Sparkles, Palette, LogOut, ExternalLink,
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
  { href: "/dashboard/layout", label: "Layout", icon: Palette },
];

interface SidebarProps {
  username: string;
}

export default function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          Portfolio<span className="text-indigo-400">Hub</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
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
    </aside>
  );
}
