import { NextResponse } from "next/server";
import { getSession } from "./auth";
import { connectDB } from "./db";
import User from "@/models/User";

export async function requireAuth() {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
  return { user };
}

/**
 * Returns a 403 response if the user is a viewer (read-only role), otherwise null.
 * Call this at the top of any write handler (POST/PUT/PATCH/DELETE).
 */
export function forbidViewer(user: { role?: string }) {
  if (user?.role === "viewer") {
    return NextResponse.json(
      { error: "Your account has read-only (Viewer) access." },
      { status: 403 }
    );
  }
  return null;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}