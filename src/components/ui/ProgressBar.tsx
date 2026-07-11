interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  color?: string; // tailwind bg class for the fill
  height?: string; // tailwind height class
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  className = "",
  color = "bg-indigo-500",
  height = "h-2",
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div className={`w-full rounded-full bg-white/10 ${height}`}>
        <div
          className={`${height} rounded-full ${color} transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-400 mt-1 inline-block">{clamped}%</span>}
    </div>
  );
}