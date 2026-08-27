export function StatsCard({
  icon,
  value,
  label,
  hint,
}: {
  icon: string;
  value: string | number;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-[22px]">{icon}</div>
      <div className="mt-2 text-[26px] font-extrabold text-slate-900">{value}</div>
      <div className="text-[13px] text-slate-500">{label}</div>
      {hint && <div className="mt-1 text-[12px] font-medium text-emerald-600">{hint}</div>}
    </div>
  );
}
