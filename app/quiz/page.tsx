import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Clock3, MessageCircleQuestion, Sparkles } from "lucide-react";
import { FormStudent } from "@/components/home/FormForStudent";
import { REEL_PHOTOS_ONLY, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Тест: ваш путь к учёбе за рубежом | ZagranEasy",
  description: "Ответьте на 7 коротких вопросов и получите персональный разбор поступления за рубеж.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "Какой путь к учёбе за рубежом подходит вам?",
    description: "Пройдите короткий тест ZagranEasy и получите разбор своей ситуации.",
    url: `${SITE.url}/quiz`,
  },
};

const reactions = [
  { icon: "\uD83C\uDF93", text: "Учёба за рубежом - это реально" },
  { icon: "\uD83D\uDD0E", text: "Без скучных вопросов" },
  { icon: "\uD83E\uDD1D", text: "Разбор от менеджера" },
];

export default function QuizPage() {
  return (
    <div className="relative isolate overflow-hidden bg-[#F7F9FC] py-8 sm:py-14">
      <div className="absolute inset-x-0 top-0 -z-10 h-[1920px] bg-[linear-gradient(135deg,#E5F3FF_0%,#b7d9f4_32%,#F7F9FC_70%)]" />
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 sm:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <section className="pt-2 lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3.5 py-2 text-[13px] font-bold text-[#1A56DB] shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Анкета для абитуриентов
          </div>
          <h1 className="mt-5 text-[34px] font-extrabold leading-[1.06] tracking-tight text-ze-ink sm:text-[50px]">
            Ваш путь к учёбе за рубежом
          </h1>
          <p className="mt-4 max-w-[510px] text-[16px] leading-relaxed text-ze-muted sm:text-[18px]">
            7 коротких вопросов о вашей ситуации. В конце подскажем, с чего начать и какой вариант поступления рассмотреть.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
            {reactions.map((reaction) => (
              <div key={reaction.text} className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-3.5 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#FFF7DD] text-[21px]" aria-hidden="true">
                  {reaction.icon}
                </span>
                <span className="text-[13.5px] font-bold text-ze-ink">{reaction.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#DCE8F8] bg-white/70 p-3.5">
            <div className="flex -space-x-2.5" aria-hidden="true">
              {REEL_PHOTOS_ONLY.slice(0, 3).map((photo) => (
                <Image key={photo.id} src={photo.src} alt="" width={44} height={44} className="h-11 w-11 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <p className="text-[13px] leading-snug text-ze-muted">
              <span className="block font-bold text-ze-ink">Сегодня цель - Завтра реальность</span>
            </p>
          </div>
        </section>

        <section aria-label="Тест подбора обучения">
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-ze-muted">
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-[#E28B24]" aria-hidden="true" /> 2 минуты</span>
            <span className="inline-flex items-center gap-1.5"><MessageCircleQuestion className="h-4 w-4 text-[#1A56DB]" aria-hidden="true" /> Персональный разбор</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" /> Без оплаты</span>
          </div>
          <FormStudent />
        </section>
      </div>
    </div>
  );
}