"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const cls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-sky-500 focus:outline-none";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-white/60 mb-4">Invalid or missing reset link.</p>
        <Link href="/forgot-password" className="text-sky-300 hover:underline text-sm">
          Request a new one
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Password updated</h2>
        <p className="text-white/60">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4">
      <input
        type="password"
        placeholder="New password"
        required
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        className={cls}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        required
        value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        className={cls}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition disabled:opacity-50"
      >
        {loading ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0a192b" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Set new password</h1>
          <p className="text-white/60 mt-2">Choose something strong — at least 6 characters.</p>
        </div>
        <Suspense fallback={<div className="text-white/60 text-center">Loading…</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}