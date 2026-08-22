"use client";

import { useRef } from "react";
import type { Review } from "@/lib/types";

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 24 : 320;
    track.scrollBy({ left: dir * width, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
        <h2 className="text-[25px] font-extrabold tracking-tight sm:text-[38px]">Отзывы клиентов</h2>
        <div className="flex flex-none gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Предыдущий отзыв"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-ze-border bg-white text-[17px] text-ze-ink hover:border-ze-primary hover:text-ze-primary"
          >
            ←
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Следующий отзыв"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-ze-border bg-white text-[17px] text-ze-ink hover:border-ze-primary hover:text-ze-primary"
          >
            →
          </button>
        </div>
      </div>

      <div ref={trackRef} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none]">
        {reviews.map((r) => (
          <div
            key={r.id}
            data-card
            className="w-[85%] flex-none snap-start rounded-2xl border border-ze-border bg-white p-[22px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:w-[calc((100%-48px)/3)]"
          >
            <div className="text-[14px] tracking-[2px] text-amber-400">{"★".repeat(r.rating)}</div>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{r.text}</p>
            <div className="mt-[18px] flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF1FE] text-[13px] font-bold text-ze-primary">
                {r.avatar}
              </div>
              <div>
                <div className="text-[14px] font-semibold">{r.name}</div>
                <div className="text-[12.5px] text-ze-muted">{r.service}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
