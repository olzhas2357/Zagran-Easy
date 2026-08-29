import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_STEPS } from "@/lib/language-data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[560px] text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
            Начать обучение проще, чем кажется
          </h2>
        </FadeIn>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-4 sm:gap-6">
          {LANGUAGE_STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.07}>
              <div className="relative flex h-full flex-col gap-2.5 rounded-[20px] border border-[#E7ECF6] bg-white p-6">
                <div className="text-[13px] font-extrabold text-[#2880DE]">{s.step}</div>
                <div className="text-[16px] font-bold text-[#0F1B3D]">{s.title}</div>
                <div className="text-[13.5px] leading-relaxed text-slate-500">{s.text}</div>
                {i < LANGUAGE_STEPS.length - 1 && (
                  <div className="absolute top-1/2 -right-3 hidden h-px w-6 -translate-y-1/2 bg-[#DDE4F5] sm:block" />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
