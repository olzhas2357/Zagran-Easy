import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PRICING } from "@/lib/language-data";

export function Pricing() {
  return (
    <section className="bg-[#0B132B] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="text-center text-[26px] font-extrabold tracking-tight text-white sm:text-[38px]">
            Выберите формат обучения
          </h2>
        </FadeIn>

        <div className="mx-auto mt-9 grid max-w-4xl grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-3">
          {LANGUAGE_PRICING.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.06}>
              <div
                className={`flex h-full flex-col gap-4 rounded-[24px] border p-6.5 sm:p-7 ${
                  plan.highlighted
                    ? "border-transparent text-white shadow-[0_20px_50px_rgba(4,12,40,0.4)]"
                    : "border-white/10 bg-white/[0.05] backdrop-blur-sm"
                }`}
                style={plan.highlighted ? { background: "linear-gradient(150deg, #2880DE 0%, #123fa6 100%)" } : undefined}
              >
                {plan.highlighted && (
                  <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                    Популярный
                  </span>
                )}
                <div className={`text-[17px] font-bold ${plan.highlighted ? "text-white" : "text-white"}`}>
                  {plan.name}
                </div>
                <p className={`text-[13.5px] leading-relaxed ${plan.highlighted ? "text-white/80" : "text-white/55"}`}>
                  {plan.description}
                </p>
                <div className={`text-[26px] font-extrabold ${plan.highlighted ? "text-white" : "text-white"}`}>
                  {plan.price}
                </div>
                <a
                  href="#finder"
                  className={`mt-auto flex items-center justify-center gap-1.5 rounded-2xl px-5 py-3.5 text-[14.5px] font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-white text-[#2880DE] hover:shadow-[0_0_0_4px_rgba(255,255,255,0.25)]"
                      : "border border-white/20 text-white hover:border-[#22D3EE] hover:text-[#8FD9F5]"
                  }`}
                >
                  <Check className="h-4 w-4" strokeWidth={2.25} />
                  {plan.cta}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="mt-7 text-center text-[13px] text-white/40">
          Итоговая стоимость зависит от курса, преподавателя и формата обучения.
        </p>
      </div>
    </section>
  );
}
