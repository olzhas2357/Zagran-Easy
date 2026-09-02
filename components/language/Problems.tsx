import { Mic, Compass, FileCheck2, Plane, ArrowRight, Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PROBLEMS, LANGUAGE_BENEFITS } from "@/lib/language-data";

const ICONS = [Mic, Compass, FileCheck2, Plane];

export function Problems() {
  return (
    <section className="bg-[#F5F8FF] py-14 sm:py-20 dark:bg-[#0B132B]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[640px] text-[26px] font-extrabold tracking-tight text-ze-ink sm:text-[38px] dark:text-white">
            Язык не должен быть препятствием к вашей цели
          </h2>
        </FadeIn>

        <div className="mt-9 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-2 lg:gap-8">
          {/* Left: the problem, muted */}
          <FadeIn>
            <div className="flex h-full flex-col gap-4">
              <div className="text-[13px] font-bold uppercase tracking-wide text-slate-400 dark:text-white/40">Знакомо?</div>
              <div className="flex flex-1 flex-col gap-3">
                {LANGUAGE_PROBLEMS.map((p, i) => {
                  const Icon = ICONS[i];
                  return (
                    <div
                      key={p.title}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none dark:backdrop-blur-sm"
                    >
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-sky-50 dark:bg-white/10">
                        <Icon className="h-4.5 w-4.5 text-sky-600 dark:text-[#8FD9F5]" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="text-[14.5px] font-bold text-ze-ink dark:text-white">{p.title}</div>
                        <div className="mt-0.5 text-[13px] leading-relaxed text-slate-500 dark:text-white/55">{p.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Right: the solution, highlighted */}
          <FadeIn delay={0.08}>
            <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-[24px] p-6 shadow-[0_20px_50px_rgba(4,12,40,0.4)] sm:p-7" style={{ background: "linear-gradient(150deg, #2880DE 0%, #123fa6 100%)" }}>
              <div className="relative flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-white/85">
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                Решение ZagranEasy
              </div>
              <div className="relative grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
                {LANGUAGE_BENEFITS.map((b) => (
                  <div key={b} className="flex items-center gap-2.5 rounded-xl bg-white/12 px-3.5 py-3">
                    <Check className="h-4 w-4 flex-none text-[#8FD9F5]" strokeWidth={2.5} />
                    <span className="text-[13.5px] font-semibold leading-snug text-white">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
