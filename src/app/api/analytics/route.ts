import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import Skill from "@/models/Skill";
import Project from "@/models/Project";

interface SkillDoc {
  category: string;
  proficiency: string;
  level: number;
}
interface ProjectDoc {
  category: string;
  status: string;
  featured: boolean;
  createdAt: string | Date;
}

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const userId = result.user._id;
  const [skills, projects] = await Promise.all([
    Skill.find({ userId, deleted: { $ne: true } }).lean<SkillDoc[]>(),
    Project.find({ userId, deleted: { $ne: true } }).lean<ProjectDoc[]>(),
  ]);

  // Skill distribution by category (skill / technology / tool)
  const skillsByCategory: Record<string, number> = {};
  const skillsByProficiency: Record<string, number> = { Beginner: 0, Intermediate: 0, Advanced: 0 };
  let levelSum = 0;
  for (const s of skills) {
    skillsByCategory[s.category] = (skillsByCategory[s.category] || 0) + 1;
    if (s.proficiency in skillsByProficiency) skillsByProficiency[s.proficiency]++;
    levelSum += s.level || 0;
  }

  // Projects per category
  const projectsByCategory: Record<string, number> = {};
  let completed = 0;
  let inProgress = 0;
  let featured = 0;
  for (const p of projects) {
    const cat = p.category || "Other";
    projectsByCategory[cat] = (projectsByCategory[cat] || 0) + 1;
    if (p.status === "Completed") completed++;
    else if (p.status === "In Progress") inProgress++;
    if (p.featured) featured++;
  }

  // Monthly project additions for the last 6 months
  const now = new Date();
  const months: { label: string; key: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      key: `${d.getFullYear()}-${d.getMonth()}`,
      count: 0,
    });
  }
  const monthIndex: Record<string, number> = {};
  months.forEach((m, idx) => (monthIndex[m.key] = idx));
  for (const p of projects) {
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key in monthIndex) months[monthIndex[key]].count++;
  }

  const categoryCount = Object.keys(projectsByCategory).length;

  return NextResponse.json({
    totals: {
      skills: skills.length,
      projects: projects.length,
      categories: categoryCount,
      featured,
      completed,
      inProgress,
      avgLevel: skills.length ? Math.round(levelSum / skills.length) : 0,
      totalContent: skills.length + projects.length,
  memberSince: result.user.createdAt,
    },
    byType: {
  Skills: skills.length,
  Projects: projects.length,
},
    skillsByCategory,
    skillsByProficiency,
    projectsByCategory,
    projectsByMonth: months.map((m) => ({ label: m.label, count: m.count })),
  });
}