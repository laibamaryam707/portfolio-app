"use client";

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}
function arc(cx: number, cy: number, r: number, start: number, end: number) {
  const [sx, sy] = polar(cx, cy, r, start);
  const [ex, ey] = polar(cx, cy, r, end);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

export default function RadialGauge({
  value,
  label,
  color = "#4f46e5",
}: { value: number; label?: string; color?: string }) {
  const v = Math.max(0, Math.min(100, value));
  const cx = 100, cy = 100, r = 78;
  const end = -90 + (180 * v) / 100;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 130" width="100%" style={{ maxWidth: 220 }}>
        <path d={arc(cx, cy, r, -90, 90)} fill="none" stroke="#e9eef5" strokeWidth="16" strokeLinecap="round" />
        <path d={arc(cx, cy, r, -90, end)} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
        <text x="100" y="96" textAnchor="middle" className="fill-white/60" style={{ fontSize: 30, fontWeight: 700 }}>{v}%</text>
      </svg>
      {label && <p className="text-sm text-white/60 -mt-1">{label}</p>}
    </div>
  );
}