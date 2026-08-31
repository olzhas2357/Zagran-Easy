import { Star, ArrowUpRight } from "lucide-react";
import type { LanguageTeacher } from "@/lib/language-data";

export function TeacherCard({ teacher, onOpen }: { teacher: LanguageTeacher; onOpen: (teacher: LanguageTeacher) => void }) {
  const tags = teacher.tags.split("·").map((t) => t.trim()).filter(Boolean);

  return (
    <button
      type="button"
      onClick={() => onOpen(teacher)}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-[#0F1B3D] text-left shadow-[0_1px_2px_rgba(15,27,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,27,61,0.18)]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1226] via-[#0B1226]/25 to-transparent" />

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 shadow-[0_4px_12px_rgba(15,27,61,0.18)] backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} fill="currentColor" />
          <span className="text-[12.5px] font-bold text-[#0F1B3D]">{teacher.rating.replace("★", "").trim()}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-[17px] font-bold leading-tight text-white">{teacher.name}</div>
          <div className="mt-0.5 text-[12.5px] font-medium text-white/75">{teacher.role}</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 bg-white p-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-[#F1F4FC] px-2.5 py-1 text-[11.5px] font-semibold text-[#0F1B3D]">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between text-[12px] text-slate-400">
          <span>{teacher.experience}</span>
          <span>{teacher.students}</span>
        </div>
        <span className="flex items-center justify-between rounded-xl bg-[#F1F4FC] px-3.5 py-2.5 text-[13px] font-semibold text-[#2880DE] transition-colors group-hover:bg-[#2880DE] group-hover:text-white">
          Смотреть профиль
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
        </span>
      </div>
    </button>
  );
}
