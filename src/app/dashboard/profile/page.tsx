"use client";

import { useEffect, useState, FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ImagePicker from "@/components/ui/ImagePicker";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", title: "", tagline: "", about: "",
    avatar: "", heroImage: "", email: "", phone: "", location: "",
    linkedin: "", github: "", twitter: "", website: "",
    availableForWork: true,
    stats: [
      { label: "Years Experience", value: "0" },
      { label: "Projects Built", value: "0" },
      { label: "Happy Clients", value: "0" },
      { label: "Certificates", value: "0" },
    ],
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.profile) setForm({ ...form, ...d.profile }); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const updateStat = (i: number, field: "label" | "value", val: string) => {
    const stats = [...form.stats];
    stats[i] = { ...stats[i], [field]: val };
    setForm({ ...form, stats });
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0a192b' }}>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Profile Information</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Personal Info</h2>
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Full Stack Developer" />
          <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Crafting beautiful web experiences" />
          <Textarea label="About Me" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={5} placeholder="Tell visitors about yourself..." />
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={form.availableForWork} onChange={(e) => setForm({ ...form, availableForWork: e.target.checked })} className="rounded" />
            Available for work
          </label>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Images</h2>
          <ImagePicker label="Profile photo" value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} />
          <ImagePicker label="Hero / banner image (optional)" value={form.heroImage} onChange={(v) => setForm({ ...form, heroImage: v })} aspect="wide" />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Social Links</h2>
          <Input label="LinkedIn" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
          <Input label="GitHub" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
          <Input label="Twitter" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} placeholder="https://twitter.com/..." />
          <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Stats (shown on portfolio)</h2>
          {form.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Input label="Label" value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
              <Input label="Value" value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} />
            </div>
          ))}
        </Card>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
       
      </form>
      <ChangePassword />
    </div>
    
    </div>
  );
}

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error("New passwords don't match");
    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Password changed");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't change password");
    } finally {
      setSaving(false);
    }
  };

  const cls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-sky-500 focus:outline-none";

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-lg font-semibold text-white mb-1">Change Password</h2>
      <p className="text-sm text-white/60 mb-5">Use at least 6 characters.</p>
      <form onSubmit={submit} className="space-y-4 max-w-md">
        <input type="password" placeholder="Current password" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={cls} />
        <input type="password" placeholder="New password" required value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={cls} />
        <input type="password" placeholder="Confirm new password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={cls} />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Update password"}</Button>
      </form>
    </Card>
  );
}
