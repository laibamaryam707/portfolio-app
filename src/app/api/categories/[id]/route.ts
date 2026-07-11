import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidViewer } from "@/lib/api-helpers";
import Category from "@/models/Category";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { id } = await params;
  const data = await req.json();
  const category = await Category.findOneAndUpdate({ _id: id, userId: result.user._id }, data, { new: true });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category: JSON.parse(JSON.stringify(category)) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const { id } = await params;
  const category = await Category.findOneAndDelete({ _id: id, userId: result.user._id });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}