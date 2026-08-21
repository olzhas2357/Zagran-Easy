import Link from "next/link";
import type { EducationCountry } from "@/lib/types";

interface CountryCardProps {
  country: EducationCountry;
}

function pluralizeUniversities(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "университет";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "университета";
  return "университетов";
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <Link
      href={`/education/${country.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="mb-3 text-[32px] leading-none">{country.flag}</div>
      <h3 className="text-lg font-semibold text-slate-800">{country.name}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {country.universityCount} {pluralizeUniversities(country.universityCount)}
      </p>

      {country.features.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {country.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700"
            >
              {feature}
            </span>
          ))}
        </div>
      )}

      {country.cities.length > 0 && (
        <p className="mt-3 text-xs text-slate-400">{country.cities.slice(0, 3).join(", ")}</p>
      )}

      <p className="mt-4 text-sm font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
        Подробнее →
      </p>
    </Link>
  );
}
