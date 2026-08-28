"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Tour } from "@/lib/types";

// Итинерар не хранится в данных тура — генерируем по длительности и хайлайтам,
// чтобы дать посетителю ощущение дня за днём без ручного ввода 10+ строк на тур.
function buildDays(tour: Tour) {
  const days: { title: string; desc: string }[] = [];
  for (let i = 0; i < tour.durationDays; i++) {
    if (i === 0) {
      days.push({ title: "Прилёт и заселение", desc: `Встреча в аэропорту, трансфер в отель, свободный вечер для отдыха после перелёта.` });
    } else if (i === tour.durationDays - 1) {
      days.push({ title: "Отъезд", desc: "Выселение из отеля, трансфер в аэропорт, вылет домой." });
    } else {
      const highlight = tour.highlights[(i - 1) % tour.highlights.length];
      days.push({ title: highlight, desc: `Экскурсионная программа: ${highlight.toLowerCase()}. Сопровождение личного гида, свободное время во второй половине дня.` });
    }
  }
  return days;
}

export function TourItinerary({ tour }: { tour: Tour }) {
  const days = buildDays(tour);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2.5">
      {days.map((d, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="overflow-hidden rounded-2xl border border-ze-border bg-white">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-4.5 py-4 text-left sm:px-5.5"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#EBF1FE] text-[13.5px] font-bold text-ze-primary">
                  {i + 1}
                </div>
                <div className="min-w-0 truncate text-[15px] font-semibold text-ze-ink">{d.title}</div>
              </div>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-none text-[13px] text-ze-muted"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4.5 pb-4.5 pl-[62px] text-[14px] leading-relaxed text-ze-muted sm:px-5.5 sm:pl-[62px]">
                    {d.desc}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
