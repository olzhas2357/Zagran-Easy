"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface VisaStep {
  num: number;
  title: string;
  desc: string;
}

export function VisaTimeline({ steps }: { steps: VisaStep[] }) {
  const [active, setActive] = useState(1);

  return (
    <div>
      {/* Progress bar */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-ze-border sm:top-6" />
        <motion.div
          className="absolute left-0 top-5 h-1 rounded-full bg-ze-primary sm:top-6"
          initial={{ width: "0%" }}
          animate={{ width: `${((active - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <div className="relative grid grid-cols-7 gap-1">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setActive(s.num)}
              className="flex flex-col items-center gap-2 text-center"
            >
              <motion.div
                animate={{
                  scale: active === s.num ? 1.15 : 1,
                  backgroundColor: s.num <= active ? "var(--ze-primary)" : "#ffffff",
                  color: s.num <= active ? "#ffffff" : "#94a3b8",
                }}
                transition={{ duration: 0.2 }}
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-ze-primary text-[13.5px] font-bold sm:h-12 sm:w-12"
              >
                {s.num < active ? "✓" : s.num}
              </motion.div>
              <div
                className={`hidden text-[11.5px] font-semibold leading-tight sm:block ${
                  s.num === active ? "text-ze-primary" : "text-ze-muted"
                }`}
              >
                {s.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active step detail */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-8 rounded-2xl border border-ze-border bg-white p-6 sm:mt-10 sm:p-8"
      >
        <div className="text-[12.5px] font-semibold uppercase tracking-wide text-ze-primary">
          Шаг {active} из {steps.length}
        </div>
        <h3 className="mt-2 text-[21px] font-bold tracking-tight sm:text-[25px]">
          {steps.find((s) => s.num === active)?.title}
        </h3>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
          {steps.find((s) => s.num === active)?.desc}
        </p>
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={() => setActive((a) => Math.max(1, a - 1))}
            disabled={active === 1}
            className="rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ze-ink disabled:opacity-40"
          >
            ← Назад
          </button>
          <button
            onClick={() => setActive((a) => Math.min(steps.length, a + 1))}
            disabled={active === steps.length}
            className="rounded-xl bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-40"
          >
            Далее →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
