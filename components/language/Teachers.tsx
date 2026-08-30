"use client";

import { useState } from "react";
import { Star, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { TeacherCard } from "@/components/language/TeacherCard";
import { TeacherProfileModal } from "@/components/language/TeacherProfileModal";
import { LANGUAGE_TEACHERS, TEACHER_HIGHLIGHT, type LanguageTeacher } from "@/lib/language-data";

export function Teachers() {
  const [selected, setSelected] = useState<LanguageTeacher | null>(null);

  // Highlighted teacher already exists in the grid data — feature her once, not twice.
  const gridTeachers = LANGUAGE_TEACHERS.filter((t) => t.name !== TEACHER_HIGHLIGHT.name);
  const highlighted = LANGUAGE_TEACHERS.find((t) => t.name === TEACHER_HIGHLIGHT.name);

  return (
    <section id="teachers" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="max-w-[640px]">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-[#2880DE]">Преподаватели</div>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
              Учитесь у преподавателей, а не у скучного учебника
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500 sm:text-[16px]">
              Каждый преподаватель ZagranEasy — это человек с опытом, методикой и собственным подходом к обучению.
            </p>
          </div>
        </FadeIn>

        {/* Bento: one featured teacher beside a compact grid of the rest */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-11 lg:grid-cols-[1.1fr_1fr]">
          <FadeIn>
            <button
              type="button"
              onClick={() => highlighted && setSelected(highlighted)}
              className="group relative flex h-full min-h-[360px] w-full flex-col justify-end overflow-hidden rounded-[24px] text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={TEACHER_HIGHLIGHT.photo}
                alt={TEACHER_HIGHLIGHT.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1226] via-[#0B1226]/40 to-transparent" />
              <div className="relative flex items-center gap-1.5 self-start m-5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-bold text-[#0F1B3D] shadow-[0_4px_12px_rgba(15,27,61,0.18)]">
                <Star className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} fill="currentColor" />
                {TEACHER_HIGHLIGHT.score}
              </div>
              <div className="relative p-5 pt-16 sm:p-7">
                <div className="text-[20px] font-extrabold text-white sm:text-[24px]">{TEACHER_HIGHLIGHT.name}</div>
                <p className="mt-1.5 max-w-[380px] text-[13.5px] leading-relaxed text-white/80">{TEACHER_HIGHLIGHT.quote}</p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {[TEACHER_HIGHLIGHT.experience, TEACHER_HIGHLIGHT.students].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-white">
                  Смотреть профиль
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.25} />
                </span>
              </div>
            </button>
          </FadeIn>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
            {gridTeachers.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.06}>
                <TeacherCard teacher={t} onOpen={setSelected} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      <TeacherProfileModal teacher={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
