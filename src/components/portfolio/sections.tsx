"use client";

import { motion } from "framer-motion";
import {
  Code2, Link2, Share2, Globe, Mail, Phone, MapPin,
  ExternalLink, Send, Award, Briefcase,
} from "lucide-react";
import type { PortfolioData } from "@/lib/types";

export interface Theme {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  accentLight: string;
  card: string;
  border: string;
  gradient: string;
  heroOverlay: string;
}

interface SectionProps {
  data: PortfolioData;
  theme: Theme;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function HeroSection({ data, theme }: SectionProps) {
  const { profile } = data;
  const avatar = profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || "User")}&size=400&background=6366f1&color=fff`;

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${theme.bg}`}>
      {profile.heroImage && (
        <div className="absolute inset-0">
    <img
  src={profile.heroImage}
  className="absolute inset-0 w-full h-full object-cover"
/>
          <div className={`absolute inset-0 opacity-80 ${theme.heroOverlay}`} />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            {profile.availableForWork && (
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${theme.accentLight}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Work
              </span>
            )}
            <h1 className={`text-5xl md:text-7xl font-bold mb-4 ${theme.text}`}>
              {profile.fullName || "Your Name"}
            </h1>
            <p className={`text-xl md:text-2xl font-medium mb-2 ${theme.accent}`}>
              {profile.title || "Your Title"}
            </p>
            <p className={`text-lg mb-8 max-w-lg ${theme.muted}`}>
              {profile.tagline || "A passionate professional crafting beautiful experiences."}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className={`px-6 py-3 rounded-xl font-medium transition ${theme.accentLight} hover:scale-105`}>
                View Projects
              </a>
              <a href="#contact" className={`px-6 py-3 rounded-xl font-medium border transition hover:scale-105 ${theme.border} ${theme.muted}`}>
                Get in Touch
              </a>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex justify-center">
            <div className="relative">
              <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${theme.gradient} opacity-30 blur-2xl`} />
              <img
                src={avatar}
                alt={profile.fullName}
                className={`relative w-72 h-72 md:w-80 md:h-80 rounded-3xl object-cover border-2 ${theme.border}`}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection({ data, theme }: SectionProps) {
  const { profile } = data;
  if (!profile.about) return null;

  return (
    <section id="about" className={`py-24 ${theme.bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className={`text-2xl font-semibold tracking-widest uppercase ${theme.accent}`}>About Me</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-3 ${theme.text}`}>Professional Summary</h2>
        </motion.div>

        <motion.div {...fadeUp} className={`max-w-3xl mx-auto text-center text-xl leading-relaxed ${theme.muted}`}>
          {profile.about}
        </motion.div>

        {profile.stats && profile.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {profile.stats.map((stat, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl text-center ${theme.card} border ${theme.border}`}
              >
                <div className={`text-3xl font-bold ${theme.accent}`}>{stat.value}+</div>
                <div className={`text-sm mt-1 ${theme.muted}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function SkillsSection({ data, theme }: SectionProps) {
  const skills = data.skills.filter((s) => s.category === "skill");
  const tech = data.skills.filter((s) => s.category === "technology");
  const tools = data.skills.filter((s) => s.category === "tool");

  if (skills.length === 0 && tech.length === 0 && tools.length === 0) return null;

  const groups = [
    { title: "Skills", items: skills, icon: Code2 },
    { title: "Technologies", items: tech, icon: Globe },
    { title: "Tools", items: tools, icon: Briefcase },
  ].filter((g) => g.items.length > 0);

  return (
    <section id="skills" className={`py-24 ${theme.bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className={`text-2xl font-semibold tracking-widest uppercase ${theme.accent}`}>Expertise</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-3 ${theme.text}`}>Skills & Tech</h2>
        </motion.div>

        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] justify-center">
          {groups.map((group, gi) => (
            <motion.div key={group.title} {...fadeUp} transition={{ delay: gi * 0.15 }} className={`p-6 rounded-2xl border ${theme.card} ${theme.border}`}>
              <div className="flex items-center gap-3 mb-6">
                <group.icon size={22} className={theme.accent} />
                <h3 className={`text-xl font-semibold ${theme.text}`}>{group.title}</h3>
              </div>
              <div className="space-y-3">
                {group.items.map((skill) => (
                  <div key={skill._id}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-medium ${theme.text}`}>{skill.name}</span>
                      <span className={`text-xs ${theme.muted}`}>{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection({ data, theme }: SectionProps) {
  if (data.projects.length === 0) return null;

  return (
    <section id="projects" className={`py-24 ${theme.bg}`}>
      <div className="max-w-12xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className={`text-2xl font-semibold tracking-widest uppercase ${theme.accent}`}>Portfolio</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-3 ${theme.text}`}>Featured Projects</h2>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,400px))] justify-center gap-6">
          {[...data.projects].sort((a, b) => Number(b.featured) - Number(a.featured)).map((project, i) => (
            <motion.div
              key={project._id}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`group rounded-2xl border overflow-hidden transition hover:scale-[1.02] ${theme.card} ${theme.border}`}
            >
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${theme.gradient} opacity-20`}>
                    <Code2 size={48} className={theme.muted} />
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-400 text-amber-950 text-xs font-semibold shadow">
                    ★ Featured
                  </span>
                )}
                {project.status && (
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium shadow ${
                    project.status === "In Progress" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"
                  }`}>
                    {project.status}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>{project.title}</h3>
                <p className={`text-sm mb-4 line-clamp-2 ${theme.muted}`}>{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((t) => (
                      <span key={t} className={`px-2 py-0.5 text-xs rounded-md ${theme.accentLight}`}>{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 text-sm ${theme.accent} hover:underline`}>
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 text-sm ${theme.muted} hover:underline`}>
                      <Code2 size={14} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection({ data, theme }: SectionProps) {
  if (data.experiences.length === 0) return null;

  return (
    <section id="experience" className={`py-24 ${theme.bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className={`text-2xl font-semibold tracking-widest uppercase ${theme.accent}`}>Career</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-3 ${theme.text}`}>Experience</h2>
        </motion.div>

        <div className="space-y-6 max-w-7xl mx-auto">
          {data.experiences.map((exp, i) => (
            <motion.div
              key={exp._id}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${theme.card} ${theme.border}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text}`}>{exp.title}</h3>
                  <p className={theme.accent}>{exp.company}</p>
                </div>
                <span className={`text-lg px-3 py-1 rounded-full ${theme.accentLight}`}>
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${theme.muted}`}>{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CertificatesSection({ data, theme }: SectionProps) {
  if (data.certificates.length === 0) return null;

  return (
    <section id="certificates" className={`py-24 ${theme.bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className={`text-2xl font-semibold tracking-widest uppercase ${theme.accent}`}>Achievements</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-3 ${theme.text}`}>Certificates</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.certificates.map((cert, i) => (
            <motion.a
              key={cert._id}
              href={cert.url || "#"}
              target={cert.url ? "_blank" : undefined}
              rel="noopener noreferrer"
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${theme.card} ${theme.border}`}
            >
              <Award size={32} className={`mb-4 ${theme.accent}`} />
              <h3 className={`font-semibold mb-1 ${theme.text}`}>{cert.title}</h3>
              <p className={`text-sm ${theme.muted}`}>{cert.issuer}</p>
              {cert.date && <p className={`text-xs mt-2 ${theme.muted}`}>{cert.date}</p>}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomCardsSection({ data, theme }: SectionProps) {
  if (data.customCards.length === 0) return null;

  return (
    <section className={`py-24 ${theme.bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.text}`}>More About Me</h2>
        </motion.div>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] justify-center">
          {data.customCards.map((card, i) => (
            <motion.div
              key={card._id}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border text-center ${theme.card} ${theme.border}`}
            >
              <span className="text-4xl mb-4 block">{card.icon || "✨"}</span>
              <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>{card.title}</h3>
              <p className={`text-lg ${theme.muted}`}>{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ data, theme }: SectionProps) {
  const { profile } = data;

  return (
    <section id="contact" className={`py-24 ${theme.bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className={`text-2xl font-semibold tracking-widest uppercase ${theme.accent}`}>Get in Touch</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-3 ${theme.text}`}>Let&apos;s Work Together</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="space-y-6">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className={`flex items-center gap-3 ${theme.muted} hover:${theme.accent}`}>
                <Mail size={20} className={theme.accent} /> {profile.email}
              </a>
            )}
            {profile.phone && (
              <p className={`flex items-center gap-3 ${theme.muted}`}>
                <Phone size={20} className={theme.accent} /> {profile.phone}
              </p>
            )}
            {profile.location && (
              <p className={`flex items-center gap-3 ${theme.muted}`}>
                <MapPin size={20} className={theme.accent} /> {profile.location}
              </p>
            )}
          </motion.div>

          <motion.form
            {...fadeUp}
            onSubmit={(e) => { e.preventDefault(); alert("Message sent! (Demo - connect to your email service)"); }}
            className={`p-6 rounded-2xl border space-y-4 ${theme.card} ${theme.border}`}
          >
            <input type="text" placeholder="Name" required className={`w-full px-4 py-3 rounded-xl border bg-transparent ${theme.border} ${theme.text} placeholder:${theme.muted}`} />
            <input type="email" placeholder="Email" required className={`w-full px-4 py-3 rounded-xl border bg-transparent ${theme.border} ${theme.text}`} />
            <textarea placeholder="Message" rows={4} required className={`w-full px-4 py-3 rounded-xl border bg-transparent resize-none ${theme.border} ${theme.text}`} />
            <button type="submit" className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r ${theme.gradient} text-white hover:opacity-90 transition`}>
              <Send size={18} /> Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export function FooterSection({ data, theme }: SectionProps) {
  const { profile } = data;
  const socials = [
    { icon: Code2, href: profile.github, label: "GitHub" },
    { icon: Link2, href: profile.linkedin, label: "LinkedIn" },
    { icon: Share2, href: profile.twitter, label: "Twitter" },
    { icon: Globe, href: profile.website, label: "Website" },
  ].filter((s) => s.href);

  return (
    <footer className={`py-12 border-t ${theme.border} ${theme.bg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className={`font-semibold ${theme.text}`}>{profile.fullName}</p>
            <p className={`text-sm ${theme.muted}`}>{profile.title}</p>
          </div>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition hover:scale-110 ${theme.accentLight}`}>
                <s.icon size={20} />
              </a>
            ))}
          </div>
          <p className={`text-sm ${theme.muted}`}>
            © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function NavBar({ data, theme }: SectionProps) {
  const links = ["About", "Skills", "Projects", "Experience", "Contact"].map((l) => ({
    label: l,
    href: `#${l.toLowerCase()}`,
  }));

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${theme.border} ${theme.card}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className={`font-bold text-lg ${theme.text}`}>
          {data.profile.fullName?.split(" ")[0] || "Portfolio"}
        </a>
        <div className="hidden md:flex gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`text-sm transition hover:opacity-80 ${theme.muted}`}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
