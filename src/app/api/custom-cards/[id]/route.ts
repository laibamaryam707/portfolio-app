import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import CustomCard from "@/models/CustomCard";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const { id } = await params;
  const data = await req.json();
  const customCard = await CustomCard.findOneAndUpdate({ _id: id, userId: result.user._id }, data, { new: true });
  if (!customCard) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ customCard: JSON.parse(JSON.stringify(customCard)) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const { id } = await params;
  await CustomCard.findOneAndDelete({ _id: id, userId: result.user._id });
  return NextResponse.json({ success: true });
}
