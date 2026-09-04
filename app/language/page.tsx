import type { Metadata } from "next";
import { LanguageHero } from "@/components/language/LanguageHero";
import { TrustBar } from "@/components/language/TrustBar";
import { LearningPaths } from "@/components/language/LearningPaths";
import { Problems } from "@/components/language/Problems";
import { HowItWorks } from "@/components/language/HowItWorks";
import { Teachers } from "@/components/language/Teachers";
import { Courses } from "@/components/language/Courses";
import { Results } from "@/components/language/Results";
import { Reviews } from "@/components/language/Reviews";
import { Pricing } from "@/components/language/Pricing";
import { FinalCTA } from "@/components/language/FinalCTA";
import { LanguageFaq } from "@/components/language/LanguageFaq";
import { LanguageFooter } from "@/components/language/LanguageFooter";
import { StickyMobileCTA } from "@/components/language/StickyMobileCTA";
import { fetchPublicCourses, fetchPublicTeachers } from "@/lib/data";
import { MotivationMarquee } from "@/components/language/MotivationMarquee";

export const metadata: Metadata = {
  title: "Подготовка к HSK, IELTS — ZagranEasy",
  description:
    "Онлайн-подготовка к HSK, IELTS с преподавателем. Курсы английского языка, сильные преподаватели, практика и результат для поступления за рубеж.",
  openGraph: {
    title: "Подготовка к HSK, IELTS — ZagranEasy",
    description: "Онлайн-подготовка к HSK, IELTS с преподавателем. Поступление в Китай, США и другие страны.",
    url: "https://zagraneasy.kz/language",
  },
};

export default async function LanguagePage() {
  const teachers = await fetchPublicTeachers();
  const courses = await fetchPublicCourses();

  return (
    <div className="bg-[#F5F8FF] pb-16 sm:pb-0 dark:bg-[#0B132B]">
      <LanguageHero />
      <TrustBar />
      <LearningPaths />
      <Problems />
      <MotivationMarquee />
      <HowItWorks />
      {/* <Teachers teachers={teachers} />
      <Courses courses={courses}/> */}
      <Results />
      <Reviews />
      <Pricing />
      <FinalCTA />
      <LanguageFaq />
      <LanguageFooter />
      <StickyMobileCTA />
    </div>
  );
}
