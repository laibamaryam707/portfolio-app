import { NextResponse } from "next/server";
import { getPortfolioByUsername } from "@/lib/portfolio";

export async function GET(_req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const portfolio = await getPortfolioByUsername(username);
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }
  return NextResponse.json({ portfolio });
}
