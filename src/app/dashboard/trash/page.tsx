"use client";

import { useEffect, useState, useCallback } from "react";
import { RotateCcw, Trash2, Code2, FolderKanban } from "lucide-react";
import Card from "@/components/ui/Card";
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
      toast.success("Restored");
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
      toast.success("Deleted");
      refresh();
    } catch {
      toast.error("Couldn't delete that");
    }
  };

  const isEmpty = skills.length === 0 && projects.length === 0;

  const row = (type: "skill" | "project", id: string, label: string, sub: string, Icon: typeof Code2) => (
    <Card key={id} className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-white/60" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{label}</p>
          <p className="text-xs text-white truncate">{sub}</p>
        </div>
      </div>
      {!isViewer && (
        <div className="flex gap-2 shrink-0">
          <button onClick={() => restore(type, id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-mint-fg text-white hover:bg-mint transition">
            <RotateCcw size={14} /> Restore
          </button>
          <button onClick={() => purge(type, id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-rose-fg text-white hover:bg-rose transition">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen p-6" style={{backgroundColor: '#0a192b'}}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white/60 font-display tracking-tight">Trash</h1>
        <p className="text-white/60 text-sm mt-1">Restore items, or delete them for good.</p>
      </div>

      {isEmpty ? (
        <Card className="p-12 text-center">
          <div className="w-11 h-11 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-white/60" />
          </div>
          <p className="text-white/60">Trash is empty.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Projects ({projects.length})</h2>
              <div className="space-y-3">
                {projects.map((p) => row("project", p._id, p.title, p.category || "Project", FolderKanban))}
              </div>
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Skills ({skills.length})</h2>
              <div className="space-y-3">
                {skills.map((s) => row("skill", s._id, s.name, s.category, Code2))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}