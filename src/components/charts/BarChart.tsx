"use client";

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  color?: string; // tailwind gradient/bg class
  height?: number; // px height of the plotting area
}

export default function BarChart({
  data,
  color = "from-indigo-500 to-purple-500",
  height = 160,
}: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 sm:gap-3" style={{ height }}>
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
              <span className="text-xs text-slate-300 font-medium opacity-0 group-hover:opacity-100 transition">
                {d.value}
              </span>
              <div
                className={`w-full max-w-[42px] rounded-t-lg bg-gradient-to-t ${color} transition-all duration-500`}
                style={{ height: `${Math.max(pct, d.value > 0 ? 6 : 2)}%`, opacity: d.value > 0 ? 1 : 0.25 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 sm:gap-3 mt-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-xs text-slate-500">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}