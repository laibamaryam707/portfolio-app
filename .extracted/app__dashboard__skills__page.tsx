"use client";

import { useEffect, useState, useCallback } from "react";
import CrudList from "@/components/ui/CrudList";
import type { SkillData } from "@/lib/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillData[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/skills").then((r) => r.json()).then((d) => setSkills(d.skills || []));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <CrudList<SkillData>
      title="Skills"
      items={skills}
      apiPath="/api/skills"
      onRefresh={refresh}
      emptyMessage="No skills added yet. Add your skills, technologies, and tools."
      getInitialForm={() => ({ name: "", category: "skill", level: 80, icon: "" })}
      fields={[
        { name: "name", label: "Name", placeholder: "React.js" },
        { name: "category", label: "Category (skill / technology / tool)", placeholder: "skill" },
        { name: "level", label: "Level (0-100)", type: "number" },
        { name: "icon", label: "Icon (emoji)", placeholder: "⚛️" },
      ]}
      renderItem={(item) => (
        <div>
          <div className="flex items-center gap-2">
            {item.icon && <span>{item.icon}</span>}
            <span className="text-white font-medium">{item.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 capitalize">{item.category}</span>
          </div>
          <div className="mt-2 h-1.5 w-48 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${item.level}%` }} />
          </div>
        </div>
      )}
    />
  );
}
