"use client";

import { useEffect, useState } from "react";
import { LAYOUTS } from "@/lib/types";
import type { LayoutType } from "@/lib/types";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

export default function LayoutPage() {
  const [current, setCurrent] = useState<LayoutType>("modern");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.profile?.layout) setCurrent(d.profile.layout); });
  }, []);

  const selectLayout = async (layout: LayoutType) => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout }),
      });
      if (!res.ok) throw new Error();
      setCurrent(layout);
      toast.success("Layout updated!");
    } catch {
      toast.error("Failed to update layout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Choose Layout</h1>
      <p className="text-slate-400 mb-8">Select a template for your public portfolio. You can switch anytime.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            type="button"
            disabled={loading}
            onClick={() => selectLayout(layout.id)}
            className={`text-left overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer transition hover:scale-[1.02] disabled:opacity-50 ${
              current === layout.id ? "ring-2 ring-indigo-500" : ""
            }`}
          >
            <div className={`h-40 bg-gradient-to-br ${layout.preview} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm" />
              </div>
              {current === layout.id && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white">{layout.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{layout.description}</p>
              {current === layout.id && (
                <span className="inline-block mt-3 text-xs font-medium text-indigo-400">Active</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
