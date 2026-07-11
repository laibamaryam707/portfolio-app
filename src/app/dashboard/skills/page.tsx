"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import CrudList from "@/components/ui/CrudList";
import ProgressBar from "@/components/ui/ProgressBar";
import { PROFICIENCY_LEVELS, type SkillData } from "@/lib/types";

const PROFICIENCY_COLOR: Record<string, string> = {
  Beginner: "bg-peach text-peach-fg text-white",
  Intermediate: "bg-sky text-sky-fg text-white",
  Advanced: "bg-mint text-mint-fg text-white",
};

const controlCls =
  "rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-white focus:border-graphite focus:outline-none focus:ring-2 focus:ring-graphite/15 transition";

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [proficiency, setProficiency] = useState("all");

  const refresh = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (proficiency !== "all") params.set("proficiency", proficiency);
    fetch(`/api/skills?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setSkills(d.skills || []));
  }, [search, category, proficiency]);

  useEffect(() => {
    const t = setTimeout(refresh, 250);
    return () => clearTimeout(t);
  }, [refresh]);

  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills"
          className={`${controlCls} w-full pl-9`}
        />
      </div>
      <select value={category} onChange={(e) => setCategory(e.target.value)} className={controlCls}>
        <option value="all">All categories</option>
        <option value="skill">Skill</option>
        <option value="technology">Technology</option>
        <option value="tool">Tool</option>
      </select>
      <select value={proficiency} onChange={(e) => setProficiency(e.target.value)} className={controlCls}>
        <option value="all">All levels</option>
        {PROFICIENCY_LEVELS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0a192b' }}>
      <CrudList<SkillData>
        title="Skills"
        items={skills}
        apiPath="/api/skills"
        onRefresh={refresh}
        softDelete
        toolbar={toolbar}
        emptyMessage="No skills match. Add your skills, technologies and tools."
        getInitialForm={() => ({ name: "", category: "skill", proficiency: "Intermediate", level: 80, icon: "" })}
      fields={[
        { name: "name", label: "Name", placeholder: "React" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            { value: "skill", label: "Skill" },
            { value: "technology", label: "Technology" },
            { value: "tool", label: "Tool" },
          ],
        },
        {
          name: "proficiency",
          label: "Proficiency level",
          type: "select",
          options: PROFICIENCY_LEVELS.map((p) => ({ value: p, label: p })),
        },
        { name: "level", label: "Proficiency % (0–100)", type: "number" },
        { name: "icon", label: "Icon (emoji)", placeholder: "⚛️" },
      ]}
      renderItem={(item) => (
        <div>
          <div className="flex items-center flex-wrap gap-2">
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="text-white font-medium">{item.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-lavender text-lavender-fg capitalize">{item.category}</span>
            {item.proficiency && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${PROFICIENCY_COLOR[item.proficiency] || "bg-surface-2 text-white"}`}>
                {item.proficiency}
              </span>
            )}
          </div>
          <div className="mt-2.5 flex items-center gap-3 max-w-md">
            <ProgressBar value={item.level} className="flex-1" height="h-1.5" color="bg-sky-400" />
            <span className="text-xs text-white w-9 text-right tabular-nums">{item.level}%</span>
          </div>
        </div>
      )}
    />
    </div>
  );
}