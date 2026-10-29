import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Package } from "lucide-react";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { fetchEducationCountries, fetchEducationPackages } from "@/lib/data";
import { formatTuitionAmount } from "@/lib/education-catalog";

export const metadata: Metadata = {
  title: "Пакеты полного сопровождения: университеты и языковые курсы | ZagranEasy",
  description: "Пакеты полного сопровождения для поступления в университеты и языковые курсы по странам.",
};

export default async function EducationPackagesPage() {
  const [countries, packages] = await Promise.all([fetchEducationCountries(), fetchEducationPackages()]);
  const countriesWithPackages = countries.filter((country) => packages.some((p) => p.countryId === country.id));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/education" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ze-primary">
        <ArrowLeft className="h-4 w-4" /> Университеты
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ze-ink sm:text-4xl">Университеты и языковые курсы — полное сопровождение</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Выберите страну, чтобы увидеть пакеты, этапы и стоимость.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {countriesWithPackages.map((country) => {
          const countryPackages = packages.filter((p) => p.countryId === country.id);
          // Минимум показываем только если цены в одной валюте, иначе суммы несопоставимы.
          const pricedPackages = countryPackages.filter((p) => p.priceFrom !== null && p.priceCurrency);
          const currencies = new Set(pricedPackages.map((p) => p.priceCurrency));
          const minPrice =
            currencies.size === 1 ? [...pricedPackages].sort((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0))[0] : undefined;
          return (
            <Link
              key={country.id}
              href={`/education/packages/${country.slug}`}
              className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1 hover:border-blue-200"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 to-slate-100">
                <CoverPhoto src={country.imageUrl} alt={country.name} label={country.name} className="transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white drop-shadow">
                  <MapPin className="h-4 w-4" /> {country.name}
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="text-xl font-extrabold text-ze-ink">{country.name}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                  <Package className="h-4 w-4" /> Пакетов: {countryPackages.length}
                  {minPrice && <> · от {formatTuitionAmount(minPrice.priceFrom, minPrice.priceCurrency ?? "KZT")}</>}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ze-primary">
                  Смотреть пакеты <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {countriesWithPackages.length === 0 && <p className="mt-8 text-sm text-slate-500">Пакеты пока не опубликованы.</p>}
    </main>
  );
}
