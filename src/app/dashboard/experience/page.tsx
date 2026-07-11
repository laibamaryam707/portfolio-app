"use client";

import { useEffect, useState, useCallback } from "react";
import CrudList from "@/components/ui/CrudList";
import type { ExperienceData } from "@/lib/types";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/experience").then((r) => r.json()).then((d) => setExperiences(d.experiences || []));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="min-h-screen p-6" style={{backgroundColor: '#0a192b'}}>
      <CrudList<ExperienceData>
      title="Experience"
      items={experiences}
      apiPath="/api/experience"
      onRefresh={refresh}
      emptyMessage="No experience added yet. Add your work history."
      getInitialForm={() => ({ title: "", company: "", startDate: "", endDate: "", description: "", current: false })}
      fields={[
        { name: "title", label: "Job Title", placeholder: "Senior Developer" },
        { name: "company", label: "Company", placeholder: "Tech Corp" },
        { name: "startDate", label: "Start Date", placeholder: "2022" },
        { name: "endDate", label: "End Date", placeholder: "2024" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "current", label: "Currently working here", type: "checkbox" },
      ]}
      renderItem={(item) => (
        <div>
          <p className="text-white font-medium">{item.title}</p>
          <p className="text-sm text-indigo-400">{item.company}</p>
          <p className="text-xs text-slate-500 mt-1">{item.startDate} — {item.current ? "Present" : item.endDate}</p>
        </div>
      )}
    />
    </div>
  );
}
