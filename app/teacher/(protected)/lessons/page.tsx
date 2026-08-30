import Link from "next/link";
import { Plus, Clock, Users, CalendarClock, History } from "lucide-react";
import { getCurrentTeacher, getLessonsSplit, type LessonListItem } from "@/lib/teacher-data";

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

function LessonRow({ lesson }: { lesson: LessonListItem }) {
  return (
    <Link
      href={`/teacher/lessons/${lesson.id}`}
      className="flex items-center justify-between gap-3 px-5 py-4 text-[14px] transition-colors hover:bg-ze-surface"
    >
      <div className="min-w-0">
        <div className="truncate font-semibold text-ze-ink">{lesson.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ze-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            {formatDateTime(lesson.scheduledAt)} · {lesson.durationMinutes} мин
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
            {lesson.studentCount} учеников
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof CalendarClock; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
      <Icon className="h-6 w-6 text-ze-muted" strokeWidth={1.5} />
      <div className="text-[13.5px] text-ze-muted">{text}</div>
    </div>
  );
}

export default async function TeacherLessonsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const { upcoming, past } = await getLessonsSplit(teacher.id);

  return (
    <div className="flex flex-col gap-8 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Мои уроки</h1>
          <p className="mt-1.5 text-[14.5px] text-ze-muted">Расписание и история занятий.</p>
        </div>
        <Link
          href="/teacher/lessons/new"
          className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2} />
          Создать урок
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-[17px] font-bold text-ze-ink">Предстоящие</h2>
        {upcoming.length > 0 ? (
          <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {upcoming.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CalendarClock} text="Нет предстоящих уроков." />
        )}
      </div>

      <div>
        <h2 className="mb-3 text-[17px] font-bold text-ze-ink">Прошедшие</h2>
        {past.length > 0 ? (
          <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {past.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <EmptyState icon={History} text="Прошедших уроков пока нет." />
        )}
      </div>
    </div>
  );
}
