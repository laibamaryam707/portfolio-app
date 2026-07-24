import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidViewer } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import Skill from "@/models/Skill";

export async function GET(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category");
  const proficiency = searchParams.get("proficiency");

  const query: Record<string, unknown> = { userId: result.user._id, deleted: { $ne: true } };
  if (search) query.name = { $regex: search, $options: "i" };
  if (category && category !== "all") query.category = category;
  if (proficiency && proficiency !== "all") query.proficiency = proficiency;

  const skills = await Skill.find(query).sort({ order: 1, createdAt: -1 });
  return NextResponse.json({ skills: JSON.parse(JSON.stringify(skills)) });
}

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const data = await req.json();
  if (!data.name || String(data.name).trim().length === 0) {
  return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
}
if (String(data.name).trim().length > 50) {
  return NextResponse.json({ error: "Name must be under 50 characters" }, { status: 400 });
}
  const skill = await Skill.create({ ...data, userId: result.user._id });
  await logActivity(result.user._id, "created", "skill", skill.name);
  return NextResponse.json({ skill: JSON.parse(JSON.stringify(skill)) }, { status: 201 });
}