"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, RotateCcw, X, Activity } from "lucide-react";
import Card from "@/components/ui/Card";
import type { ActivityData } from "@/lib/types";

const ACTION_META: Record<string, { icon: typeof Plus; color: string; bg: string; label: string }> = {
  created: { icon: Plus, color: "text-emerald-400", bg: "bg-emerald-500/15", label: "Created" },
  updated: { icon: Pencil, color: "text-sky-400", bg: "bg-sky-500/15", label: "Updated" },
  deleted: { icon: Trash2, color: "text-amber-400", bg: "bg-amber-500/15", label: "Deleted" },
  restored: { icon: RotateCcw, color: "text-indigo-400", bg: "bg-indigo-500/15", label: "Restored" },
  purged: { icon: X, color: "text-red-400", bg: "bg-red-500/15", label: "Purged" },
};

function groupByDay(items: ActivityData[]) {
  const groups: Record<string, ActivityData[]> = {};
  items.forEach((a) => {
    const day = new Date(a.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    if (!groups[day]) groups[day] = [];
    groups[day].push(a);
  });
  return groups;
}

function timeOf(d: string) {
  return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;

  const refresh = useCallback(() => {
    setLoading(true);
    fetch("/api/activity?limit=200")
      .then((r) => r.json())
      .then((d) => setActivities(d.activities || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const filtered = activities
    .filter((a) => {
      const q = search.toLowerCase();
      return !q || a.entityName?.toLowerCase().includes(q) || a.entityType.includes(q) || a.action.includes(q);
    })
    .filter((a) => actionFilter === "all" || a.action === actionFilter)
    .filter((a) => entityFilter === "all" || a.entityType === entityFilter);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = filtered.length > paginated.length;
  const grouped = groupByDay(paginated);

  const controlCls = "rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none";

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Trail</h1>
          <p className="text-white/60 text-sm mt-1">
            Every change to your portfolio content, in order.
            {!loading && <span className="ml-2 text-white/40">{filtered.length} events</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, type or action"
            className={`${controlCls} w-full pl-9`}
          />
        </div>
        <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} className={controlCls}>
          <option value="all">All actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
          <option value="restored">Restored</option>
          <option value="purged">Purged</option>
        </select>
        <select value={entityFilter} onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }} className={controlCls}>
          <option value="all">All types</option>
          <option value="project">Projects</option>
          <option value="skill">Skills</option>
          <option value="profile">Profile</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Activity size={28} className="text-white/30 mx-auto mb-3" />
          <p className="text-white/60">No activity matches your filters.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([day, items]) => (
            <div key={day}>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{day}</p>
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/40">{items.length} event{items.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="space-y-2">
                {items.map((a, i) => {
                  const meta = ACTION_META[a.action] || ACTION_META.updated;
                  const Icon = meta.icon;
                  const isLast = i === items.length - 1;
                  return (
                    <div key={a._id} className="flex gap-3 relative">
                      {/* timeline line */}
                      {!isLast && <div className="absolute left-4 top-10 bottom-0 w-px bg-white/10" />}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.bg} z-10`}>
                        <Icon size={14} className={meta.color} />
                      </div>
                      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-3 min-w-0">
                        <div className="min-w-0">
                          <p className="text-sm text-white">
                            <span className={`font-medium ${meta.color}`}>{meta.label}</span>
                            <span className="text-white/60"> {a.entityType}</span>
                            {a.entityName && <span className="text-white font-medium"> &quot;{a.entityName}&quot;</span>}
                          </p>
                        </div>
                        <span className="text-xs text-white/40 shrink-0">{timeOf(a.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center pt-2">
              <button onClick={() => setPage((p) => p + 1)} className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-white hover:bg-white/10 transition">
                Load more ({filtered.length - paginated.length} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}