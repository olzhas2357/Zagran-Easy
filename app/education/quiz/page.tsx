import type { Metadata } from "next";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { buildCatalog } from "@/lib/education-catalog";
import { EducationQuiz } from "@/components/education/EducationQuiz";

export const metadata: Metadata = {
  title: "Подбор университета — ZagranEasy",
  description: "3 вопроса — и мы подберём вузы с реальным шансом поступления.",
};

export default async function EducationQuizPage() {
  const [universities, countries] = await Promise.all([fetchAllUniversities(), fetchEducationCountries()]);
  const catalog = buildCatalog(universities, countries);

  return (
    <div className="bg-ze-surface py-10 sm:py-14">
      <div className="mx-auto max-w-[720px] px-4 sm:px-10">
        <EducationQuiz universities={catalog} />
      </div>
    </div>
  );
}
