"use client";

import { useEffect, useState, useCallback } from "react";
import { RotateCcw, Trash2, Code2, FolderKanban } from "lucide-react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { useIsViewer } from "@/components/dashboard/DashboardContent";
import type { SkillData, ProjectData } from "@/lib/types";
import toast from "react-hot-toast";

export default function TrashPage() {
  const isViewer = useIsViewer();
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/trash")
      .then((r) => r.json())
      .then((d) => {
        setSkills(d.skills || []);
        setProjects(d.projects || []);
      });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const restore = async (type: "skill" | "project", id: string) => {
    try {
      const res = await fetch(`/api/trash/${type}/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      toast.success("Restored successfully");
      refresh();
    } catch {
      toast.error("Couldn't restore that");
    }
  };

  const purge = async (type: "skill" | "project", id: string) => {
    if (!confirm("Delete this for good? This can't be undone.")) return;
    try {
      const res = await fetch(`/api/trash/${type}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Permanently deleted");
      refresh();
    } catch {
      toast.error("Couldn't delete that");
    }
  };

  const isEmpty = skills.length === 0 && projects.length === 0;

  const row = (
    type: "skill" | "project",
    id: string,
    label: string,
    sub: string,
    Icon: typeof Code2
  ) => (
    <Card key={id} className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-white/50" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{label}</p>
          <p className="text-xs text-white/50 truncate capitalize">{sub}</p>
        </div>
      </div>
      {!isViewer && (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => restore(type, id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/10 transition"
          >
            <RotateCcw size={14} /> Restore
          </button>
          <button
            onClick={() => purge(type, id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </Card>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Trash</h1>
        <p className="text-white/60 text-sm mt-1">
          Restore items or permanently delete them.
        </p>
      </div>

      {isEmpty ? (
        <Card>
          <EmptyState
            icon={Trash2}
            title="Trash is empty"
            description="Items you delete will appear here. You can restore or permanently remove them."
          />
        </Card>
      ) : (
        <div className="space-y-8">
          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Projects ({projects.length})
              </h2>
              <div className="space-y-3">
                {projects.map((p) =>
                  row("project", p._id, p.title, p.category || "Project", FolderKanban)
                )}
              </div>
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Skills ({skills.length})
              </h2>
              <div className="space-y-3">
                {skills.map((s) =>
                  row("skill", s._id, s.name, s.category, Code2)
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}