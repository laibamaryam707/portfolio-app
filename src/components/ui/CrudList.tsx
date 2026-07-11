"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";
import Card from "./Card";
import ImagePicker from "./ImagePicker";
import { useIsViewer } from "@/components/dashboard/DashboardContent";
import toast from "react-hot-toast";

interface Field {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "checkbox" | "image" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface CrudListProps<T extends { _id: string }> {
  title: string;
  items: T[];
  fields: Field[];
  emptyMessage: string;
  onRefresh: () => void;
  apiPath: string;
  renderItem: (item: T) => React.ReactNode;
  getInitialForm: () => Record<string, unknown>;
  /** Optional controls rendered between the title and the list (e.g. search/filter). */
  toolbar?: React.ReactNode;
  /** When true, deletion is described as moving to Trash (for soft-delete resources). */
  softDelete?: boolean;
}

export default function CrudList<T extends { _id: string }>({
  title,
  items,
  fields,
  emptyMessage,
  onRefresh,
  apiPath,
  renderItem,
  getInitialForm,
  toolbar,
  softDelete = false,
}: CrudListProps<T>) {
  const isViewer = useIsViewer();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(getInitialForm());
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(getInitialForm());
    setOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    const data: Record<string, unknown> = {};
    fields.forEach((f) => {
      const val = (item as Record<string, unknown>)[f.name];
      if (f.type === "checkbox") data[f.name] = Boolean(val);
      else data[f.name] = Array.isArray(val) ? val.join(", ") : (val ?? "");
    });
    setForm(data);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editing ? `${apiPath}/${editing._id}` : apiPath;
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save");
      }
      toast.success(editing ? "Updated successfully" : "Created successfully");
      setOpen(false);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = softDelete
      ? "Move this to Trash? You can restore it later."
      : "Delete this item? This cannot be undone.";
    if (!confirm(confirmMsg)) return;
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete");
      }
      toast.success(softDelete ? "Moved to Trash" : "Deleted");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {!isViewer && (
          <Button onClick={openCreate} size="sm">
            <Plus size={16} /> Add New
          </Button>
        )}
      </div>

      {toolbar && <div className="mb-5">{toolbar}</div>}

      {items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-400">{emptyMessage}</p>
          {!isViewer && (
            <Button onClick={openCreate} className="mt-4" size="sm">
              <Plus size={16} /> Add your first item
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item._id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">{renderItem(item)}</div>
              {!isViewer && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-indigo-400 transition rounded-lg hover:bg-white/5">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-400 transition rounded-lg hover:bg-white/5">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${title}` : `Add ${title}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              {field.type === "image" ? (
                <ImagePicker
                  label={field.label}
                  value={String(form[field.name] ?? "")}
                  onChange={(v) => setForm({ ...form, [field.name]: v })}
                  aspect="wide"
                />
              ) : field.type === "textarea" ? (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">{field.label}</label>
                  <textarea
                    value={String(form[field.name] ?? "")}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
                  />
                </div>
              ) : field.type === "select" ? (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">{field.label}</label>
                  <select
                    value={String(form[field.name] ?? "")}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })}
                    className="rounded"
                  />
                  {field.label}
                </label>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    value={String(form[field.name] ?? "")}
                    onChange={(e) => setForm({ ...form, [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}