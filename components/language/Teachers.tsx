"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { TeacherCard } from "@/components/language/TeacherCard";
import { TeacherProfileModal } from "@/components/language/TeacherProfileModal";
import type { LanguageTeacher } from "@/lib/language-data";

export function Teachers({ teachers }: { teachers: LanguageTeacher[] }) {
  const [selected, setSelected] = useState<LanguageTeacher | null>(null);

  if (teachers.length === 0) return null;

  return (
    <section id="teachers" className="relative overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-32 top-8 h-80 w-80 rounded-full bg-[#2880DE]/10 blur-3xl dark:bg-[#2880DE]/15" />
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A56DB] dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-[#8FD9F5]">
                Наша команда
              </div>
              <h2 className="mt-4 text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ze-ink sm:text-[44px] dark:text-white">
                Преподаватели, с которыми хочется говорить
              </h2>
              <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-slate-600 sm:text-[17px] dark:text-white/60">
                Не просто объясняют правила, а помогают уверенно использовать язык для учёбы, экзаменов и жизни.
              </p>
            </div>
            <div className="hidden shrink-0 items-center gap-2 text-[13px] font-semibold text-slate-500 sm:flex dark:text-white/45">
              <span className="h-2 w-2 rounded-full bg-[#2880DE] shadow-[0_0_0_5px_rgba(40,128,222,0.12)]" />
              Нажмите на карточку, чтобы узнать больше
            </div>
          </div>
        </FadeIn>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.06}>
              <TeacherCard teacher={t} onOpen={setSelected} />
            </FadeIn>
          ))}
        </div>
      </div>

      <TeacherProfileModal teacher={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
