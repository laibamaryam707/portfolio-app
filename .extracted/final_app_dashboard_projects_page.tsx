"use client";

import { useEffect, useState, useCallback } from "react";
import CrudList from "@/components/ui/CrudList";
import type { ProjectData } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/projects").then((r) => r.json()).then((d) => setProjects(d.projects || []));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <CrudList<ProjectData>
      title="Projects"
      items={projects}
      apiPath="/api/projects"
      onRefresh={refresh}
      emptyMessage="No projects yet. Showcase your best work."
      getInitialForm={() => ({ title: "", description: "", image: "", technologies: "", liveUrl: "", githubUrl: "" })}
      fields={[
        { name: "title", label: "Title", placeholder: "My Awesome Project" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image", label: "Project image", type: "image" },
        { name: "technologies", label: "Technologies (comma separated)", placeholder: "React, Node.js, MongoDB" },
        { name: "liveUrl", label: "Live URL", type: "url" },
        { name: "githubUrl", label: "GitHub URL", type: "url" },
      ]}
      renderItem={(item) => (
        <div>
          <p className="text-white font-medium">{item.title}</p>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
          {item.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {(Array.isArray(item.technologies) ? item.technologies : String(item.technologies).split(",")).map((t: string) => (
                <span key={t.trim()} className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300">{t.trim()}</span>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
}
