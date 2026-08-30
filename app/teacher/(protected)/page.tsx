import Link from "next/link";
import { Users, BookOpen, ClipboardCheck, Flame, Video, FileText, CalendarX2, CheckCircle2, ArrowRight } from "lucide-react";
import { getCurrentTeacher, getDashboardStats, getNextLesson, getPendingReviews } from "@/lib/teacher-data";

function formatLessonTime(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Сегодня, ${time}`;
  return `${date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}, ${time}`;
}

function formatTimeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "меньше часа назад";
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
}

const STAT_CARDS = [
  { key: "studentsCount" as const, Icon: Users, label: "Учеников", color: "blue" },
  { key: "lessonsToday" as const, Icon: BookOpen, label: "Уроков сегодня", color: "violet" },
  { key: "pendingReviewCount" as const, Icon: ClipboardCheck, label: "На проверку", color: "amber" },
  { key: "attendanceRate" as const, Icon: Flame, label: "Посещаемость", suffix: "%", color: "emerald" },
];

const STAT_COLORS: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

export default async function TeacherDashboardPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const [stats, nextLesson, pendingReviews] = await Promise.all([
    getDashboardStats(teacher.id),
    getNextLesson(teacher.id),
    getPendingReviews(teacher.id, 5),
  ]);

  return (
    <div className="flex flex-col gap-8 p-5 sm:p-8">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">
          Здравствуйте, {teacher.fullName || "учитель"}!
        </h1>
        <p className="mt-1.5 text-[14.5px] text-ze-muted">Обзор вашего кабинета преподавателя.</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const value = stats[card.key];
          const colors = STAT_COLORS[card.color];
          return (
            <div
              key={card.key}
              className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors.bg}`}>
                <card.Icon className={`h-5.5 w-5.5 ${colors.text}`} strokeWidth={1.75} />
              </div>
              <div className="mt-3.5 text-[28px] font-extrabold leading-none tracking-tight text-ze-ink">
                {value === null ? "—" : value}
                {card.suffix && value !== null ? card.suffix : ""}
              </div>
              <div className="mt-1.5 text-[13.5px] text-ze-muted">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-[17px] font-bold text-ze-ink">Ближайший урок</h2>
        {nextLesson ? (
          <div className="flex flex-col gap-4 rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50">
                <Video className="h-5.5 w-5.5 text-blue-700" strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-[17px] font-bold text-ze-ink">{nextLesson.title}</div>
                <div className="mt-1 text-[13.5px] text-ze-muted">
                  {formatLessonTime(nextLesson.scheduledAt)} · {nextLesson.studentCount} учеников
                </div>
              </div>
            </div>
            <div className="flex gap-2.5">
              {nextLesson.meetingUrl && (
                <a
                  href={nextLesson.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-ze-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark"
                >
                  Начать урок
                </a>
              )}
              <Link
                href={`/teacher/lessons/${nextLesson.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-ze-border px-4 py-2.5 text-[14px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary"
              >
                <FileText className="h-4 w-4" strokeWidth={2} />
                Материалы
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
            <CalendarX2 className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
            <div className="text-[14.5px] font-semibold text-ze-ink">Ближайших уроков нет</div>
            <div className="text-[13px] text-ze-muted">Новые уроки появятся здесь, как только будут запланированы.</div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-ze-ink">Задания на проверку</h2>
          <Link href="/teacher/assignments" className="flex items-center gap-1 text-[13.5px] font-semibold text-ze-primary hover:underline">
            Все задания
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
        {pendingReviews.length > 0 ? (
          <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {pendingReviews.map((review) => (
              <Link
                key={review.id}
                href={`/teacher/assignments/${review.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 text-[14px] transition-colors hover:bg-ze-surface"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-amber-50">
                    <ClipboardCheck className="h-4.5 w-4.5 text-amber-700" strokeWidth={1.75} />
                  </span>
                  <span className="truncate text-ze-ink">
                    <span className="font-semibold">{review.studentName}</span> · {review.taskTitle}
                  </span>
                </span>
                <span className="flex-none text-[13px] text-ze-muted">{formatTimeAgo(review.createdAt)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={1.5} />
            <div className="text-[14.5px] font-semibold text-ze-ink">Все задания проверены</div>
            <div className="text-[13px] text-ze-muted">Новые работы учеников появятся здесь.</div>
          </div>
        )}
      </div>
    </div>
  );
}
