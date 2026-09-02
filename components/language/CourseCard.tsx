import { Layers, Clock, ListChecks } from "lucide-react";
import type { RealLanguageCourse } from "@/lib/language-data";

export function CourseCard({
  course,
}: {
  course: RealLanguageCourse;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-sky-200 hover:shadow-[0_20px_44px_rgba(34,211,238,0.12)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none dark:backdrop-blur-sm dark:hover:border-[#22D3EE]/30 dark:hover:bg-white/[0.08] dark:hover:shadow-[0_20px_44px_rgba(34,211,238,0.2)]">

      {/* Image */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-white/5">
        {course.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-white/40">
            Нет изображения
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5.5 sm:p-6">

        {/* Title */}
        <div>
          <div className="text-[17px] font-bold text-ze-ink dark:text-white">
            {course.title}
          </div>

          <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600 dark:text-white/55">
            {course.description}
          </p>
        </div>

        {/* Course info */}
        <div className="flex flex-wrap gap-1.5">

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600 dark:bg-white/8 dark:text-white/65">
            <Layers className="h-3 w-3" strokeWidth={2} />
            {course.total_lessons} уроков
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600 dark:bg-white/8 dark:text-white/65">
            <ListChecks className="h-3 w-3" strokeWidth={2} />
            {course.total_tasks} заданий
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600 dark:bg-white/8 dark:text-white/65">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {course.estimated_hours} ч.
          </span>

        </div>

        {/* CTA */}
        <div className="mt-auto flex items-center justify-end gap-3 pt-3">
          <a
            href={`/courses/${course.slug}`}
            className="text-[13.5px] font-semibold text-sky-700 transition-colors hover:text-sky-900 dark:text-[#8FD9F5] dark:hover:text-white"
          >
            Подробнее →
          </a>
        </div>

      </div>
    </div>
  );
}