import { ArrowDown } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_RESULT_STATS } from "@/lib/language-data";

const PROGRESSION = ["Ваш текущий уровень", "Обучение", "Практика", "Уверенный язык"];

export function Results() {
  return (
    <section className="bg-[#0B132B] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[560px] text-center text-[26px] font-extrabold tracking-tight text-white sm:mx-auto sm:text-[38px]">
            Ваш результат — наша главная цель
          </h2>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="mx-auto mt-9 flex max-w-lg flex-col items-center gap-2.5 sm:mt-12">
            {PROGRESSION.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2.5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 text-[14.5px] font-semibold text-white backdrop-blur-sm">
                  {step}
                </div>
                {i < PROGRESSION.length - 1 && <ArrowDown className="h-4 w-4 text-[#8FD9F5]" strokeWidth={2} />}
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="mx-auto mt-11 grid max-w-2xl grid-cols-1 gap-4.5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {LANGUAGE_RESULT_STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.06}>
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center backdrop-blur-sm">
                <span className="text-[30px] font-extrabold tracking-tight text-[#8FD9F5] sm:text-[38px]">
                  {s.value}
                </span>
                <span className="text-[13.5px] font-medium text-white/55">{s.label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
