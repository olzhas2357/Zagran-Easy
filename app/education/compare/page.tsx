import type { Metadata } from "next";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { buildCatalog, toCompareUniversity } from "@/lib/education-catalog";
import { Compare } from "@/components/education/Compare";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, GitCompareArrows } from "lucide-react";

export const metadata: Metadata = {
  title: "Сравнение университетов — ZagranEasy",
  description: "До 3 вузов рядом: цена, дедлайн, требования и шанс поступления.",
};

export default async function ComparePage() {
  const [universities, countries] = await Promise.all([fetchAllUniversities(), fetchEducationCountries()]);
  const catalog = buildCatalog(universities, countries).map(toCompareUniversity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef4ff] via-[#f8faff] to-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-10 sm:py-11">
        <Link href="/education" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-ze-primary"><ArrowLeft className="h-4 w-4" /> Вернуться в каталог</Link>
        <div className="mt-6 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#3255AD] via-[#4775d1] to-[#8bb8f2] p-6 text-white shadow-[0_22px_55px_rgba(50,85,173,.2)] sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white/10 text-blue-200"><GitCompareArrows className="h-7 w-7" /></span><div><div className="text-xs font-bold uppercase tracking-[.18em] text-blue-200">Осознанный выбор</div><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Сравнение университетов</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">Сравнивайте университеты, чтобы найти идеальный вариант для обучения за рубежом.</p></div></div>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-white/75"><span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Стоимость и рассрочка</span><span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Гранты и общежитие</span><span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Дедлайны и IELTS</span></div>
        </div>
        <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,.06)] sm:p-6">
          <Compare universities={catalog} />
        </div>
      </div>
    </div>
  );
}
