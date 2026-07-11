import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import Profile from "@/models/Profile";

export async function GET() {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const profile = await Profile.findOne({ userId: result.user._id });

  return NextResponse.json({
    user: {
      id: result.user._id,
      email: result.user.email,
      username: result.user.username,
      role: result.user.role || "admin",
      profile: profile ? JSON.parse(JSON.stringify(profile)) : null,
    },
  });
}