"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { CourseCard } from "@/components/language/CourseCard";
import { LANGUAGE_COURSES, LANGUAGE_GOALS } from "@/lib/language-data";
import { waUrl } from "@/lib/utils";

export function Courses() {
  const [goal, setGoal] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!goal) return LANGUAGE_COURSES;
    return LANGUAGE_COURSES.filter((c) => c.goals.includes(goal));
  }, [goal]);

  const goalLabel = LANGUAGE_GOALS.find((g) => g.id === goal)?.label;

  return (
    <section id="finder" className="border-y border-[#E7ECF6] bg-[#F8FAFD] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="max-w-[620px]">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-[#2880DE]">Курсы</div>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
              Выберите курс под свою цель
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500 sm:text-[16px]">
              Отметьте цель — покажем подходящие программы. Не нашли нужный формат? Напишите нам, подберём лично.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mt-6 flex flex-wrap gap-2">
            {LANGUAGE_GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id === goal ? null : g.id)}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  goal === g.id
                    ? "border-[#2880DE] bg-[#2880DE] text-white"
                    : "border-[#DDE4F5] bg-white text-slate-600 hover:border-[#2880DE] hover:text-[#2880DE]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {filtered.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((course, i) => (
              <FadeIn key={course.id} delay={i * 0.06}>
                <CourseCard course={course} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="mt-7 flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-[#DDE4F5] bg-white px-6 py-10 text-center">
              <p className="max-w-[420px] text-[14.5px] leading-relaxed text-slate-500">
                Готового курса для цели «{goalLabel}» пока нет в расписании — напишите нам, подберём формат и
                преподавателя лично.
              </p>
              <a
                href={waUrl(`Здравствуйте! Хочу узнать про подготовку: ${goalLabel}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2880DE] px-6 py-3.5 text-[14.5px] font-semibold text-white shadow-[0_10px_24px_rgba(50,85,173,0.24)] transition-colors hover:bg-[#2066B2]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                Написать нам
              </a>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
