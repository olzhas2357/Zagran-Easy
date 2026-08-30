import type { Metadata } from "next";
import { LanguageHeader } from "@/components/language/LanguageHeader";
import { LanguageHero } from "@/components/language/LanguageHero";
import { TrustBar } from "@/components/language/TrustBar";
import { Problems } from "@/components/language/Problems";
import { Courses } from "@/components/language/Courses";
import { CourseFinder } from "@/components/language/CourseFinder";
import { Teachers } from "@/components/language/Teachers";
import { TeacherHighlight } from "@/components/language/TeacherHighlight";
import { HowItWorks } from "@/components/language/HowItWorks";
import { Benefits } from "@/components/language/Benefits";
import { Results } from "@/components/language/Results";
import { Reviews } from "@/components/language/Reviews";
import { Pricing } from "@/components/language/Pricing";
import { FinalCTA } from "@/components/language/FinalCTA";
import { LanguageFaq } from "@/components/language/LanguageFaq";
import { LanguageFooter } from "@/components/language/LanguageFooter";
import { StickyMobileCTA } from "@/components/language/StickyMobileCTA";

export const metadata: Metadata = {
  title: "Языковые курсы — ZagranEasy",
  description:
    "Онлайн-курсы английского языка: General English, IELTS Preparation, English for University, Speaking Club. Сильные преподаватели, практика и результат.",
  openGraph: {
    title: "Языковые курсы — ZagranEasy",
    description: "Онлайн-курсы английского языка с преподавателем. Подготовка к IELTS и обучению за рубежом.",
    url: "https://zagraneasy.kz/language",
  },
};

export default function LanguagePage() {
  return (
    <div className="bg-white pb-16 sm:pb-0">
      {/* <LanguageHeader /> */}
      <LanguageHero />
      <TrustBar />
      <Problems />
      <Courses />
      <CourseFinder />
      <Teachers />
      <TeacherHighlight />
      <HowItWorks />
      <Benefits />
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
