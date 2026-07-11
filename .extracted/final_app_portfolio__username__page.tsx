import { notFound } from "next/navigation";
import { getPortfolioByUsername } from "@/lib/portfolio";
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolioByUsername(username);
  if (!portfolio) return { title: "Portfolio Not Found" };
  return {
    title: `${portfolio.profile.fullName || username} | Portfolio`,
    description: portfolio.profile.tagline || portfolio.profile.about?.slice(0, 160),
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const portfolio = await getPortfolioByUsername(username);
  if (!portfolio) notFound();

  return <PortfolioRenderer data={portfolio} />;
}
