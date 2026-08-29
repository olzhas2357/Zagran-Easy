import { Star } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_REVIEWS } from "@/lib/language-data";

export function Reviews() {
  return (
    <section id="reviews" className="border-y border-[#E7ECF6] bg-[#F8FAFD] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="max-w-[560px] text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
            Что говорят наши студенты
          </h2>
        </FadeIn>

        <div className="mt-8 grid grid-cols-1 gap-4.5 sm:mt-11 sm:grid-cols-2 lg:grid-cols-4">
          {LANGUAGE_REVIEWS.map((r, i) => (
            <FadeIn key={r.id} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-5.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="flex-1 text-[13.5px] leading-relaxed text-slate-600">&ldquo;{r.text}&rdquo;</p>
                <div>
                  <div className="text-[14px] font-bold text-[#0F1B3D]">{r.name}</div>
                  <div className="text-[12px] text-slate-400">{r.course}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
