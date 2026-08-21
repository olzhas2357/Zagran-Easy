import type { Metadata } from "next";
import { fetchEducationCountries } from "@/lib/data";
import { EducationHero } from "@/components/education/EducationHero";
import { CountryGrid } from "@/components/education/CountryGrid";
import { EnrollmentSteps } from "@/components/education/EnrollmentSteps";
import { StudentDay } from "@/components/education/StudentDay";
import { FadeIn } from "@/components/ui/FadeIn";
import { waUrl } from "@/lib/utils";
import { EDUCATION_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Обучение за рубежом — ZagranEasy",
  description:
    "3200+ зачислений в 67 университетов 9 стран мира. Турция, Китай, Италия, Малайзия, Германия, Австрия, США, Канада, Великобритания.",
  openGraph: {
    title: "Обучение за рубежом — ZagranEasy",
    description: "Каталог университетов, программ, стоимости и грантов.",
    url: "https://zagraneasy.kz/education",
  },
};

export default async function EducationPage() {
  const countries = await fetchEducationCountries();
  const universityCount = countries.reduce((sum, c) => sum + c.universityCount, 0);

  return (
    <main>
      <EducationHero countryCount={countries.length} universityCount={universityCount} />
      <CountryGrid countries={countries} />
      <EnrollmentSteps />
      <StudentDay />

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <FadeIn>
          <div className="rounded-3xl bg-slate-900 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-semibold text-white">
              Перед оплатой вы должны понимать весь план
            </h2>
            <ul className="mx-auto mt-6 grid max-w-xl grid-cols-1 gap-3 text-left text-sm text-slate-300 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Персональный подбор
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Честный бюджет
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Никаких ложных гарантий
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Поддержка на всех этапах
              </li>
            </ul>
            <a
              href={waUrl("Здравствуйте! Хочу получить персональную стратегию поступления.", EDUCATION_PHONE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Получить стратегию →
            </a>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
