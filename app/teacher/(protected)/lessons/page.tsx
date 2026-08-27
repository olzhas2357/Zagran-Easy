import Link from "next/link";
import { getCurrentTeacher, getLessonsSplit } from "@/lib/teacher-data";

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default async function TeacherLessonsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const { upcoming, past } = await getLessonsSplit(teacher.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink">Мои уроки</h1>
          <p className="mt-1 text-[14px] text-ze-muted">Расписание и история занятий.</p>
        </div>
        <Link
          href="/teacher/lessons/new"
          className="rounded-lg bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-ze-primary-dark"
        >
          + Создать урок
        </Link>
      </div>

      <div>
        <h2 className="mb-2 text-[15px] font-bold text-ze-ink">Предстоящие</h2>
        {upcoming.length > 0 ? (
          <div className="divide-y divide-ze-border rounded-xl border border-ze-border bg-white">
            {upcoming.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/teacher/lessons/${lesson.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-[13.5px] hover:bg-ze-surface"
              >
                <div>
                  <div className="font-semibold text-ze-ink">{lesson.title}</div>
                  <div className="text-ze-muted">
                    {formatDateTime(lesson.scheduledAt)} · {lesson.durationMinutes} мин · {lesson.studentCount} учеников
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ze-border bg-white p-5 text-[13.5px] text-ze-muted">
            Нет предстоящих уроков.
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-[15px] font-bold text-ze-ink">Прошедшие</h2>
        {past.length > 0 ? (
          <div className="divide-y divide-ze-border rounded-xl border border-ze-border bg-white">
            {past.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/teacher/lessons/${lesson.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-[13.5px] hover:bg-ze-surface"
              >
                <div>
                  <div className="font-semibold text-ze-ink">{lesson.title}</div>
                  <div className="text-ze-muted">
                    {formatDateTime(lesson.scheduledAt)} · {lesson.durationMinutes} мин · {lesson.studentCount} учеников
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ze-border bg-white p-5 text-[13.5px] text-ze-muted">
            Прошедших уроков пока нет.
          </div>
        )}
      </div>
    </div>
  );
}
