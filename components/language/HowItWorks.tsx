import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_STEPS } from "@/lib/language-data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F5F8FF] py-12 sm:py-16 dark:bg-[#0B132B]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[560px] text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[34px] dark:text-white">
            Начать обучение проще, чем кажется
          </h2>
        </FadeIn>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-4 sm:gap-4">
          {LANGUAGE_STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.07}>
              <div className="group relative flex h-full flex-col gap-2 rounded-[18px] border border-blue-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_8px_20px_rgba(40,128,222,0.1)] dark:border-[#2880DE]/30 dark:bg-white/[0.04] dark:shadow-[0_0_20px_rgba(40,128,222,0.12)] dark:backdrop-blur-md dark:hover:border-[#3B93F5]/60 dark:hover:bg-white/[0.07] dark:hover:shadow-[0_0_25px_rgba(59,147,245,0.25)]">
                {/* Неоновый подсвет сверху карточки */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-[18px] bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="text-[12px] font-extrabold tracking-wider text-[#2880DE] dark:text-[#22D3EE] dark:drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                  {s.step}
                </div>
                <div className="text-[15px] font-bold text-ze-ink tracking-tight dark:text-white">
                  {s.title}
                </div>
                <div className="text-[13px] leading-relaxed text-slate-600 dark:text-white/60">
                  {s.text}
                </div>

                {/* Соединительная стрелочка / линия */}
                {i < LANGUAGE_STEPS.length - 1 && (
                  <div className="absolute top-1/2 -right-2.5 hidden h-px w-5 -translate-y-1/2 bg-gradient-to-r from-[#22D3EE]/50 to-transparent sm:block" />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}