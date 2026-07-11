"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Search, Plus, Pencil, Trash2, Star, ChevronLeft, ChevronRight,
  ExternalLink, Copy, CheckCircle2, Clock,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ImagePicker from "@/components/ui/ImagePicker";
import { useIsViewer } from "@/components/dashboard/DashboardContent";
import { PROJECT_CATEGORIES, PROJECT_STATUSES, type ProjectData } from "@/lib/types";
import toast from "react-hot-toast";

interface Pagination { page: number; limit: number; total: number; totalPages: number; }

const emptyForm = {
  title: "", description: "", image: "", technologies: "", tags: "",
  category: "Web App", status: "Completed", featured: false, liveUrl: "", githubUrl: "",
};

const controlCls =
  "rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-white focus:border-graphite focus:outline-none focus:ring-2 focus:ring-graphite/15 transition";
const inputCls = `${controlCls} w-full`;

export default function ProjectsPage() {
  const isViewer = useIsViewer();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 6, total: 0, totalPages: 1 });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectData | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (status !== "all") params.set("status", status);
    if (featuredOnly) params.set("featured", "true");
    params.set("page", String(page));
    params.set("limit", String(limit));
    fetch(`/api/projects?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.projects || []);
        if (d.pagination) setPagination(d.pagination);
      });
  }, [search, category, status, featuredOnly, page, limit]);

  useEffect(() => {
    const t = setTimeout(refresh, 250);
    return () => clearTimeout(t);
  }, [refresh]);

  // Reset to page 1 when filters change (render-phase, not an effect).
  const filterKey = `${search}|${category}|${status}|${featuredOnly}|${limit}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setOpen(true); };

  const openEdit = (p: ProjectData) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, image: p.image,
      technologies: (p.technologies || []).join(", "),
      tags: (p.tags || []).join(", "),
      category: p.category || "Web App", status: p.status || "Completed",
      featured: !!p.featured, liveUrl: p.liveUrl, githubUrl: p.githubUrl,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/projects/${editing._id}` : "/api/projects";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't save your changes");
      }
      toast.success(editing ? "Changes saved" : "Project added");
      setOpen(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Move this project to Trash? You can restore it later.")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't delete that");
      }
      toast.success("Moved to Trash");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete that");
    }
  };

  // NEW: toggle featured inline (quick PUT).
  const toggleFeatured = async (p: ProjectData) => {
    try {
      const res = await fetch(`/api/projects/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't update");
      }
      toast.success(p.featured ? "Removed from featured" : "Marked as featured");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update");
    }
  };

  // NEW: duplicate a project (clone via POST).
  const duplicate = async (p: ProjectData) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${p.title} (copy)`,
          description: p.description,
          image: p.image,
          technologies: p.technologies || [],
          tags: p.tags || [],
          category: p.category,
          status: p.status,
          featured: false,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't duplicate");
      }
      toast.success("Project duplicated");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't duplicate");
    }
  };

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

useEffect(() => {
  fetch("/api/categories")
    .then((r) => r.json())
    .then((d) => setCategories(d.categories || []));
}, []);

// Live category names, with the hardcoded list as a fallback
const categoryNames = Array.from(
  new Set([
    ...(categories.length ? categories.map((c) => c.name) : PROJECT_CATEGORIES),
    ...(editing?.category ? [editing.category] : []),
  ])
);
  return (
    <div className="min-h-screen p-6" style={{backgroundColor: '#0a192b'}}>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white font-display tracking-tight">Projects</h1>
          <p className="text-sm text-white/60 mt-1">Everything in your portfolio&apos;s work section.</p>
        </div>
        {!isViewer && (
          <Button onClick={openCreate} size="sm"><Plus size={16} /> Add new</Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, tags or tech" className={`${inputCls} pl-9`} />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={controlCls}>
          <option value="all">All categories</option>
          {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={controlCls}>
          <option value="all">All statuses</option>
          {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={() => setFeaturedOnly((v) => !v)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition border ${
            featuredOnly ? "bg-peach text-peach-fg border-peach-fg/20" : "bg-surface text-white/60 border-line hover:text-white"
          }`}
        >
          <Star size={15} className={featuredOnly ? "fill-peach-fg" : ""} /> Featured
        </button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-white/60">No projects match your filters.</p>
          {!isViewer && <Button onClick={openCreate} className="mt-4" size="sm"><Plus size={16} /> Add your first project</Button>}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p._id} className="overflow-hidden flex flex-col transition hover:shadow-card-hover">
              <div className="relative aspect-video bg-surface-2">
                {p.image ? (
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">No image</div>
                )}
                {!isViewer && (
                  <button
                    onClick={() => toggleFeatured(p)}
                    title={p.featured ? "Remove from featured" : "Mark as featured"}
                    className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition ${
                      p.featured ? "bg-peach text-peach-fg" : "bg-surface/90 text-white/60 hover:text-peach-fg"
                    }`}
                  >
                    <Star size={12} className={p.featured ? "fill-peach-fg" : ""} /> Featured
                  </button>
                )}
                {isViewer && p.featured && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-peach text-peach-fg text-xs font-semibold">
                    <Star size={12} className="fill-peach-fg" /> Featured
                  </span>
                )}
                <span
                  className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                    p.status === "Completed" ? "bg-mint text-mint-fg" : "bg-sky text-sky-fg"
                  }`}
                >
                  {p.status === "Completed" ? <CheckCircle2 size={12} /> : <Clock size={12} />} {p.status}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-lavender text-lavender-fg">{p.category}</span>
                </div>
                <h3 className="text-white font-semibold">{p.title}</h3>
                <p className="text-sm text-white mt-1 line-clamp-2 flex-1">{p.description}</p>

                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.tags.map((tg) => (
                      <span key={tg} className="text-xs px-2 py-0.5 rounded bg-surface-2 text-white">#{tg}</span>
                    ))}
                  </div>
                )}
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.technologies.map((tc) => (
                      <span key={tc} className="text-xs px-2 py-0.5 rounded bg-surface-2 text-white">{tc}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
                  <div className="flex gap-2">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-mint-fg transition" title="Live">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  {!isViewer && (
                    <div className="flex gap-1">
                      <button onClick={() => duplicate(p)} className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-surface-2 transition" title="Duplicate">
                        <Copy size={15} />
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-surface-2 transition" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-white/60 hover:text-rose-fg rounded-lg hover:bg-rose transition" title="Move to Trash">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>Rows per page</span>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-lg border border-line bg-surface px-2 py-1 text-white focus:border-graphite focus:outline-none">
            {[3, 6, 9, 12].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="ml-2 tabular-nums">
            {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
            –{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line bg-surface text-sm text-white hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-sm text-white px-2 tabular-nums">Page {pagination.page} / {pagination.totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={pagination.page >= pagination.totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line bg-surface text-sm text-white hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit project" : "Add project"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Title</label>
            <input value={String(form.title ?? "")} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My awesome project" className={inputCls} required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Description</label>
            <textarea value={String(form.description ?? "")} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
          </div>

          <ImagePicker label="Project image" value={String(form.image ?? "")} onChange={(v) => setForm({ ...form, image: v })} aspect="wide" />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Category</label>
             <select
  value={String(form.category ?? "")}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  className={inputCls}
>
  {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
</select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Status</label>
              <select value={String(form.status ?? "")} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Technologies (comma separated)</label>
            <input value={String(form.technologies ?? "")} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Tags (comma separated)</label>
            <input value={String(form.tags ?? "")} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="fullstack, dashboard, saas" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Live URL</label>
              <input type="url" value={String(form.liveUrl ?? "")} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">GitHub URL</label>
              <input type="url" value={String(form.githubUrl ?? "")} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-white cursor-pointer">
            <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded accent-graphite-deep w-4 h-4" />
            <Star size={15} className="text-peach-fg" /> Mark as featured
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving…" : editing ? "Save changes" : "Create"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
    
  );
}