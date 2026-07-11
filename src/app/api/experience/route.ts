import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import Experience from "@/models/Experience";

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const experiences = await Experience.find({ userId: result.user._id }).sort({ order: 1 });
  return NextResponse.json({ experiences: JSON.parse(JSON.stringify(experiences)) });
}

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const data = await req.json();
  const experience = await Experience.create({ ...data, userId: result.user._id });
  return NextResponse.json({ experience: JSON.parse(JSON.stringify(experience)) }, { status: 201 });
}
