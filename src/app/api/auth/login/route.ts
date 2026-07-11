import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
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

    const token = await createToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
