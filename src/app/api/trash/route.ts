import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import Skill from "@/models/Skill";
import Project from "@/models/Project";

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const [skills, projects] = await Promise.all([
    Skill.find({ userId: result.user._id, deleted: true }).sort({ deletedAt: -1 }),
    Project.find({ userId: result.user._id, deleted: true }).sort({ deletedAt: -1 }),
  ]);

  return NextResponse.json({
    skills: JSON.parse(JSON.stringify(skills)),
    projects: JSON.parse(JSON.stringify(projects)),
  });
}