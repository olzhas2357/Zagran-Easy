import { ArrowRight, User } from "lucide-react";
import type { LanguageTeacher } from "@/lib/language-data";

export function TeacherCard({ teacher, onOpen }: { teacher: LanguageTeacher; onOpen: (teacher: LanguageTeacher) => void }) {
  const tags = teacher.tags.split("·").map((t) => t.trim()).filter(Boolean);

  return (
    <button
      type="button"
      onClick={() => onOpen(teacher)}
      aria-label={`Открыть профиль преподавателя ${teacher.name}`}
      className="group relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-[28px] border border-white bg-white text-left shadow-[0_12px_40px_rgba(30,64,175,0.09)] outline-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(30,64,175,0.18)] focus-visible:ring-4 focus-visible:ring-blue-500/25 sm:min-h-0 dark:border-white/10 dark:bg-white/[0.055] dark:shadow-none dark:backdrop-blur-sm dark:hover:border-blue-300/25 dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-slate-100 sm:aspect-[4/5] dark:bg-white/5">
        {teacher.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={teacher.photo}
            alt={teacher.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-12 w-12 text-slate-300 dark:text-white/30" strokeWidth={1.5} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071126]/90 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/30 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-md dark:bg-[#0B132B]/75 dark:text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Преподаватель
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="text-[20px] font-bold leading-tight tracking-[-0.02em] text-white">{teacher.name}</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#1A56DB] dark:bg-blue-400/10 dark:text-[#9EDAFF]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {teacher.experience && (
          <p className="mt-4 line-clamp-2 text-[13px] leading-5 text-slate-500 dark:text-white/50">{teacher.experience}</p>
        )}
        <span className="mt-auto flex items-center gap-2 pt-5 text-[13px] font-bold text-[#1A56DB] dark:text-[#8FD9F5]">
          Познакомиться
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#1A56DB] group-hover:text-white dark:bg-white/10">
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </span>
        </span>
      </div>
    </button>
  );
}
