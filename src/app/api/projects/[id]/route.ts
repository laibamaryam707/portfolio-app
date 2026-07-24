import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidViewer } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import Project from "@/models/Project";

function normalizeList(value: unknown): string[] | undefined {
  if (typeof value === "string") {
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean);
  return undefined;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { id } = await params;
  const data = await req.json();
  if (data.title !== undefined && String(data.title).trim().length === 0) {
  return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
}
if (data.image && String(data.image).length > 5 * 1024 * 1024) {
  return NextResponse.json({ error: "Image is too large. Maximum size is 5MB." }, { status: 400 });
}
  const tech = normalizeList(data.technologies);
  const tags = normalizeList(data.tags);
  if (tech) data.technologies = tech;
  if (tags) data.tags = tags;

  const project = await Project.findOneAndUpdate({ _id: id, userId: result.user._id }, data, { new: true });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await logActivity(result.user._id, "updated", "project", project.title);
  return NextResponse.json({ project: JSON.parse(JSON.stringify(project)) });
}

// Soft delete: move the project to Trash instead of removing it.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { id } = await params;
  const project = await Project.findOneAndUpdate(
    { _id: id, userId: result.user._id },
    { deleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await logActivity(result.user._id, "deleted", "project", project.title);
  return NextResponse.json({ success: true });
}