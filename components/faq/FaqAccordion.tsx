"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqItem } from "@/data/content";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (activeCategory && i.category !== activeCategory) return false;
      if (q && !(i.question + " " + i.answer).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, activeCategory]);

  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-2.5 rounded-[16px] border border-ze-border bg-white px-4 py-3.5 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
        <span className="text-[16px] opacity-50">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти ответ на ваш вопрос..."
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ze-ink outline-none"
        />
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            activeCategory === null
              ? "border-ze-primary bg-ze-primary text-white"
              : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c === activeCategory ? null : c)}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              activeCategory === c
                ? "border-ze-primary bg-ze-primary text-white"
                : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-6 flex flex-col gap-2.5">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-ze-border bg-white p-8 text-center text-[14.5px] text-ze-muted">
            Ничего не найдено. Попробуйте другой запрос или напишите нам в WhatsApp.
          </div>
        )}
        {filtered.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-ze-border bg-white">
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-ze-primary">{item.category}</div>
                  <div className="mt-0.5 text-[15.5px] font-semibold text-ze-ink">{item.question}</div>
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
                    <div className="px-5 pb-4.5 text-[14px] leading-relaxed text-ze-muted">{item.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
