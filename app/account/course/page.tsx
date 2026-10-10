import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  PlayCircle,
  UserRound,
  Video,
} from "lucide-react";
import { getMyAssignments, getMyLearning, getMyLessonsSplit, getMyTeacherProfile } from "@/lib/student-data";

function formatLessonDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default async function StudentCoursePage() {
  const [{ upcoming, past }, assignments, teacher, learning] = await Promise.all([
    getMyLessonsSplit(),
    getMyAssignments(),
    getMyTeacherProfile(),
    getMyLearning(),
  ]);
  const nextLesson = upcoming[0] ?? null;
  const completedAssignments = assignments.filter((item) => item.status === "completed").length;
  const totalActivity = past.length + assignments.length;
  const completedActivity = past.length + completedAssignments;
  const progress = totalActivity > 0 ? Math.round((completedActivity / totalActivity) * 100) : 0;

  return (
    <div className="min-h-full bg-ze-surface">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.13em] text-ze-primary">Моё обучение</div>
            <h1 className="mt-2 text-[25px] font-extrabold tracking-tight text-ze-ink sm:text-[32px]">{learning.course?.title || "Языковой курс"}</h1>
            <p className="mt-1.5 text-[14px] text-ze-muted">Уроки, задания и программа курса — в одном месте.</p>
          </div>
          <Link href="/account/syllabus" className="flex items-center gap-2 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ze-ink shadow-sm hover:border-blue-200 hover:text-ze-primary">
            <FileText className="h-4 w-4" strokeWidth={1.9} />
            Открыть syllabus
          </Link>
        </div>

        <section className="relative mt-6 overflow-hidden rounded-[24px] bg-[#102A56] p-6 text-white shadow-[0_18px_44px_rgba(16,42,86,0.18)] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-[280px] w-[280px] rounded-full bg-[#4A8CFF]/25 blur-sm" />
          <div className="pointer-events-none absolute -bottom-28 right-44 h-[230px] w-[230px] rounded-full bg-cyan-300/10" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/80">
                <GraduationCap className="h-3.5 w-3.5" />
                Индивидуальная программа
              </div>
              <h2 className="mt-4 max-w-2xl text-[26px] font-extrabold leading-tight sm:text-[34px]">{learning.course?.title || "Ваш путь к уверенному языку"}</h2>
              <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-white/65">{learning.course?.description || "Продвигайтесь по плану вместе с преподавателем. Здесь всегда виден следующий шаг."}</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href={nextLesson ? `/account/lessons/${nextLesson.id}` : "/account/lessons"} className="inline-flex items-center gap-2 rounded-xl bg-white px-4.5 py-3 text-[13.5px] font-bold text-[#102A56] hover:bg-blue-50">
                  <PlayCircle className="h-4.5 w-4.5" strokeWidth={2} />
                  {nextLesson ? "Перейти к следующему уроку" : "Посмотреть уроки"}
                </Link>
                <Link href="/account/homework" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4.5 py-3 text-[13.5px] font-semibold text-white hover:bg-white/10">
                  Домашние задания
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="font-semibold text-white/70">Общий прогресс</span>
                <span className="font-extrabold text-white">{progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-gradient-to-r from-[#4A8CFF] to-[#74D5EC]" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <div>
                  <div className="text-[20px] font-extrabold">{past.length}</div>
                  <div className="mt-0.5 text-[11.5px] text-white/55">уроков пройдено</div>
                </div>
                <div>
                  <div className="text-[20px] font-extrabold">{completedAssignments}</div>
                  <div className="mt-0.5 text-[11.5px] text-white/55">заданий готово</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <div className="flex flex-col gap-5">
            <section className="rounded-[20px] border border-ze-border bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-bold text-ze-ink">Ближайший шаг</h2>
                  <p className="mt-1 text-[12.5px] text-ze-muted">Продолжите обучение с того места, где остановились.</p>
                </div>
                <CalendarDays className="h-5 w-5 text-ze-primary" strokeWidth={1.8} />
              </div>
              {nextLesson ? (
                <Link href={`/account/lessons/${nextLesson.id}`} className="mt-4 flex items-center gap-4 rounded-2xl border border-ze-border bg-ze-surface p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-blue-50 text-ze-primary"><Video className="h-5.5 w-5.5" strokeWidth={1.8} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-bold text-ze-ink">{nextLesson.title}</div>
                    <div className="mt-1 text-[12.5px] text-ze-muted">{formatLessonDate(nextLesson.scheduledAt)} · {nextLesson.durationMinutes} минут</div>
                  </div>
                  <ChevronRight className="h-4.5 w-4.5 flex-none text-ze-muted" />
                </Link>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-ze-border px-5 py-7 text-center text-[13px] text-ze-muted">Следующий урок появится после назначения преподавателем.</div>
              )}
            </section>

            <section className="rounded-[20px] border border-ze-border bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[16px] font-bold text-ze-ink">Структура обучения</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-ze-muted">Обзор</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Живые уроки", text: "Занятия с преподавателем", Icon: Video, href: "/account/lessons", color: "bg-blue-50 text-blue-700" },
                  { title: "Практика", text: "Задания после уроков", Icon: ClipboardList, href: "/account/homework", color: "bg-amber-50 text-amber-700" },
                  { title: "Программа", text: "Темы и цели курса", Icon: FileText, href: "/account/syllabus", color: "bg-violet-50 text-violet-700" },
                ].map((item) => (
                  <Link key={item.title} href={item.href} className="group rounded-2xl border border-ze-border p-4 transition-colors hover:border-blue-200 hover:bg-ze-surface">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color}`}><item.Icon className="h-4.5 w-4.5" strokeWidth={1.8} /></span>
                    <div className="mt-3 flex items-center justify-between gap-2 text-[13.5px] font-bold text-ze-ink">{item.title}<ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ze-primary" /></div>
                    <div className="mt-1 text-[11.5px] text-ze-muted">{item.text}</div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            <section className="rounded-[20px] border border-ze-border bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold text-ze-ink">Ваш преподаватель</h2>
                <UserRound className="h-4.5 w-4.5 text-ze-muted" strokeWidth={1.8} />
              </div>
              {teacher ? (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-full bg-blue-50 text-[14px] font-bold text-ze-primary">
                    {teacher.imageUrl ? <img src={teacher.imageUrl} alt={teacher.fullName} className="h-full w-full object-cover" /> : teacher.fullName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-bold text-ze-ink">{teacher.fullName}</div>
                    <div className="mt-0.5 truncate text-[12px] text-ze-muted">{teacher.specializations.join(" · ") || "Преподаватель языка"}</div>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-[12.5px] leading-relaxed text-ze-muted">Информация появится после назначения преподавателя.</p>
              )}
            </section>

            <section className="rounded-[20px] border border-ze-border bg-white p-5">
              <div className="flex items-center gap-2 text-[14px] font-bold text-ze-ink"><BookOpen className="h-4.5 w-4.5 text-ze-primary" /> Syllabus курса</div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ze-muted">Официальная программа с темами, целями и форматом занятий.</p>
              <Link href="/account/syllabus" className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-3.5 py-3 text-[13px] font-semibold text-ze-primary hover:bg-blue-100">
                Посмотреть программу <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

            <div className="flex items-start gap-3 rounded-[20px] border border-emerald-100 bg-emerald-50/70 p-4">
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 flex-none text-emerald-700" strokeWidth={2} />
              <p className="text-[12px] leading-relaxed text-emerald-900/75">Все разделы курса теперь доступны из левого меню — возвращаться на главную не нужно.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
