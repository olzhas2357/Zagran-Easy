"use client";

export interface Filters {
  type: "all" | "public" | "private";
  language: "all" | string;
  hasGrant: boolean;
  city: "all" | string;
}

interface FilterBarProps {
  cities: string[];
  languages: string[];
  filters: Filters;
  onFilter: (filters: Filters) => void;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors"
          : "rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
      }
    >
      {children}
    </button>
  );
}

export function FilterBar({ cities, languages, filters, onFilter }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-6">
      <div className="flex flex-wrap gap-2">
        <Pill active={filters.type === "all"} onClick={() => onFilter({ ...filters, type: "all" })}>
          Все
        </Pill>
        <Pill active={filters.type === "public"} onClick={() => onFilter({ ...filters, type: "public" })}>
          Государственные
        </Pill>
        <Pill active={filters.type === "private"} onClick={() => onFilter({ ...filters, type: "private" })}>
          Частные
        </Pill>
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill active={filters.language === "all"} onClick={() => onFilter({ ...filters, language: "all" })}>
          Все языки
        </Pill>
        {languages.map((lang) => (
          <Pill key={lang} active={filters.language === lang} onClick={() => onFilter({ ...filters, language: lang })}>
            {lang}
          </Pill>
        ))}
      </div>

      <Pill active={filters.hasGrant} onClick={() => onFilter({ ...filters, hasGrant: !filters.hasGrant })}>
        С грантом
      </Pill>

      <select
        value={filters.city}
        onChange={(e) => onFilter({ ...filters, city: e.target.value })}
        className="rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-600"
      >
        <option value="all">Все города</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
}
