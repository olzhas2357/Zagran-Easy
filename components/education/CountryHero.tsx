import Link from "next/link";
import type { EducationCountry } from "@/lib/types";
import { waUrl } from "@/lib/utils";
import { EDUCATION_PHONE } from "@/lib/constants";
import { getCountryNameInCase } from "@/data/education-requirements";

interface CountryHeroProps {
  country: EducationCountry;
}

export function CountryHero({ country }: CountryHeroProps) {
  const nameIn = getCountryNameInCase(country.slug, country.name);

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav className="mb-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            Главная
          </Link>
          {" / "}
          <Link href="/education" className="hover:text-blue-600">
            Обучение
          </Link>
          {" / "}
          <span className="text-slate-800">{country.name}</span>
        </nav>

        <div className="text-[48px] leading-none">{country.flag}</div>
        <h1 className="mt-3 text-[32px] font-bold text-slate-800">Обучение в {nameIn}</h1>
        <p className="mt-2 max-w-2xl text-base text-slate-500">{country.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
          <span>{country.universityCount} вузов</span>
          <span className="text-slate-300">|</span>
          <span>{country.cities.length} городов</span>
          {country.features.slice(0, 3).map((feature) => (
            <span key={feature} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700">
              {feature}
            </span>
          ))}
        </div>

        <a
          href={waUrl(`Здравствуйте! Интересует обучение в ${nameIn}.`, EDUCATION_PHONE)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Подобрать вуз →
        </a>
      </div>
    </section>
  );
}
