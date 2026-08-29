import { Video, MessageSquare, ClipboardList, ThumbsUp, TrendingUp, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_BENEFITS } from "@/lib/language-data";

const ICONS = [Video, MessageSquare, ClipboardList, ThumbsUp, TrendingUp, BookOpen];

export function Benefits() {
  return (
    <section className="border-y border-[#E7ECF6] bg-[#F8FAFD] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[560px] text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
            Что вы получаете на курсе
          </h2>
        </FadeIn>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-11 sm:grid-cols-3 sm:gap-5">
          {LANGUAGE_BENEFITS.map((b, i) => {
            const Icon = ICONS[i];
            return (
              <FadeIn key={b} delay={i * 0.05}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-4.5 sm:p-5">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#EDF1FB]">
                    <Icon className="h-5 w-5 text-[#2880DE]" strokeWidth={1.75} />
                  </div>
                  <div className="text-[13.5px] font-semibold leading-snug text-[#0F1B3D] sm:text-[14.5px]">{b}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
