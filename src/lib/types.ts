export type LayoutType = "modern" | "minimal" | "creative" | "professional" | "developer";

export interface ProfileData {
  fullName: string;
  title: string;
  tagline: string;
  about: string;
  avatar: string;
  heroImage: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  layout: LayoutType;
  availableForWork: boolean;
  stats: { label: string; value: string }[];
}

export type Proficiency = "Beginner" | "Intermediate" | "Advanced";
export type ProjectStatus = "Completed" | "In Progress";

export interface SkillData {
  _id: string;
  name: string;
  category: "skill" | "technology" | "tool";
  level: number;
  proficiency: Proficiency;
  icon: string;
  deleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
}

export interface ProjectData {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  tags: string[];
  category: string;
  status: ProjectStatus;
  featured: boolean;
  liveUrl: string;
  githubUrl: string;
  deleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
}

export interface ActivityData {
  _id: string;
  action: "created" | "updated" | "deleted" | "restored" | "purged";
  entityType: "skill" | "project" | "profile";
  entityName: string;
  createdAt: string;
}

export const PROFICIENCY_LEVELS: Proficiency[] = ["Beginner", "Intermediate", "Advanced"];
export const PROJECT_STATUSES: ProjectStatus[] = ["Completed", "In Progress"];
export const PROJECT_CATEGORIES: string[] = [
  "Web App",
  "Mobile App",
  "API / Backend",
  "UI / Design",
  "Open Source",
  "Machine Learning",
  "Other",
];

// Maps a proficiency label to a default progress-bar value (0-100).
export const PROFICIENCY_TO_LEVEL: Record<Proficiency, number> = {
  Beginner: 40,
  Intermediate: 70,
  Advanced: 95,
};

export interface ExperienceData {
  _id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface CertificateData {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  image: string;
}

export interface CustomCardData {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface PortfolioData {
  username: string;
  profile: ProfileData;
  skills: SkillData[];
  projects: ProjectData[];
  experiences: ExperienceData[];
  certificates: CertificateData[];
  customCards: CustomCardData[];
}

export const LAYOUTS: { id: LayoutType; name: string; description: string; preview: string }[] = [
  { id: "modern", name: "Modern Dark", description: "Sleek dark theme with gradient accents", preview: "from-slate-900 via-purple-950 to-slate-900" },
  { id: "minimal", name: "Clean Minimal", description: "Elegant light design with refined typography", preview: "from-stone-50 to-stone-100" },
  { id: "creative", name: "Bold Creative", description: "Vibrant colors and dynamic layouts", preview: "from-rose-500 via-fuchsia-500 to-indigo-600" },
  { id: "professional", name: "Professional", description: "Corporate polish for career-focused portfolios", preview: "from-slate-800 to-blue-900" },
  { id: "developer", name: "Developer", description: "Code-inspired aesthetic with terminal vibes", preview: "from-gray-950 to-emerald-950" },
];

export const DEFAULT_PROFILE: ProfileData = {
  fullName: "",
  title: "",
  tagline: "",
  about: "",
  avatar: "",
  heroImage: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  twitter: "",
  website: "",
  layout: "modern",
  availableForWork: true,
  stats: [
    { label: "Years Experience", value: "0" },
    { label: "Projects Built", value: "0" },
    { label: "Happy Clients", value: "0" },
    { label: "Certificates", value: "0" },
  ],
};