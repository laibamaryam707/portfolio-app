"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useIsViewer } from "@/components/dashboard/DashboardContent";
import toast from "react-hot-toast";

interface Category { _id: string; name: string; color: string; }

const SWATCHES = ["#0ea5e9", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#14b8a6"];

export default function CategoriesPage() {
  const isViewer = useIsViewer();
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", color: "#0ea5e9" });
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
    fetch("/api/analytics").then((r) => r.json()).then((d) => setCounts(d.projectsByCategory || {}));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const openCreate = () => { setEditing(null); setForm({ name: "", color: "#0ea5e9" }); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, color: c.color }); setOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/categories/${editing._id}` : "/api/categories";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't save");
      }
      toast.success(editing ? "Category updated" : "Category created");
      setOpen(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Projects keep their current category name.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Category deleted");
      refresh();
    } catch {
      toast.error("Couldn't delete that");
    }
  };
const countsLower: Record<string, number> = {};
Object.entries(counts).forEach(([k, v]) => {
  countsLower[k.toLowerCase()] = (countsLower[k.toLowerCase()] || 0) + v;
});
  const visible = categories
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => {
      const used = (counts[c.name] || 0) > 0;
      return filter === "all" ? true : filter === "used" ? used : !used;
    });

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-white/70 text-sm mt-1">Organize your projects. Used by the project category filter.</p>
        </div>
        {!isViewer && <Button onClick={openCreate} size="sm"><Plus size={16} /> Add new</Button>}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-sky-500 focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "used" | "unused")}
          className="rounded-xl border border-white/10 bg-[#1f3048] px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
        >
          <option value="all">All categories</option>
          <option value="used">In use</option>
          <option value="unused">Unused</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-white/70">No categories match. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map((c) => (
            <div key={c._id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" style={{ backgroundColor: `${c.color}26` }}>
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }} />
                </span>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{c.name}</p>
                  <p className="text-xs text-white/50 flex items-center gap-1">
                    <FolderKanban size={11} /> {countsLower[c.name.toLowerCase()] || 0} project{(countsLower[c.name.toLowerCase()] || 0) === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              {!isViewer && (
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-2 text-white/50 hover:text-red-400 rounded-lg hover:bg-white/10 transition"><Trash2 size={15} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit category" : "Add category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Web App"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">Color</label>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, color: s })}
                  className={`w-8 h-8 rounded-lg transition ${form.color === s ? "ring-2 ring-white ring-offset-2 ring-offset-[#1f3048]" : ""}`}
                  style={{ backgroundColor: s }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">{saving ? "Saving…" : editing ? "Save changes" : "Create"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}