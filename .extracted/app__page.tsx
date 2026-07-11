import Link from "next/link";
import { ArrowRight, Layout, Palette, Zap, Shield } from "lucide-react";
import Button from "@/components/ui/Button";

const features = [
  { icon: Layout, title: "5 Beautiful Layouts", desc: "Choose from modern, minimal, creative, professional, and developer themes." },
  { icon: Palette, title: "Easy Customization", desc: "Manage profile, skills, projects, experience, and more from a simple dashboard." },
  { icon: Zap, title: "Live in Minutes", desc: "Register, fill in your details, pick a layout, and share your portfolio link." },
  { icon: Shield, title: "Secure Auth", desc: "Your data is protected with secure authentication and your own private dashboard." },
];

const layouts = [
  { name: "Modern Dark", gradient: "from-slate-900 via-purple-950 to-slate-900" },
  { name: "Clean Minimal", gradient: "from-stone-100 to-stone-200" },
  { name: "Bold Creative", gradient: "from-rose-500 via-fuchsia-500 to-indigo-600" },
  { name: "Professional", gradient: "from-slate-800 to-blue-900" },
  { name: "Developer", gradient: "from-gray-950 to-emerald-950" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />

      <nav className="relative max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="text-xl font-bold">
          Portfolio<span className="text-indigo-400">Hub</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">Sign In</Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
          <Zap size={14} /> Build your portfolio in minutes
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Create a stunning<br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            portfolio website
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          A simple portfolio builder with beautiful layouts. Add your info, pick a template,
          and share your personal site — no coding required.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg">
              Start Building <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">Sign In</Button>
          </Link>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">5 Portfolio Layouts</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {layouts.map((l) => (
            <div key={l.name} className="group">
              <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${l.gradient} border border-white/10 group-hover:scale-105 transition duration-300`} />
              <p className="text-sm text-slate-400 text-center mt-3">{l.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <f.icon size={28} className="text-indigo-400 mb-4" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24 text-center">
        <div className="p-12 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
          <h2 className="text-3xl font-bold mb-4">Ready to showcase your work?</h2>
          <p className="text-slate-400 mb-8">Join now and get your portfolio live in minutes.</p>
          <Link href="/register">
            <Button size="lg">Create Your Portfolio <ArrowRight size={18} /></Button>
          </Link>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} PortfolioHub. Built for creators.
      </footer>
    </div>
  );
}
