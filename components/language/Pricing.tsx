import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PRICING } from "@/lib/language-data";

export function Pricing() {
  return (
    <section className="bg-[#F5F8FF] py-14 sm:py-20 dark:bg-[#0B132B]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="text-center text-[26px] font-extrabold tracking-tight text-ze-ink sm:text-[38px] dark:text-white">
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
                    : "border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none dark:backdrop-blur-sm"
                }`}
                style={plan.highlighted ? { background: "linear-gradient(150deg, #2880DE 0%, #123fa6 100%)" } : undefined}
              >
                {plan.highlighted && (
                  <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                    Популярный
                  </span>
                )}
                <div className={`text-[17px] font-bold ${plan.highlighted ? "text-white" : "text-ze-ink dark:text-white"}`}>
                  {plan.name}
                </div>
                <p className={`text-[13.5px] leading-relaxed ${plan.highlighted ? "text-white/80" : "text-slate-600 dark:text-white/55"}`}>
                  {plan.description}
                </p>
                <div className={`text-[26px] font-extrabold ${plan.highlighted ? "text-white" : "text-ze-ink dark:text-white"}`}>
                  {plan.price}
                </div>
                <a
                  href="#finder"
                  className={`mt-auto flex items-center justify-center gap-1.5 rounded-2xl px-5 py-3.5 text-[14.5px] font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-white text-[#2880DE] hover:shadow-[0_0_0_4px_rgba(255,255,255,0.25)]"
                      : "border border-slate-200 text-ze-ink hover:border-sky-300 hover:text-sky-700 dark:border-white/20 dark:text-white dark:hover:border-[#22D3EE] dark:hover:text-[#8FD9F5]"
                  }`}
                >
                  <Check className="h-4 w-4" strokeWidth={2.25} />
                  {plan.cta}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="mt-7 text-center text-[13px] text-slate-500 dark:text-white/40">
          Итоговая стоимость зависит от курса, преподавателя и формата обучения.
        </p>
      </div>
    </section>
  );
}
