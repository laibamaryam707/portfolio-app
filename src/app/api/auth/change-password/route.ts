import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if ("error" in result) return result.error;

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both fields are required" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
  }

  const user = await User.findById(result.user._id);
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await logActivity(result.user._id, "updated", "profile", "Password changed");

  return NextResponse.json({ success: true });
}