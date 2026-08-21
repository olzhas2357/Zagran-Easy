"use client";

import { useMemo, useState } from "react";
import type { University } from "@/lib/types";
import { FilterBar, type Filters } from "./FilterBar";
import { UniversityCard } from "./UniversityCard";
import { FadeIn } from "@/components/ui/FadeIn";

interface UniversityListProps {
  universities: University[];
  cities: string[];
  countryName: string;
}

const INITIAL_FILTERS: Filters = { type: "all", language: "all", hasGrant: false, city: "all" };

export function UniversityList({ universities, cities, countryName }: UniversityListProps) {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

  const languages = useMemo(
    () => Array.from(new Set(universities.flatMap((u) => u.languages))).sort(),
    [universities]
  );

  const filtered = useMemo(
    () =>
      universities.filter((u) => {
        if (filters.type !== "all" && u.type !== filters.type) return false;
        if (filters.language !== "all" && !u.languages.includes(filters.language)) return false;
        if (filters.hasGrant && !u.hasGrant) return false;
        if (filters.city !== "all" && u.city !== filters.city) return false;
        return true;
      }),
    [universities, filters]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <FilterBar cities={cities} languages={languages} filters={filters} onFilter={setFilters} />

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          Ничего не найдено по выбранным фильтрам.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filtered.map((university, i) => (
            <FadeIn key={university.id} delay={(i % 6) * 0.05}>
              <UniversityCard university={university} countryName={countryName} />
            </FadeIn>
          ))}
        </div>
      )}
    </section>
  );
}
