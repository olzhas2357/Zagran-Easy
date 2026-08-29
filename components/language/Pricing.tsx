import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PRICING } from "@/lib/language-data";

export function Pricing() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="text-center text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
            Выберите формат обучения
          </h2>
        </FadeIn>

        <div className="mx-auto mt-9 grid max-w-4xl grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-3">
          {LANGUAGE_PRICING.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.06}>
              <div
                className={`flex h-full flex-col gap-4 rounded-[24px] border p-6.5 sm:p-7 ${
                  plan.highlighted
                    ? "border-[#2880DE] bg-[#2880DE] text-white shadow-[0_20px_44px_rgba(50,85,173,0.28)]"
                    : "border-[#E7ECF6] bg-white"
                }`}
              >
                {plan.highlighted && (
                  <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                    Популярный
                  </span>
                )}
                <div className={`text-[17px] font-bold ${plan.highlighted ? "text-white" : "text-[#0F1B3D]"}`}>
                  {plan.name}
                </div>
                <p className={`text-[13.5px] leading-relaxed ${plan.highlighted ? "text-white/80" : "text-slate-500"}`}>
                  {plan.description}
                </p>
                <div className={`text-[26px] font-extrabold ${plan.highlighted ? "text-white" : "text-[#0F1B3D]"}`}>
                  {plan.price}
                </div>
                <a
                  href="#finder"
                  className={`mt-auto flex items-center justify-center gap-1.5 rounded-2xl px-5 py-3.5 text-[14.5px] font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-white text-[#2880DE] hover:bg-[#EEF2FB]"
                      : "border border-[#DDE4F5] text-[#0F1B3D] hover:border-[#2880DE] hover:text-[#2880DE]"
                  }`}
                >
                  <Check className="h-4 w-4" strokeWidth={2.25} />
                  {plan.cta}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="mt-7 text-center text-[13px] text-slate-400">
          Итоговая стоимость зависит от курса, преподавателя и формата обучения.
        </p>
      </div>
    </section>
  );
}
