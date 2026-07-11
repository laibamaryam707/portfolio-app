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

export async function GET(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "6", 10)));

  const query: Record<string, unknown> = { userId: result.user._id, deleted: { $ne: true } };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { technologies: { $regex: search, $options: "i" } },
    ];
  }
  if (category && category !== "all") query.category = category;
  if (status && status !== "all") query.status = status;
  if (featured === "true") query.featured = true;

  const total = await Project.countDocuments(query);
  const projects = await Project.find(query)
    .sort({ featured: -1, order: 1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return NextResponse.json({
    projects: JSON.parse(JSON.stringify(projects)),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
}

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const data = await req.json();
  const tech = normalizeList(data.technologies);
  const tags = normalizeList(data.tags);
  if (tech) data.technologies = tech;
  if (tags) data.tags = tags;

  const project = await Project.create({ ...data, userId: result.user._id });
  await logActivity(result.user._id, "created", "project", project.title);
  return NextResponse.json({ project: JSON.parse(JSON.stringify(project)) }, { status: 201 });
}