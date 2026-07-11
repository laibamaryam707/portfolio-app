import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";
import Profile from "@/models/Profile";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, fullName } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Email, password, and username are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (cleanUsername.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ $or: [{ email }, { username: cleanUsername }] });
    if (existing) {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ email, password: hashed, username: cleanUsername });
    await Profile.create({ userId: user._id, fullName: fullName || "", email });

    const token = await createToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
