import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import Certificate from "@/models/Certificate";

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const certificates = await Certificate.find({ userId: result.user._id }).sort({ order: 1 });
  return NextResponse.json({ certificates: JSON.parse(JSON.stringify(certificates)) });
}

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const data = await req.json();
  const certificate = await Certificate.create({ ...data, userId: result.user._id });
  return NextResponse.json({ certificate: JSON.parse(JSON.stringify(certificate)) }, { status: 201 });
}
