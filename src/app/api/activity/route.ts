import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import ActivityLog from "@/models/ActivityLog";

export async function GET(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

  const activities = await ActivityLog.find({ userId: result.user._id })
    .sort({ createdAt: -1 })
    .limit(limit);

  return NextResponse.json({ activities: JSON.parse(JSON.stringify(activities)) });
}