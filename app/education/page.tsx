import type { Metadata } from "next";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { buildCatalog } from "@/lib/education-catalog";
import { Catalog } from "@/components/education/Catalog";

export const metadata: Metadata = {
  title: "Обучение за рубежом — ZagranEasy",
  description:
    "3200+ зачислений в университеты Турции, Китая. Поиск по цене, дедлайну и специальности.",
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
          <p className="mt-3.5 max-w-[600px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
            Все программы Турции, Китая с ценами, дедлайнами и требованиями к поступлению.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-10">
        <Catalog universities={catalog} clientId={clientId} />
      </div>
    </div>
  );
}
