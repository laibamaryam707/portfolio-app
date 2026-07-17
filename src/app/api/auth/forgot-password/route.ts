import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return success — never reveal if email exists
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await user.save();

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

  return NextResponse.json({
    success: true,
    devResetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
    // Remove devResetUrl in production — for demo purposes only
  });
}