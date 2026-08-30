"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { EducationCountry, University } from "@/lib/types";
import { UniversityRow } from "@/components/staff/UniversityRow";

export function UniversitiesBoard({
  universities,
  countries,
}: {
  universities: University[];
  countries: EducationCountry[];
}) {
  const [query, setQuery] = useState("");
  const [countryId, setCountryId] = useState<string | null>(null);

  const countryById = new Map(countries.map((c) => [c.id, c]));
  const usedCountries = countries.filter((c) => universities.some((u) => u.countryId === c.id));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return universities.filter((u) => {
      if (countryId && u.countryId !== countryId) return false;
      if (q && !(u.name + " " + u.city).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [universities, query, countryId]);

  return (
    <div>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-[320px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию или городу…"
            className="w-full rounded-xl border border-ze-border bg-white py-3 pl-9.5 pr-4 text-[14px] outline-none transition-colors focus:border-ze-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCountryId(null)}
            className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              countryId === null ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            Все страны
          </button>
          {usedCountries.map((c) => (
            <button
              key={c.id}
              onClick={() => setCountryId(c.id)}
              className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                countryId === c.id ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[880px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_190px] gap-3 border-b border-[#EEF1F6] bg-slate-50 px-4.5 py-3.5 text-[12px] font-bold uppercase tracking-wide text-ze-muted">
              <div>Университет</div>
              <div>Цена / год</div>
              <div>Дедлайн</div>
              <div>Презентация</div>
              <div>Проверено</div>
              <div />
            </div>
            {filtered.length === 0 && (
              <div className="px-4.5 py-12 text-center text-[14px] text-ze-muted">Ничего не найдено — попробуйте другой запрос.</div>
            )}
            {filtered.map((u) => (
              <UniversityRow key={u.id} university={u} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2.5 text-[12.5px] text-ze-muted">
        Показано {filtered.length} из {universities.length}
        {countryId && countryById.get(countryId) ? ` · ${countryById.get(countryId)!.name}` : ""}
      </div>
    </div>
  );
}
