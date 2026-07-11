import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import Certificate from "@/models/Certificate";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const { id } = await params;
  const data = await req.json();
  const certificate = await Certificate.findOneAndUpdate({ _id: id, userId: result.user._id }, data, { new: true });
  if (!certificate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ certificate: JSON.parse(JSON.stringify(certificate)) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const { id } = await params;
  await Certificate.findOneAndDelete({ _id: id, userId: result.user._id });
  return NextResponse.json({ success: true });
}
