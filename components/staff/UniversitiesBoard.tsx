"use client";

import { useMemo, useState } from "react";
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
      <div className="mt-4.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или городу…"
          className="min-w-0 flex-1 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[13.5px] outline-none focus:border-ze-primary sm:max-w-[320px]"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCountryId(null)}
            className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
              countryId === null ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            Все страны
          </button>
          {usedCountries.map((c) => (
            <button
              key={c.id}
              onClick={() => setCountryId(c.id)}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                countryId === c.id ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3.5 overflow-hidden rounded-2xl border border-ze-border bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_140px] gap-3 border-b border-[#EEF1F6] px-4 py-3 text-[11.5px] font-bold uppercase tracking-wide text-ze-muted">
              <div>Университет</div>
              <div>Цена / год</div>
              <div>Дедлайн</div>
              <div>Презентация</div>
              <div>Проверено</div>
              <div />
            </div>
            {filtered.length === 0 && (
              <div className="px-4 py-10 text-center text-[13.5px] text-ze-muted">Ничего не найдено — попробуйте другой запрос.</div>
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
