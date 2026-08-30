import { Star } from "lucide-react";
import type { LanguageTeacher } from "@/lib/language-data";

export function TeacherCard({ teacher, onOpen }: { teacher: LanguageTeacher; onOpen: (teacher: LanguageTeacher) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(teacher)}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E7ECF6] bg-white text-left shadow-[0_1px_2px_rgba(15,27,61,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,27,61,0.1)]"
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <div className="text-[16px] font-bold text-[#0F1B3D]">{teacher.name}</div>
        <div className="text-[13px] font-medium text-[#2880DE]">{teacher.role}</div>
        <div className="text-[12px] text-slate-500">{teacher.tags}</div>
        <div className="mt-1.5 flex items-center justify-between text-[12px] text-slate-500">
          <span>{teacher.experience}</span>
          <span className="flex items-center gap-1 font-semibold text-[#0F1B3D]">
            <Star className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} fill="currentColor" />
            {teacher.rating.replace("★", "").trim()}
          </span>
        </div>
        <div className="text-[12px] text-slate-400">{teacher.students}</div>
        <span className="mt-3 text-[13.5px] font-semibold text-[#2880DE] transition-colors group-hover:text-[#2066B2]">
          Смотреть профиль →
        </span>
      </div>
    </button>
  );
}
