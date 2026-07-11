import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidViewer } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import Skill from "@/models/Skill";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { id } = await params;
  const data = await req.json();
  const skill = await Skill.findOneAndUpdate({ _id: id, userId: result.user._id }, data, { new: true });
  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await logActivity(result.user._id, "updated", "skill", skill.name);
  return NextResponse.json({ skill: JSON.parse(JSON.stringify(skill)) });
}

// Soft delete: move the skill to Trash instead of removing it.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { id } = await params;
  const skill = await Skill.findOneAndUpdate(
    { _id: id, userId: result.user._id },
    { deleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await logActivity(result.user._id, "deleted", "skill", skill.name);
  return NextResponse.json({ success: true });
}