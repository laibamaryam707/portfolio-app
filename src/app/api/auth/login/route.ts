import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

// In-memory rate limiter — 5 attempts per IP per minute
const attempts = new Map<string, { count: number; time: number }>();

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const entry = attempts.get(ip);
    const withinWindow = entry && now - entry.time < 60000;

    if (withinWindow && entry!.count >= 5) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a minute." },
        { status: 429 }
      );
    }

    attempts.set(ip, {
      count: withinWindow ? entry!.count + 1 : 1,
      time: withinWindow ? entry!.time : now,
    });

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Reset attempts on successful login
    attempts.delete(ip);

    const token = await createToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}