"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  certificates: "Certificates",
  "custom-cards": "Custom Cards",
  categories: "Categories",
  activity: "Activity",
  trash: "Trash",
  layout: "Layout",
  preview: "Preview",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => ({
    label: LABELS[seg] || seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6">
      <Link href="/dashboard" className="text-white/40 hover:text-white transition">
        <Home size={14} />
      </Link>
      {crumbs.slice(1).map((c) => (
        <span key={c.href} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-white/20" />
          {c.isLast ? (
            <span className="text-white font-medium">{c.label}</span>
          ) : (
            <Link href={c.href} className="text-white/40 hover:text-white transition">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}