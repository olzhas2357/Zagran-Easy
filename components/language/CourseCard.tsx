import { Layers, Clock, MonitorSmartphone } from "lucide-react";
import type { LanguageCourse } from "@/lib/language-data";

export function CourseCard({ course }: { course: LanguageCourse }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E7ECF6] bg-white shadow-[0_1px_2px_rgba(15,27,61,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_44px_rgba(15,27,61,0.1)]">
      <div className="aspect-[16/10] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.image}
          alt={course.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5.5 sm:p-6">
        <div>
          <div className="text-[17px] font-bold text-[#0F1B3D]">{course.name}</div>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{course.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#EDF1FB] px-2.5 py-1 text-[11.5px] font-semibold text-[#2880DE]">
            {course.level}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-semibold text-slate-600">
            <MonitorSmartphone className="h-3 w-3" strokeWidth={2} />
            {course.format}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Layers className="h-3.5 w-3.5" strokeWidth={2} />
          {course.teacher}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-[15.5px] font-extrabold text-[#0F1B3D]">{course.price}</span>
          <a
            href="#finder"
            className="text-[13.5px] font-semibold text-[#2880DE] transition-colors hover:text-[#2066B2]"
          >
            {course.cta} →
          </a>
        </div>
      </div>
    </div>
  );
}
