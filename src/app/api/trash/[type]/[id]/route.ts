import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidViewer } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import Skill from "@/models/Skill";
import Project from "@/models/Project";

function modelFor(type: string) {
  if (type === "skill") return Skill;
  if (type === "project") return Project;
  return null;
}

// Restore a soft-deleted item.
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { type, id } = await params;
  const Model = modelFor(type);
  if (!Model) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const doc = await Model.findOneAndUpdate(
    { _id: id, userId: result.user._id },
    { deleted: false, deletedAt: null },
    { new: true }
  );
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await logActivity(result.user._id, "restored", type as "skill" | "project", doc.name || doc.title || "");
  return NextResponse.json({ success: true });
}

// Permanently delete (purge) a trashed item.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { type, id } = await params;
  const Model = modelFor(type);
  if (!Model) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const doc = await Model.findOneAndDelete({ _id: id, userId: result.user._id, deleted: true });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await logActivity(result.user._id, "purged", type as "skill" | "project", doc.name || doc.title || "");
  return NextResponse.json({ success: true });
}