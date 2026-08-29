import { FadeIn } from "@/components/ui/FadeIn";
import { CourseCard } from "@/components/language/CourseCard";
import { LANGUAGE_COURSES } from "@/lib/language-data";

export function Courses() {
  return (
    <section id="courses" className="border-y border-[#E7ECF6] bg-[#F8FAFD] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="max-w-[620px]">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-[#2880DE]">Курсы</div>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
              Выберите курс под свою цель
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500 sm:text-[16px]">
              Не просто изучайте язык — учитесь использовать его в реальных ситуациях.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-11 sm:grid-cols-2 lg:grid-cols-4">
          {LANGUAGE_COURSES.map((course, i) => (
            <FadeIn key={course.id} delay={i * 0.06}>
              <CourseCard course={course} />
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <a
            href="#finder"
            className="text-[14.5px] font-semibold text-[#2880DE] transition-colors hover:text-[#2066B2]"
          >
            Посмотреть все курсы →
          </a>
        </div>
      </div>
    </section>
  );
}
