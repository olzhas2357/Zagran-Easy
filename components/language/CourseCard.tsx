import { Layers, Clock, ListChecks } from "lucide-react";
import type { RealLanguageCourse } from "@/lib/language-data";

export function CourseCard({
  course,
}: {
  course: RealLanguageCourse;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] backdrop-blur-sm transition-all duration-300 hover:border-[#22D3EE]/30 hover:bg-white/[0.08] hover:shadow-[0_20px_44px_rgba(34,211,238,0.2)]">
      
      {/* Image */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-white/5">
        {course.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            Нет изображения
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5.5 sm:p-6">
        
        {/* Title */}
        <div>
          <div className="text-[17px] font-bold text-white">
            {course.title}
          </div>

          <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">
            {course.description}
          </p>
        </div>

        {/* Course info */}
        <div className="flex flex-wrap gap-1.5">
          
          <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[11.5px] font-semibold text-white/65">
            <Layers className="h-3 w-3" strokeWidth={2} />
            {course.total_lessons} уроков
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[11.5px] font-semibold text-white/65">
            <ListChecks className="h-3 w-3" strokeWidth={2} />
            {course.total_tasks} заданий
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[11.5px] font-semibold text-white/65">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {course.estimated_hours} ч.
          </span>

        </div>

        {/* CTA */}
        <div className="mt-auto flex items-center justify-end gap-3 pt-3">
          <a
            href={`/courses/${course.slug}`}
            className="text-[13.5px] font-semibold text-[#8FD9F5] transition-colors hover:text-white"
          >
            Подробнее →
          </a>
        </div>

      </div>
    </div>
  );
}