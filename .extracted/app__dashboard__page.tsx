"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { User, Code2, FolderKanban, Briefcase, Award, Sparkles, Palette, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ skills: 0, projects: 0, experience: 0, certificates: 0, customCards: 0 });
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
      fetch("/api/custom-cards").then((r) => r.json()),
    ]).then(([me, skills, projects, exp, certs, cards]) => {
      setUsername(me.user?.username || "");
      setFullName(me.user?.profile?.fullName || "");
      setStats({
        skills: skills.skills?.length || 0,
        projects: projects.projects?.length || 0,
        experience: exp.experiences?.length || 0,
        certificates: certs.certificates?.length || 0,
        customCards: cards.customCards?.length || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Skills", count: stats.skills, icon: Code2, href: "/dashboard/skills", color: "text-indigo-400" },
    { label: "Projects", count: stats.projects, icon: FolderKanban, href: "/dashboard/projects", color: "text-purple-400" },
    { label: "Experience", count: stats.experience, icon: Briefcase, href: "/dashboard/experience", color: "text-blue-400" },
    { label: "Certificates", count: stats.certificates, icon: Award, href: "/dashboard/certificates", color: "text-amber-400" },
    { label: "Custom Cards", count: stats.customCards, icon: Sparkles, href: "/dashboard/custom-cards", color: "text-pink-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-slate-400">Manage your portfolio content and preview your live site.</p>
      </div>

      <Card className="p-6 mb-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-300 mb-1">Your live portfolio</p>
            <p className="text-white font-mono text-lg">/portfolio/{username}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/layout" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition">
              <Palette size={16} /> Change Layout
            </Link>
            <a href={`/portfolio/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition">
              Preview <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="p-6 hover:bg-white/10 transition group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <c.icon size={24} className={`${c.color} mb-3`} />
                  <p className="text-2xl font-bold text-white">{c.count}</p>
                  <p className="text-sm text-slate-400">{c.label}</p>
                </div>
                <ArrowRight size={18} className="text-slate-600 group-hover:text-white transition" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-indigo-400" /> Quick Start
        </h2>
        <ol className="space-y-3 text-sm text-slate-400">
          <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold">1</span> Fill in your <Link href="/dashboard/profile" className="text-indigo-400 hover:underline">profile information</Link></li>
          <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold">2</span> Add your <Link href="/dashboard/skills" className="text-indigo-400 hover:underline">skills</Link>, <Link href="/dashboard/projects" className="text-indigo-400 hover:underline">projects</Link>, and <Link href="/dashboard/experience" className="text-indigo-400 hover:underline">experience</Link></li>
          <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold">3</span> Choose a <Link href="/dashboard/layout" className="text-indigo-400 hover:underline">layout template</Link> and preview your portfolio</li>
        </ol>
      </Card>
    </div>
  );
}
