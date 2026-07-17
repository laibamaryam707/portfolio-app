import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json({ error: "Reset link is invalid or has expired" }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return NextResponse.json({ success: true });
}