"use client";

import { Plus, Pencil, Trash2, RotateCcw, X, Activity as ActivityIcon, FolderKanban, Code2, User as UserIcon } from "lucide-react";
import type { ActivityData } from "@/lib/types";

const ACTION_META: Record<string, { icon: typeof Plus; color: string; bg: string; verb: string }> = {
  created: { icon: Plus, color: "text-emerald-400", bg: "bg-emerald-500/15", verb: "Added" },
  updated: { icon: Pencil, color: "text-blue-400", bg: "bg-blue-500/15", verb: "Updated" },
  deleted: { icon: Trash2, color: "text-amber-400", bg: "bg-amber-500/15", verb: "Trashed" },
  restored: { icon: RotateCcw, color: "text-indigo-400", bg: "bg-indigo-500/15", verb: "Restored" },
  purged: { icon: X, color: "text-red-400", bg: "bg-red-500/15", verb: "Permanently deleted" },
};

const ENTITY_ICON: Record<string, typeof Plus> = {
  project: FolderKanban,
  skill: Code2,
  profile: UserIcon,
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function ActivityFeed({ items, emptyMessage = "No activity yet." }: { items: ActivityData[]; emptyMessage?: string }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ActivityIcon size={28} className="text-slate-600 mb-2" />
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((a) => {
        const meta = ACTION_META[a.action] || ACTION_META.updated;
        const EntityIcon = ENTITY_ICON[a.entityType] || ActivityIcon;
        const Icon = meta.icon;
        return (
          <li key={a._id} className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
              <Icon size={16} className={meta.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-200">
                <span className="font-medium">{meta.verb}</span>{" "}
                <span className="text-slate-400">{a.entityType}</span>
                {a.entityName && <span className="text-white"> &ldquo;{a.entityName}&rdquo;</span>}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <EntityIcon size={11} /> {timeAgo(a.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}