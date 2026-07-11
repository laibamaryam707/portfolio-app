import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import CustomCard from "@/models/CustomCard";

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const customCards = await CustomCard.find({ userId: result.user._id }).sort({ order: 1 });
  return NextResponse.json({ customCards: JSON.parse(JSON.stringify(customCards)) });
}

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const data = await req.json();
  const customCard = await CustomCard.create({ ...data, userId: result.user._id });
  return NextResponse.json({ customCard: JSON.parse(JSON.stringify(customCard)) }, { status: 201 });
}
