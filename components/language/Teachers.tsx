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

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-11 sm:grid-cols-3 lg:grid-cols-4">
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
