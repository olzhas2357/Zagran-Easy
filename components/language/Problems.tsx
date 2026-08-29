import { Mic, Compass, FileCheck2, Plane } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PROBLEMS } from "@/lib/language-data";

const ICONS = [Mic, Compass, FileCheck2, Plane];

export function Problems() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[640px] text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
            Язык не должен быть препятствием к вашей цели
          </h2>
        </FadeIn>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {LANGUAGE_PROBLEMS.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <FadeIn key={p.title} delay={i * 0.06}>
                <div className="flex h-full flex-col gap-3 rounded-[20px] border border-[#E7ECF6] bg-white p-6 shadow-[0_1px_2px_rgba(15,27,61,0.04)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDF1FB]">
                    <Icon className="h-5 w-5 text-[#2880DE]" strokeWidth={1.75} />
                  </div>
                  <div className="text-[16px] font-bold text-[#0F1B3D]">{p.title}</div>
                  <div className="text-[13.5px] leading-relaxed text-slate-500">{p.text}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
