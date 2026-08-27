import Link from "next/link";
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
  { key: "studentsCount" as const, icon: "👥", label: "Учеников" },
  { key: "lessonsToday" as const, icon: "📚", label: "Уроков сегодня" },
  { key: "pendingReviewCount" as const, icon: "📝", label: "На проверку" },
  { key: "attendanceRate" as const, icon: "🔥", label: "Посещаемость", suffix: "%" },
];

export default async function TeacherDashboardPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const [stats, nextLesson, pendingReviews] = await Promise.all([
    getDashboardStats(teacher.id),
    getNextLesson(teacher.id),
    getPendingReviews(teacher.id, 5),
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink">Здравствуйте, {teacher.fullName || "учитель"}!</h1>
        <p className="mt-1 text-[14px] text-ze-muted">Обзор вашего кабинета преподавателя.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const value = stats[card.key];
          return (
            <div key={card.key} className="rounded-xl border border-ze-border bg-white p-5">
              <div className="text-[22px]">{card.icon}</div>
              <div className="mt-2 text-[26px] font-extrabold text-ze-ink">
                {value === null ? "—" : value}
                {card.suffix && value !== null ? card.suffix : ""}
              </div>
              <div className="text-[13px] text-ze-muted">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="mb-2 text-[15px] font-bold text-ze-ink">Ближайший урок</h2>
        {nextLesson ? (
          <div className="rounded-xl border border-ze-border bg-white p-5">
            <div className="text-[16px] font-bold text-ze-ink">{nextLesson.title}</div>
            <div className="mt-1 text-[13.5px] text-ze-muted">
              {formatLessonTime(nextLesson.scheduledAt)} · {nextLesson.studentCount} учеников
            </div>
            <div className="mt-4 flex gap-2">
              {nextLesson.meetingUrl && (
                <a
                  href={nextLesson.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-ze-primary-dark"
                >
                  Начать урок
                </a>
              )}
              <Link
                href={`/teacher/lessons/${nextLesson.id}`}
                className="rounded-lg px-4 py-2.5 text-[13.5px] font-semibold text-ze-primary hover:bg-blue-50"
              >
                Материалы
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ze-border bg-white p-5 text-[13.5px] text-ze-muted">
            Ближайших уроков нет.
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-ze-ink">Задания на проверку</h2>
          <Link href="/teacher/assignments" className="text-[13px] font-semibold text-ze-primary hover:underline">
            Все задания →
          </Link>
        </div>
        {pendingReviews.length > 0 ? (
          <div className="divide-y divide-ze-border rounded-xl border border-ze-border bg-white">
            {pendingReviews.map((review) => (
              <Link
                key={review.id}
                href={`/teacher/assignments/${review.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-[13.5px] hover:bg-ze-surface"
              >
                <span className="text-ze-ink">
                  <span className="font-semibold">{review.studentName}</span> · {review.taskTitle}
                </span>
                <span className="text-ze-muted">{formatTimeAgo(review.createdAt)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ze-border bg-white p-5 text-[13.5px] text-ze-muted">
            Нет заданий на проверку.
          </div>
        )}
      </div>
    </div>
  );
}
