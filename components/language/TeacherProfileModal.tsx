"use client";

import { useEffect } from "react";
import { X, BadgeCheck, User, BriefcaseBusiness, Award } from "lucide-react";
import type { LanguageTeacher } from "@/lib/language-data";

export function TeacherProfileModal({ teacher, onClose }: { teacher: LanguageTeacher | null; onClose: () => void }) {
  useEffect(() => {
    if (!teacher) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  const tags = teacher.tags.split("·").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[#050914]/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex w-full max-w-[820px] flex-col overflow-hidden rounded-t-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] sm:flex-row sm:rounded-[28px] dark:border-white/10 dark:bg-[#0F1830] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0B132B] shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-colors hover:bg-white"
        >
          <X className="h-4.5 w-4.5" strokeWidth={2} />
        </button>

        <div className="aspect-[16/10] w-full flex-none overflow-hidden bg-slate-100 sm:aspect-auto sm:w-[280px] dark:bg-white/5">
          {teacher.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teacher.photo} alt={teacher.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-14 w-14 text-slate-300 dark:text-white/30" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-8">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[12.5px] font-semibold text-blue-700 dark:border-[#2880DE]/30 dark:bg-[#2880DE]/15 dark:text-[#8FD9F5]">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Преподаватель ZagranEasy
          </div>

          <h3 className="mt-3.5 text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px] dark:text-white">{teacher.name}</h3>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-[12.5px] font-semibold text-slate-600 dark:bg-white/8 dark:text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {teacher.bio && <p className="mt-4 text-[14.5px] leading-relaxed text-slate-600 dark:text-white/65">{teacher.bio}</p>}

          {teacher.experience && <div className="mt-4 flex gap-2.5 rounded-xl bg-slate-50 p-3 text-[13.5px] leading-relaxed text-slate-600 dark:bg-white/5 dark:text-white/70"><BriefcaseBusiness className="mt-0.5 h-4 w-4 flex-none text-[#2880DE]" /><div><b className="text-ze-ink dark:text-white">Опыт работы</b><div className="mt-0.5">{teacher.experience}</div></div></div>}
          {teacher.certificateUrl && <a href={teacher.certificateUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2.5 text-[13.5px] font-semibold text-emerald-700 dark:border-emerald-400/20 dark:text-emerald-300"><Award className="h-4 w-4" />Посмотреть сертификат ↗</a>}

          <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row">
            <a
              href="#finder"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#2880DE] to-[#22D3EE] px-6 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(34,211,238,0.3)] transition-all duration-200 hover:-translate-y-0.5"
            >
              Записаться на пробный урок
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
