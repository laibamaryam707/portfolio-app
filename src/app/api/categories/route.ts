import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidViewer } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import Category from "@/models/Category";

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const categories = await Category.find({ userId: result.user._id }).sort({ name: 1 });
  return NextResponse.json({ categories: JSON.parse(JSON.stringify(categories)) });
}

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const data = await req.json();
  const category = await Category.create({ ...data, userId: result.user._id });
  await logActivity(result.user._id, "created", "project", `Category: ${category.name}`);
  return NextResponse.json({ category: JSON.parse(JSON.stringify(category)) }, { status: 201 });
}