"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
      if (data.devResetUrl) setDevUrl(data.devResetUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const cls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-sky-500 focus:outline-none";

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0a192b" }}>
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your inbox</h1>
          <p className="text-white/60 mb-6">
            If that email is registered, a reset link was sent.
          </p>
          {devUrl && (
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 mb-6 text-left">
              <p className="text-xs text-sky-300 mb-2 font-semibold">DEV ONLY — reset link:</p>
              <Link href={devUrl} className="text-xs text-white break-all hover:underline">{devUrl}</Link>
            </div>
          )}
          <Link href="/login" className="text-sm text-sky-300 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0a192b" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
          <p className="text-white/60 mt-2">Enter your email and we will send a reset link.</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className={cls}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="text-center text-sm text-white/60 mt-6">
          Remember it?{" "}
          <Link href="/login" className="text-sky-300 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}