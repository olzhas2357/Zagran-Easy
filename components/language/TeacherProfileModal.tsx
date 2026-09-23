"use client";

import { useEffect, useRef } from "react";
import { X, BadgeCheck, User, BriefcaseBusiness, Award, ArrowRight, Sparkles } from "lucide-react";
import type { LanguageTeacher } from "@/lib/language-data";

export function TeacherProfileModal({ teacher, onClose }: { teacher: LanguageTeacher | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!teacher) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  const tags = teacher.tags.split("·").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <div className="absolute inset-0 bg-[#050914]/75 backdrop-blur-md" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="teacher-profile-title" className="relative flex max-h-[92dvh] w-full max-w-[940px] flex-col overflow-y-auto rounded-t-[32px] border border-white/15 bg-white shadow-[0_30px_100px_rgba(2,8,23,0.45)] sm:grid sm:grid-cols-[minmax(280px,0.78fr)_1.22fr] sm:overflow-hidden sm:rounded-[32px] dark:bg-[#101A34]">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-[#0B132B] shadow-[0_4px_16px_rgba(0,0,0,0.18)] outline-none backdrop-blur transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-blue-500/30"
        >
          <X className="h-4.5 w-4.5" strokeWidth={2} />
        </button>

        <div className="relative min-h-[300px] w-full overflow-hidden bg-slate-100 sm:min-h-[620px] dark:bg-white/5">
          {teacher.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teacher.photo} alt={teacher.name} className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-14 w-14 text-slate-300 dark:text-white/30" strokeWidth={1.5} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071126]/85 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 hidden text-white sm:block">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80"><Sparkles className="h-4 w-4 text-[#8FD9F5]" /> Индивидуальный подход к обучению</div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-6 sm:max-h-[620px] sm:overflow-y-auto sm:p-10">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[12.5px] font-semibold text-blue-700 dark:border-[#2880DE]/30 dark:bg-[#2880DE]/15 dark:text-[#8FD9F5]">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Преподаватель ZagranEasy
          </div>

          <h3 id="teacher-profile-title" className="mt-4 text-[28px] font-extrabold tracking-[-0.035em] text-ze-ink sm:text-[36px] dark:text-white">{teacher.name}</h3>

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

          {teacher.bio && <p className="mt-5 text-[15px] leading-7 text-slate-600 dark:text-white/65">{teacher.bio}</p>}

          {teacher.experience && <div className="mt-5 flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-[13.5px] leading-6 text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-white/70"><div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white text-[#2880DE] shadow-sm dark:bg-white/10"><BriefcaseBusiness className="h-4.5 w-4.5" /></div><div><b className="text-ze-ink dark:text-white">Опыт и подход</b><div>{teacher.experience}</div></div></div>}
          {teacher.certificateUrl && <a href={teacher.certificateUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3 text-[13px] font-bold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:text-emerald-300"><Award className="h-4.5 w-4.5" />Посмотреть сертификат <ArrowRight className="ml-auto h-4 w-4" /></a>}

          {/* <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row">
            <a href="/quiz" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ze-accent px-6 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(26,86,219,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ze-accent-dark hover:shadow-[0_14px_32px_rgba(26,86,219,0.38)]">
                Записаться на пробный урок <ArrowRight className="h-4 w-4" />
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
