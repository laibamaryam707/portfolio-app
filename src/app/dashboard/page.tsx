"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatCard from "@/components/dashboard/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import DonutChart, { type DonutSlice } from "@/components/charts/DonutChart";
import BarChart from "@/components/charts/BarChart";
import {
  Code2, FolderKanban, Layers, Star, Palette, ArrowRight,
  CheckCircle2, Clock, TrendingUp,
  Check,
} from "lucide-react";
import type { ActivityData, SkillData } from "@/lib/types";
import LineChart from "@/components/charts/LineChart";
// import SharePortfolio from "@/components/dashboard/SharePortfolio";
import RadialGauge from "@/components/charts/RadialGauge";
import CountUp from "@/components/dashboard/CountUp";
import NotificationBell from "@/components/dashboard/NotificationBell";

interface Analytics {
  totals: {
    skills: number;
    projects: number;
    categories: number;
    featured: number;
    completed: number;
    inProgress: number;
    avgLevel: number;
    totalContent?: number;
    memberSince?: string | null;
  };
  skillsByCategory: Record<string, number>;
  skillsByProficiency: Record<string, number>;
  projectsByCategory: Record<string, number>;
  projectsByMonth: { label: string; count: number }[];
  byType?: Record<string, number>;
}

const CATEGORY_COLORS = ["#bc28a1", "#345867", "#2409c0", "#8799b4", "#394767", "#4b8a92", "#64748b"];
const PROFICIENCY_COLORS: Record<string, string> = { Beginner: "#7fae76", Intermediate: "#4071bff5", Advanced: "#6f5975" };

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [topSkills, setTopSkills] = useState<SkillData[]>([]);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [profile, setProfile] = useState<Record<string, string> | null>(null);

const t = analytics?.totals;
const TYPE_COLORS: Record<string, string> = {
  Skills: "#0ea5e9", Projects: "#6366f1", Certificates: "#10b981", Experience: "#f59e0b",
};
const byType: Record<string, number> = analytics?.byType ?? {};
const totalContent = Object.values(byType).reduce((a, b) => a + b, 0);
const contentSlices: DonutSlice[] = Object.entries(byType)
  .filter(([, v]) => v > 0)
  .map(([label, value]) => ({ label, value, color: TYPE_COLORS[label] || "#64748b" }));
const PROFILE_CHECKLIST: { key: string; label: string; hint: string }[] = [
  { key: "fullName", label: "Full name", hint: "How visitors see you" },
  { key: "title", label: "Professional title", hint: "e.g. Full-Stack Developer" },
  { key: "tagline", label: "Tagline", hint: "One line that sums you up" },
  { key: "about", label: "About section", hint: "Your story in a paragraph" },
  { key: "avatar", label: "Profile photo", hint: "Adds a personal touch" },
  { key: "email", label: "Email", hint: "So people can reach you" },
  { key: "location", label: "Location", hint: "Where you're based" },
  { key: "linkedin", label: "LinkedIn", hint: "Boosts credibility" },
  { key: "github", label: "GitHub", hint: "Show your code" },
];

const isFilled = (key: string) => !!(profile?.[key] || "").trim();
const filledItems = PROFILE_CHECKLIST.filter((f) => isFilled(f.key));
const missingItems = PROFILE_CHECKLIST.filter((f) => !isFilled(f.key));
const completeness = Math.round((filledItems.length / PROFILE_CHECKLIST.length) * 100);
  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
      fetch("/api/activity?limit=6").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
    ]).then(([me, ana, act, sk]) => {
      setUsername(me.user?.username || "");
      setFullName(me.user?.profile?.fullName || "");
      setAnalytics(ana);
      setActivities(act.activities || []);
      const skills: SkillData[] = sk.skills || [];
      setTopSkills([...skills].sort((a, b) => b.level - a.level).slice(0, 5));
      setProfile(me.user?.profile || null);
    });
  }, []);
useEffect(() => {
  const safe = (p: Promise<Response>) =>
    p.then((r) => r.json()).catch(() => ({}));

  Promise.all([
    safe(fetch("/api/auth/me")),
    safe(fetch("/api/analytics")),
    safe(fetch("/api/activity?limit=6")),
    safe(fetch("/api/skills")),
  ]).then(([me, ana, act, sk]) => {
    setUsername(me.user?.username || "");
    setFullName(me.user?.profile?.fullName || "");
    setAnalytics(ana.totals ? ana : null);
    setActivities(act.activities || []);
    const skills: SkillData[] = sk.skills || [];
    setTopSkills([...skills].sort((a, b) => b.level - a.level).slice(0, 5));
  });
}, []);
  const projectCategorySlices: DonutSlice[] = analytics
    ? Object.entries(analytics.projectsByCategory).map(([label, value], i) => ({
        label, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))
    : [];

  const proficiencySlices: DonutSlice[] = analytics
    ? Object.entries(analytics.skillsByProficiency)
        .filter(([, v]) => v > 0)
        .map(([label, value]) => ({ label, value, color: PROFICIENCY_COLORS[label] || "#64748b" }))
    : [];

  return (
    <div className="min-h-screen p-6" style={{backgroundColor: '#0a192b'}}>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-white">Your portfolio analytics at a glance.</p>
      </div>

      {/* Live portfolio CTA */}
      <Card className="p-6 mb-8 bg-white/5 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white mb-1">Your live portfolio</p>
            <p className="text-white font-mono text-lg">/portfolio/{username}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/layout" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition">
              <Palette size={16} /> Change Layout
            </Link>
            <a href={`/portfolio/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm hover:bg-sky-400 transition">
              Preview <ArrowRight size={16} />
            </a>
            <NotificationBell />
          </div>
          
        </div>
      </Card>
{/* {username && <div className="mb-8"><SharePortfolio username={username} /></div>} */}
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Skills" value={t?.skills ?? 0} icon={Code2} color="text-sky-400" iconBg="bg-sky-500/15" />
        <StatCard label="Total Projects" value={t?.projects ?? 0} icon={FolderKanban} color="text-sky-400" iconBg="bg-sky-500/15" />
        <StatCard label="Categories" value={t?.categories ?? 0} icon={Layers} color="text-sky-400" iconBg="bg-sky-500/15" />
        <StatCard label="Featured" value={t?.featured ?? 0} icon={Star} color="text-sky-400" iconBg="bg-sky-500/15" />
      </div>
<div className="grid lg:grid-cols-2 gap-4 mb-8">
  {/* Profile completeness */}
 <Card className="p-6 mb-8">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
    <div>
      <h2 className="text-lg font-semibold text-white">Profile Completeness</h2>
      <p className="text-sm text-white/60 mt-1">
        {filledItems.length} of {PROFILE_CHECKLIST.length} sections done
        {missingItems.length > 0 && ` — ${missingItems.length} to go`}
      </p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold text-white"><CountUp value={completeness} />%</span>
      {completeness === 100 && <span className="text-sm text-emerald-400">Complete 🎉</span>}
    </div>
  </div>

  {/* progress bar */}
  <div className="w-full h-3 rounded-full bg-white/10 mb-6">
    <div className="h-3 rounded-full bg-sky-500 transition-all duration-700" style={{ width: `${completeness}%` }} />
  </div>

  {/* checklist */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
    {PROFILE_CHECKLIST.map((f) => {
      const done = isFilled(f.key);
      return (
        <div
          key={f.key}
          className={`flex items-start gap-2.5 rounded-xl border p-3 transition ${
            done ? "border-white/10 bg-white/5" : "border-sky-500/30 bg-sky-500/5"
          }`}
        >
          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
            done ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"
          }`}>
            {done ? <Check size={13} /> : <span className="w-1.5 h-1.5 rounded-full bg-white/40" />}
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-medium ${done ? "text-white/70 " : "text-white"}`}>{f.label}</p>
            {!done && <p className="text-xs text-white/50 mt-0.5">{f.hint}</p>}
          </div>
        </div>
      );
    })}
  </div>

  {missingItems.length > 0 && (
    <Link href="/dashboard/profile" className="inline-flex items-center gap-1 text-sm text-sky-300 hover:underline mt-5">
      Finish your profile <ArrowRight size={14} />
    </Link>
  )}
</Card>
  {/* User statistics — tiled */}
  <Card className="p-4">
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-lg font-semibold text-white">Content Statistics</h2>
    <div className="text-right">
      <p className="text-3xl font-bold text-white leading-none"><CountUp value={totalContent} /></p>
      <p className="text-xs text-white/60 mt-1">total items</p>
    </div>
  </div>

  {contentSlices.length ? (
    <DonutChart data={contentSlices} centerSub="items" />
  ) : (
    <p className="text-sm text-white/60 py-6 text-center">Add content to see the breakdown.</p>
  )}

  {/* number strip under the donut */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-5 border-t border-white/10">
    {Object.entries(byType).map(([label, value]) => {
      const pct = totalContent ? Math.round((value / totalContent) * 100) : 0;
      return (
        <div key={label} className="text-center">
          <p className="text-xl font-bold text-white"><CountUp value={value} /></p>
          <p className="text-[11px] text-white/60">{label}</p>
          <p className="text-[11px] text-sky-300 tabular-nums">{pct}%</p>
        </div>
      );
    })}
  </div>
</Card>
</div>
      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Projects by Category</h2>
          {projectCategorySlices.length ? (
            <DonutChart data={projectCategorySlices} centerSub="projects" />
          ) : (
            <p className="text-sm text-white py-8 text-center">Add projects to see this chart.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Skill Proficiency</h2>
          {proficiencySlices.length ? (
            <DonutChart data={proficiencySlices} centerSub="skills" />
          ) : (
            <p className="text-sm text-white py-8 text-center">Add skills to see this chart.</p>
          )}
        </Card>
      </div>

      {/* Monthly additions + status */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Projects Added (last 6 months)</h2>
          </div>
          {analytics ? (
            <BarChart data={analytics.projectsByMonth.map(item => ({ ...item, value: item.count }))} />
          ) : (
            <p className="text-sm text-white py-8 text-center">Loading…</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Project Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2 text-white"><CheckCircle2 size={15} className="text-sky-400" /> Completed</span>
                <span className="text-white">{t?.completed ?? 0}</span>
              </div>
              <ProgressBar value={t && t.projects ? (t.completed / t.projects) * 100 : 0} color="bg-sky-500" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2 text-white"><Clock size={15} className="text-sky-400" /> In Progress</span>
                <span className="text-white">{t?.inProgress ?? 0}</span>
              </div>
              <ProgressBar value={t && t.projects ? (t.inProgress / t.projects) * 100 : 0} color="bg-sky-400" />
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-white">Avg. skill level</span>
                <span className="text-white">{t?.avgLevel ?? 0}%</span>
              </div>
              <ProgressBar value={t?.avgLevel ?? 0} color="bg-sky-500" />
            </div>
          </div>
        </Card>
        
      </div>
{/* More data */}
<div className="grid lg:grid-cols-1 gap-4 mb-8">
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-white mb-5">Project Growth Trend</h2>
    {analytics ? (
      <LineChart data={analytics.projectsByMonth.map((m) => ({ label: m.label, value: m.count }))} />
    ) : (
      <p className="text-sm text-white py-8 text-center">Loading…</p>
    )}
  </Card>

 
</div>

<div className="grid sm:grid-cols-2 gap-4 mb-8">
  <Card className="p-6 flex flex-col items-center">
    <h2 className="text-lg font-semibold text-white mb-2 self-start">Completion Rate</h2>
    <RadialGauge
      value={t && t.projects ? Math.round((t.completed / t.projects) * 100) : 0}
      label="of projects completed"
      color="#059669"
    />
  </Card>

  <Card className="p-6 flex flex-col items-center">
    <h2 className="text-lg font-semibold text-white mb-2 self-start">Avg. Skill Level</h2>
    <RadialGauge value={t?.avgLevel ?? 0} label="across all skills" color="#4f46e5" />
  </Card>
</div>
      {/* Top skills + recent activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Top Skills</h2>
          {topSkills.length ? (
            <div className="space-y-4">
              {topSkills.map((s) => (
                <div key={s._id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-2 text-white">
                      {s.icon && <span>{s.icon}</span>} {s.name}
                    </span>
                    <span className="text-white">{s.level}%</span>
                  </div>
                  <ProgressBar value={s.level} color="bg-sky-500" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white py-6 text-center">No skills yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link href="/dashboard/activity" className="text-sm text-sky-300 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ActivityFeed items={activities} />
        </Card>
      </div>
    </div>
  );
}