import type { Metadata } from "next";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { buildCatalog } from "@/lib/education-catalog";
import { Compare } from "@/components/education/Compare";

export const metadata: Metadata = {
  title: "Сравнение университетов — ZagranEasy",
  description: "До 3 вузов рядом: цена, дедлайн, требования и шанс поступления.",
};

export default async function ComparePage() {
  const [universities, countries] = await Promise.all([fetchAllUniversities(), fetchEducationCountries()]);
  const catalog = buildCatalog(universities, countries);

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-11">
        <h1 className="text-[23px] font-extrabold tracking-tight sm:text-[34px]">Сравнение университетов</h1>
        <p className="mt-2.5 text-[14.5px] text-ze-muted">До 3 вузов рядом: цена, дедлайн, требования и шанс поступления.</p>
        <div className="mt-6">
          <Compare universities={catalog} />
        </div>
      </div>
    </div>
  );
}
