"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import type { Review } from "@/lib/types";

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : null;

  function scrollByCard(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 24 : 320;
    track.scrollBy({ left: dir * width, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[12px] font-semibold text-ze-primary dark:border-white/15 dark:bg-white/[0.06] dark:text-[#8FD9F5]">
            Истории наших клиентов
          </div>
          <h2 className="mt-3.5 text-[25px] font-extrabold tracking-tight sm:text-[38px] dark:text-white">
            Большие перемены начинаются с одного шага
          </h2>
          <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-ze-muted sm:text-[15px] dark:text-white/60">
            Читайте, как опыт ZagranEasy помог клиентам приблизиться к учёбе и жизни за рубежом.
          </p>
        </div>
        <div className="flex flex-none items-center justify-between gap-4 sm:justify-end">
          {averageRating !== null && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-2 dark:border-amber-300/15 dark:bg-amber-300/[0.07]">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-[14px] font-extrabold text-ze-ink dark:text-white">{averageRating.toFixed(1)}</span>
              <span className="text-[12px] text-ze-muted dark:text-white/55">по отзывам клиентов</span>
            </div>
          )}
          <div className="flex flex-none gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Предыдущий отзыв"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-ze-border bg-white text-ze-ink transition hover:border-ze-primary hover:text-ze-primary dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Следующий отзыв"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-ze-border bg-white text-ze-ink transition hover:border-ze-primary hover:text-ze-primary dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/25"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          </div>
        </div>
      </div>

      <div ref={trackRef} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none]">
        {reviews.map((r) => (
          <div
            key={r.id}
            data-card
            className="group relative flex min-h-[250px] w-[88%] flex-none snap-start flex-col overflow-hidden rounded-[22px] border border-ze-border/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.09)] sm:w-[calc((100%-48px)/3)] sm:p-6 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none dark:hover:border-white/20"
          >
            <div className="pointer-events-none absolute -right-4 -top-4 text-ze-primary/5 transition-transform duration-300 group-hover:scale-110 dark:text-white/[0.04]">
              <Quote className="h-20 w-20" fill="currentColor" />
            </div>
            <div className="relative flex items-center gap-0.5" aria-label={`Оценка: ${r.rating} из 5`}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-white/15"}`}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <p className="relative mt-4 flex-1 text-[14.5px] leading-[1.75] text-slate-700 dark:text-white/75">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="relative mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#EBF1FE] to-[#D9E7FF] text-[13px] font-bold text-ze-primary ring-2 ring-white dark:from-white/10 dark:to-white/[0.04] dark:text-[#8FD9F5] dark:ring-[#0B132B]">
                {r.avatar}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-bold text-ze-ink dark:text-white">{r.name}</div>
                <div className="mt-0.5 truncate text-[12.5px] text-ze-muted dark:text-white/55">{r.service}</div>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="rounded-2xl border border-ze-border bg-white p-5 text-[14px] text-ze-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60">
            Отзывы появятся здесь после публикации.
          </p>
        )}
      </div>
    </div>
  );
}
