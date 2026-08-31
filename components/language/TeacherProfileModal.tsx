"use client";

import { useEffect } from "react";
import { X, BadgeCheck, User } from "lucide-react";
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
      <div className="absolute inset-0 bg-[#0B1226]/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex w-full max-w-[820px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_30px_80px_rgba(15,27,61,0.28)] sm:flex-row sm:rounded-[28px]">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0F1B3D] shadow-[0_2px_10px_rgba(15,27,61,0.15)] transition-colors hover:bg-white"
        >
          <X className="h-4.5 w-4.5" strokeWidth={2} />
        </button>

        <div className="aspect-[16/10] w-full flex-none overflow-hidden bg-[#1A2650] sm:aspect-auto sm:w-[280px]">
          {teacher.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teacher.photo} alt={teacher.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-14 w-14 text-white/30" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-8">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#DDE4F5] bg-[#F3F7FF] px-3 py-1 text-[12.5px] font-semibold text-[#2880DE]">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Преподаватель ZagranEasy
          </div>

          <h3 className="mt-3.5 text-[24px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[28px]">{teacher.name}</h3>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#F5F7FB] px-3 py-1 text-[12.5px] font-semibold text-[#0F1B3D]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {teacher.bio && <p className="mt-4 text-[14.5px] leading-relaxed text-slate-600">{teacher.bio}</p>}

          <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row">
            <a
              href="#finder"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-[#2880DE] px-6 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(50,85,173,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2066B2]"
            >
              Записаться на пробный урок
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
