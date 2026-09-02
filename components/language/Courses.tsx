"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { CourseCard } from "@/components/language/CourseCard";
import type { RealLanguageCourse } from "@/lib/language-data";

export function Courses({
  courses,
}: {
  courses: RealLanguageCourse[];
}) {
  return (
    <section
      id="finder"
      className="bg-[#0B132B] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="max-w-[620px]">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-[#8FD9F5]">
              Курсы
            </div>

            <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-white sm:text-[38px]">
              Выберите подходящий курс
            </h2>

            <p className="mt-3 text-[14.5px] leading-relaxed text-white/55 sm:text-[16px]">
              Выберите подходящую программу обучения и начните изучение языка.
            </p>
          </div>
        </FadeIn>

        {courses.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course, i) => (
              <FadeIn key={course.id} delay={i * 0.06}>
                <CourseCard course={course} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="mt-7 rounded-[24px] border border-dashed border-white/20 bg-white/[0.04] px-6 py-10 text-center">
              <p className="text-[14.5px] text-white/55">
                Сейчас доступных курсов нет.
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}