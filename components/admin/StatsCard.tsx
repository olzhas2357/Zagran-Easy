import type { LucideIcon } from "lucide-react";

const COLORS: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
};

export function StatsCard({
  icon: Icon,
  value,
  label,
  hint,
  color = "blue",
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  hint?: string;
  color?: "blue" | "violet" | "emerald" | "amber";
}) {
  const colors = COLORS[color];
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors.bg}`}>
        <Icon className={`h-5.5 w-5.5 ${colors.text}`} strokeWidth={1.75} />
      </div>
      <div className="mt-3.5 text-[28px] font-extrabold leading-none tracking-tight text-slate-900">{value}</div>
      <div className="mt-1.5 text-[13.5px] text-slate-500">{label}</div>
      {hint && <div className="mt-1.5 text-[12px] font-semibold text-emerald-600">{hint}</div>}
    </div>
  );
}
