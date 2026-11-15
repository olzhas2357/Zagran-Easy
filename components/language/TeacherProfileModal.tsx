"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X, BadgeCheck, User, BriefcaseBusiness, Award, ArrowRight, Sparkles,
  Clock, CalendarDays, Users, Globe, GraduationCap,
} from "lucide-react";
import type { LanguageTeacher } from "@/lib/language-data";

const WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 dark:text-white/45">
      <Icon className="h-4 w-4" strokeWidth={2} />
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string | number; label: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-blue-100/70 bg-gradient-to-br from-blue-50/80 to-slate-50 p-3.5 dark:border-white/5 dark:from-blue-400/10 dark:to-white/5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#2880DE] shadow-sm dark:bg-white/10 dark:text-[#8FD9F5]">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <div>
        <div className="text-[22px] font-extrabold leading-none tracking-[-0.03em] text-ze-ink dark:text-white">{value}</div>
        <div className="mt-1 text-[12px] font-medium leading-4 text-slate-500 dark:text-white/55">{label}</div>
      </div>
    </div>
  );
}

export function TeacherProfileModal({ teacher, onClose }: { teacher: LanguageTeacher | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!teacher) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  const tags = teacher.tags.split("·").map((t) => t.trim()).filter(Boolean);

  const stats: { icon: React.ElementType; value: string | number; label: string }[] = [];
  if (teacher.experienceYears != null) {
    stats.push({
      icon: GraduationCap,
      value: teacher.experienceYears,
      label: `${plural(teacher.experienceYears, "год", "года", "лет")} опыта`,
    });
  }
  if (teacher.studentsCount != null) {
    stats.push({
      icon: Users,
      value: teacher.studentsCount,
      label: "учеников",
    });
  }
  if (teacher.lessonDuration != null) {
    stats.push({
      icon: Clock,
      value: teacher.lessonDuration,
      label: "минут — один урок",
    });
  }

  const schedule = teacher.schedule ?? {};
  const activeDays = WEEK.filter((d) => (schedule[d]?.length ?? 0) > 0);
  const hasSchedule = activeDays.length > 0;
  const items = teacher.experienceItems ?? [];

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <div className="absolute inset-0 bg-[#050914]/75 backdrop-blur-md" onClick={onClose} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="teacher-profile-title" className="relative w-full max-w-[940px] overflow-hidden rounded-t-[32px] border border-white/15 bg-white shadow-[0_30px_100px_rgba(2,8,23,0.45)] sm:rounded-[32px] dark:bg-[#101A34]">
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-[#0B132B] shadow-[0_4px_16px_rgba(0,0,0,0.18)] outline-none backdrop-blur transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-blue-500/30"
        >
          <X className="h-4.5 w-4.5" strokeWidth={2} />
        </button>

        <div className="max-h-[92dvh] overflow-y-auto overscroll-contain sm:grid sm:min-h-[min(560px,92dvh)] sm:grid-cols-[minmax(280px,0.78fr)_1.22fr] sm:overflow-hidden">
        <div className="relative min-h-[260px] w-full overflow-hidden bg-slate-100 sm:min-h-0 dark:bg-white/5">
          {teacher.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teacher.photo} alt={teacher.name} className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-14 w-14 text-slate-300 dark:text-white/30" strokeWidth={1.5} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071126]/90 via-[#071126]/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white/90 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-[#8FD9F5]" /> Индивидуальный подход к обучению
            </div>
          </div>
        </div>

        <div className="min-w-0 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:max-h-[min(620px,92dvh)] sm:overflow-y-auto sm:overscroll-contain sm:p-10">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[12.5px] font-semibold text-blue-700 dark:border-[#2880DE]/30 dark:bg-[#2880DE]/15 dark:text-[#8FD9F5]">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Преподаватель ZagranEasy
          </div>

          <h3 id="teacher-profile-title" className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ze-ink sm:text-[36px] dark:text-white">{teacher.name}</h3>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {teacher.bio && <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-slate-600 dark:text-white/65">{teacher.bio}</p>}

          {/* СТАТИСТИКА */}
          {stats.length > 0 && (
            <div className={`mt-6 grid gap-2.5 ${stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          )}

          {/* ВРЕМЯ ЗАНЯТИЙ */}
          {hasSchedule && (
            <section className="mt-7" aria-label="Время занятий">
              <SectionTitle icon={CalendarDays}>Время занятий</SectionTitle>

              {/* лента дней недели */}
              <div className="grid grid-cols-7 gap-1.5">
                {WEEK.map((d) => {
                  const active = (schedule[d]?.length ?? 0) > 0;
                  return (
                    <div
                      key={d}
                      className={
                        "flex h-10 items-center justify-center rounded-xl text-[13px] font-bold transition-colors " +
                        (active
                          ? "bg-[#2880DE] text-white shadow-[0_6px_16px_rgba(40,128,222,0.28)]"
                          : "bg-slate-100 text-slate-300 dark:bg-white/5 dark:text-white/25")
                      }
                      aria-label={active ? `${d}: время указано` : `${d}: время не указано`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>

              {/* слоты по рабочим дням */}
              <ul className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 dark:divide-white/5 dark:border-white/5">
                {activeDays.map((d) => (
                  <li key={d} className="flex items-start gap-3 px-4 py-2.5">
                    <span className="mt-0.5 w-7 flex-none text-[13px] font-extrabold text-ze-ink dark:text-white">{d}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {schedule[d]?.map((slot) => (
                        <span key={slot} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[12.5px] font-semibold tabular-nums text-blue-700 dark:bg-[#2880DE]/15 dark:text-[#8FD9F5]">
                          <Clock className="h-3 w-3" strokeWidth={2.2} />
                          {slot}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>

              {teacher.timezone && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-white/40">
                  <Globe className="h-3.5 w-3.5" /> Время указано по: {teacher.timezone}
                </div>
              )}
            </section>
          )}

          {/* ОПЫТ */}
          {(items.length > 0 || teacher.experience) && (
            <section className="mt-7" aria-label="Опыт и подход">
              <SectionTitle icon={BriefcaseBusiness}>Опыт и подход</SectionTitle>

              {items.length > 0 && (
                <ol className="relative ml-[15px] border-l-2 border-slate-100 dark:border-white/10">
                  {items.map((it, i) => (
                    <li key={i} className="relative pb-5 pl-6 last:pb-0">
                      <span className={
                        "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-[3px] border-white dark:border-[#101A34] " +
                        (i === 0 ? "bg-[#2880DE] ring-4 ring-blue-100 dark:ring-[#2880DE]/20" : "bg-slate-300 dark:bg-white/30")
                      } />
                      <div className="text-[12px] font-bold uppercase tracking-wide text-[#2880DE] dark:text-[#8FD9F5]">{it.period}</div>
                      <div className="mt-0.5 text-[15px] font-bold text-ze-ink dark:text-white">{it.title}</div>
                      {it.place && <div className="text-[13px] text-slate-500 dark:text-white/55">{it.place}</div>}
                    </li>
                  ))}
                </ol>
              )}

              {teacher.experience && (
                <div className={`flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-[13.5px] leading-6 text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-white/70 ${items.length > 0 ? "mt-5" : ""}`}>
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white text-[#2880DE] shadow-sm dark:bg-white/10">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <b className="text-ze-ink dark:text-white">Подход к обучению</b>
                    <div className="whitespace-pre-line">{teacher.experience}</div>
                  </div>
                </div>
              )}
            </section>
          )}

          {teacher.certificateUrl && (
            <a href={teacher.certificateUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3 text-[13px] font-bold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:text-emerald-300">
              <Award className="h-4.5 w-4.5" />Посмотреть сертификат <ArrowRight className="ml-auto h-4 w-4" />
            </a>
          )}

        </div>
        </div>
      </div>
    </div>,
    document.body
  );
}