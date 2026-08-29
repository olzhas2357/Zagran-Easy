"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGE_GOALS, LANGUAGE_COURSES } from "@/lib/language-data";
import { waUrl } from "@/lib/utils";

export function CourseFinder() {
  const [goal, setGoal] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!goal) return [];
    return LANGUAGE_COURSES.filter((c) => c.goals.includes(goal));
  }, [goal]);

  const goalLabel = LANGUAGE_GOALS.find((g) => g.id === goal)?.label;

  return (
    <section id="finder" className="py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-10">
        <div className="rounded-[28px] border border-[#E7ECF6] bg-white p-6 shadow-[0_1px_2px_rgba(15,27,61,0.04)] sm:p-10">
          <div className="text-center">
            <h2 className="text-[24px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[32px]">
              Не знаете, какой курс выбрать?
            </h2>
            <p className="mx-auto mt-2.5 max-w-[480px] text-[14px] leading-relaxed text-slate-500 sm:text-[15.5px]">
              Ответьте на несколько вопросов — мы поможем подобрать подходящий формат обучения.
            </p>
          </div>

          <div className="mt-7">
            <div className="text-center text-[13px] font-semibold text-[#0F1B3D]">Ваша цель</div>
            <div className="mt-3.5 flex flex-wrap justify-center gap-2">
              {LANGUAGE_GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id === goal ? null : g.id)}
                  className={`rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                    goal === g.id
                      ? "border-[#2880DE] bg-[#2880DE] text-white"
                      : "border-[#DDE4F5] bg-white text-slate-600 hover:border-[#2880DE] hover:text-[#2880DE]"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {goal && matches.length > 0 && (
              <motion.div
                key={goal}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-7 flex flex-col gap-2.5"
              >
                <div className="text-center text-[13px] font-medium text-slate-500">
                  Подходит для цели «{goalLabel}»
                </div>
                {matches.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E7ECF6] bg-[#F8FAFD] px-5 py-4"
                  >
                    <div>
                      <div className="text-[15px] font-bold text-[#0F1B3D]">{c.name}</div>
                      <div className="text-[12.5px] text-slate-500">
                        {c.level} · {c.duration}
                      </div>
                    </div>
                    <span className="text-[14.5px] font-extrabold text-[#2880DE]">{c.price}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7 flex justify-center">
            <a
              href={waUrl(
                goalLabel
                  ? `Здравствуйте! Хочу подобрать курс английского. Цель: ${goalLabel}.`
                  : "Здравствуйте! Хочу подобрать курс английского."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#2880DE] px-7 py-4 text-[15.5px] font-semibold text-white shadow-[0_10px_24px_rgba(50,85,173,0.28)] transition-colors hover:bg-[#2066B2]"
            >
              Подобрать курс →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
