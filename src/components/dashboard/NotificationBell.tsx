"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { ActivityData } from "@/lib/types";

function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationBell() {
  const [items, setItems] = useState<ActivityData[]>([]);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/activity?limit=8").then((r) => r.json()).then((d) => setItems(d.activities || []));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };

  const dropdown = (
    <div
      ref={ref}
      style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
      className="w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-[#1f3048] shadow-2xl"
    >
      <div className="p-4 border-b border-white/10">
        <p className="font-semibold text-white">Notifications</p>
      </div>
      {items.length === 0 ? (
        <p className="p-6 text-sm text-white/60 text-center">All caught up.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {items.map((a) => (
            <li key={a._id} className="p-3 hover:bg-white/5 transition">
              <p className="text-sm text-white">
                <span className="capitalize">{a.action}</span> {a.entityType}
                {a.entityName && <span className="text-white/70"> · {a.entityName}</span>}
              </p>
              <p className="text-xs text-white/40 mt-0.5">{timeAgo(a.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/dashboard/activity"
        onClick={() => setOpen(false)}
        className="block p-3 text-center text-sm text-sky-300 hover:underline border-t border-white/10"
      >
        View all activity
      </Link>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-white/70 hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {items.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400" />
        )}
      </button>

      {open && typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}