import { Layers, Clock, ListChecks } from "lucide-react";
import type { RealLanguageCourse } from "@/lib/language-data";

export function CourseCard({
  course,
}: {
  course: RealLanguageCourse;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E7ECF6] bg-white shadow-[0_1px_2px_rgba(15,27,61,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_44px_rgba(15,27,61,0.1)]">
      
      {/* Image */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {course.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Нет изображения
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5.5 sm:p-6">
        
        {/* Title */}
        <div>
          <div className="text-[17px] font-bold text-[#0F1B3D]">
            {course.title}
          </div>

          <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">
            {course.description}
          </p>
        </div>

        {/* Course info */}
        <div className="flex flex-wrap gap-1.5">
          
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600">
            <Layers className="h-3 w-3" strokeWidth={2} />
            {course.total_lessons} уроков
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600">
            <ListChecks className="h-3 w-3" strokeWidth={2} />
            {course.total_tasks} заданий
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {course.estimated_hours} ч.
          </span>

        </div>

        {/* CTA */}
        <div className="mt-auto flex items-center justify-end gap-3 pt-3">
          <a
            href={`/courses/${course.slug}`}
            className="text-[13.5px] font-semibold text-[#2880DE] transition-colors hover:text-[#2066B2]"
          >
            Подробнее →
          </a>
        </div>

      </div>
    </div>
  );
}