"use client";

export interface DonutSlice {
  label: string;
  value: number;
  color: string; // hex or css color
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}

export default function DonutChart({
  data,
  size = 180,
  thickness = 26,
  centerLabel,
  centerSub,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const segments = total
    ? data
        .filter((d) => d.value > 0)
        .map((d) => {
          const fraction = d.value / total;
          const dash = fraction * circumference;
          const seg = { ...d, dash, gap: circumference - dash, rotate: (offset / total) * 360 };
          offset += d.value;
          return seg;
        })
    : [];

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-(s.rotate / 360) * circumference}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{centerLabel ?? total}</span>
          {centerSub && <span className="text-xs text-slate-400">{centerSub}</span>}
        </div>
      </div>

      <ul className="space-y-2 w-full">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
              {d.label}
            </span>
            <span className="text-slate-400 font-medium">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}