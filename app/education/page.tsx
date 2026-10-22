import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, GitCompareArrows } from "lucide-react";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { buildCatalog } from "@/lib/education-catalog";
import { Catalog } from "@/components/education/Catalog";

export const metadata: Metadata = {
  title: "Обучение за рубежом — ZagranEasy",
  description:
    "Подберите университет и город для учёбы за рубежом. Поиск по цене, дедлайну и специальности.",
  openGraph: {
    title: "Обучение за рубежом — ZagranEasy",
    description: "Каталог университетов с фильтрами, сравнением и подбором.",
    url: "https://zagraneasy.kz/education",
  },
};

export default async function EducationPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const { clientId } = await searchParams;
  const [universities, countries] = await Promise.all([fetchAllUniversities(), fetchEducationCountries()]);
  const catalog = buildCatalog(universities, countries);
  const totalPrograms = catalog.reduce((sum, u) => sum + u.programsCount, 0);
  const countryCatalog = countries
    .map((country) => ({ ...country, count: catalog.filter((university) => university.source.countryId === country.id).length }))
    .filter((country) => country.count > 0);

  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      <div className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-11">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-slate-700">
            <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[11px] font-bold text-white">БАЗА</span>
            {totalPrograms.toLocaleString("ru-RU")} программ · {catalog.length} вузов
          </div>
          <h1 className="mt-4 max-w-[760px] text-[28px] font-extrabold leading-[1.04] tracking-tight text-balance sm:text-[46px]">
            Найдите свой университет за 3 минуты
          </h1>
          <p className="mt-3.5 max-w-[800px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
            Университеты разных стран с ценами, дедлайнами и требованиями к поступлению.
          </p>
          <Link href="/education/compare" className="group mt-7 flex max-w-[760px] flex-col gap-4 overflow-hidden rounded-[22px] border border-blue-200 bg-white p-5 shadow-[0_14px_35px_rgba(50,85,173,.09)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_18px_42px_rgba(50,85,173,.14)] sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-ze-primary text-white shadow-[0_8px_20px_rgba(26,86,219,.22)]"><GitCompareArrows className="h-6 w-6" /></span>
            <span className="min-w-0 flex-1"><span className="block text-base font-extrabold text-ze-ink">Сравните университеты рядом</span><span className="mt-1 block text-sm leading-5 text-ze-muted">Цена, дедлайны, IELTS, гранты и общежитие — в одной понятной таблице.</span><span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500"><span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> До 3 университетов</span><span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Быстрый выбор</span></span></span>
            <span className="flex items-center gap-2 text-sm font-bold text-ze-primary">Перейти к сравнению <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-10">
        <Catalog universities={catalog} countries={countryCatalog} clientId={clientId} />
      </div>
    </div>
  );
}
