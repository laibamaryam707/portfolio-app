import type { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  iconBg?: string;
  hint?: string;
}

export default function StatCard({
  label, value, icon: Icon,
  color = "text-indigo-600",
  iconBg = "bg-indigo-100",
  hint,
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
       <div className="min-w-0">
          <p className="text-sm text-white/70">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {hint && <p className="text-xs text-white/60 mt-1">{hint}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={22} className={color} />
        </div>
      </div>
    </Card>
  );
}