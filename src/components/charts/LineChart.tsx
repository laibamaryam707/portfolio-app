"use client";

import { useId } from "react";

export interface LinePoint { label: string; value: number; }

export default function LineChart({
  data,
  color = "#4f46e5",
  height = 220,
}: { data: LinePoint[]; color?: string; height?: number }) {
  const gid = useId();
  const w = 600, h = 240, padX = 28, padY = 28;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const stepX = n > 1 ? (w - padX * 2) / (n - 1) : 0;
  const x = (i: number) => padX + i * stepX;
  const y = (v: number) => h - padY - (v / max) * (h - padY * 2);

  const pts = data.map((d, i) => [x(i), y(d.value)] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const area = n ? `${line} L ${x(n - 1)} ${h - padY} L ${x(0)} ${h - padY} Z` : "";

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={padX} x2={w - padX} y1={padY + g * (h - padY * 2)} y2={padY + g * (h - padY * 2)} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {area && <path d={area} fill={`url(#fill-${gid})`} />}
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between mt-1 px-1">
        {data.map((d) => (
          <span key={d.label} className="text-xs text-slate-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
}