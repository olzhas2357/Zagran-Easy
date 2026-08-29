"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_FAQ } from "@/lib/language-data";

export function LanguageFaq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-10">
        <FadeIn>
          <h2 className="text-center text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
            Частые вопросы
          </h2>
        </FadeIn>

        <div className="mt-8 flex flex-col gap-2.5 sm:mt-11">
          {LANGUAGE_FAQ.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-[#E7ECF6] bg-white">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left"
                >
                  <span className="text-[15px] font-semibold text-[#0F1B3D]">{item.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-none text-[13px] text-slate-400"
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
                      <div className="px-5 pb-4.5 text-[14px] leading-relaxed text-slate-500">{item.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
