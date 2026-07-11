import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import Experience from "@/models/Experience";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const { id } = await params;
  const data = await req.json();
  const experience = await Experience.findOneAndUpdate({ _id: id, userId: result.user._id }, data, { new: true });
  if (!experience) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ experience: JSON.parse(JSON.stringify(experience)) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const { id } = await params;
  await Experience.findOneAndDelete({ _id: id, userId: result.user._id });
  return NextResponse.json({ success: true });
}
