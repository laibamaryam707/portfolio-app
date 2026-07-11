import { connectDB } from "./db";
import User from "@/models/User";
import Profile from "@/models/Profile";
import Skill from "@/models/Skill";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Certificate from "@/models/Certificate";
import CustomCard from "@/models/CustomCard";
import type { PortfolioData } from "./types";

export async function getPortfolioByUsername(username: string): Promise<PortfolioData | null> {
  await connectDB();
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return null;

  const userId = user._id;
  const [profile, skills, projects, experiences, certificates, customCards] = await Promise.all([
    Profile.findOne({ userId }),
    Skill.find({ userId }).sort({ order: 1 }),
    Project.find({ userId }).sort({ order: 1 }),
    Experience.find({ userId }).sort({ order: 1 }),
    Certificate.find({ userId }).sort({ order: 1 }),
    CustomCard.find({ userId }).sort({ order: 1 }),
  ]);

  if (!profile) return null;

  return {
    username: user.username,
    profile: JSON.parse(JSON.stringify(profile)),
    skills: JSON.parse(JSON.stringify(skills)),
    projects: JSON.parse(JSON.stringify(projects)),
    experiences: JSON.parse(JSON.stringify(experiences)),
    certificates: JSON.parse(JSON.stringify(certificates)),
    customCards: JSON.parse(JSON.stringify(customCards)),
  };
}
