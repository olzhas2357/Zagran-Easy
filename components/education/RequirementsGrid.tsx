import { FileCheck2 } from "lucide-react";
import type { RequirementItem } from "@/data/education-requirements";

interface RequirementsGridProps {
  countryName: string;
  items: RequirementItem[];
}

export function RequirementsGrid({ countryName, items }: RequirementsGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold text-slate-800">
        Требования к поступлению в {countryName}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5"
          >
            <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="mt-0.5 text-sm text-slate-500">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
