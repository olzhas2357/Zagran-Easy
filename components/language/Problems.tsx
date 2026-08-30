import { Mic, Compass, FileCheck2, Plane, ArrowRight, Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PROBLEMS, LANGUAGE_BENEFITS } from "@/lib/language-data";

const ICONS = [Mic, Compass, FileCheck2, Plane];

export function Problems() {
  return (
    <section className="border-y border-[#E7ECF6] bg-[#F8FAFD] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[640px] text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
            Язык не должен быть препятствием к вашей цели
          </h2>
        </FadeIn>

        <div className="mt-9 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-2 lg:gap-8">
          {/* Left: the problem, muted */}
          <FadeIn>
            <div className="flex h-full flex-col gap-4">
              <div className="text-[13px] font-bold uppercase tracking-wide text-slate-400">Знакомо?</div>
              <div className="flex flex-1 flex-col gap-3">
                {LANGUAGE_PROBLEMS.map((p, i) => {
                  const Icon = ICONS[i];
                  return (
                    <div key={p.title} className="flex items-start gap-3 rounded-2xl border border-[#E7ECF6] bg-white/70 p-4">
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-slate-100">
                        <Icon className="h-4.5 w-4.5 text-slate-500" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="text-[14.5px] font-bold text-[#0F1B3D]">{p.title}</div>
                        <div className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{p.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Right: the solution, highlighted */}
          <FadeIn delay={0.08}>
            <div className="flex h-full flex-col gap-4 rounded-[24px] border border-[#2880DE]/15 bg-white p-6 shadow-[0_20px_44px_rgba(50,85,173,0.08)] sm:p-7">
              <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#2880DE]">
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                Решение ZagranEasy
              </div>
              <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
                {LANGUAGE_BENEFITS.map((b) => (
                  <div key={b} className="flex items-center gap-2.5 rounded-xl bg-[#F3F7FF] px-3.5 py-3">
                    <Check className="h-4 w-4 flex-none text-[#2880DE]" strokeWidth={2.5} />
                    <span className="text-[13.5px] font-semibold leading-snug text-[#0F1B3D]">{b}</span>
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
