import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidViewer } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import Profile from "@/models/Profile";

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const profile = await Profile.findOne({ userId: result.user._id });
  return NextResponse.json({ profile: profile ? JSON.parse(JSON.stringify(profile)) : null });
}

export async function PUT(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;
  const denied = forbidViewer(result.user);
  if (denied) return denied;

  const data = await req.json();
  const profile = await Profile.findOneAndUpdate(
    { userId: result.user._id },
    { $set: data },
    { new: true, upsert: true }
  );

  await logActivity(result.user._id, "updated", "profile", profile.fullName || "Profile");
  return NextResponse.json({ profile: JSON.parse(JSON.stringify(profile)) });
}

