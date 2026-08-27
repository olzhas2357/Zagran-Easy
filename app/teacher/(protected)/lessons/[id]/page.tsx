import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentTeacher, getLessonById } from "@/lib/teacher-data";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default async function TeacherLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const lesson = await getLessonById(teacher.id, id);
  if (!lesson) notFound();

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link href="/teacher/lessons" className="text-[13.5px] font-semibold text-ze-primary hover:underline">
        ← Мои уроки
      </Link>

      <div className="rounded-xl border border-ze-border bg-white p-5">
        <h1 className="text-[20px] font-extrabold text-ze-ink">{lesson.title}</h1>
        <div className="mt-1 text-[13.5px] text-ze-muted">
          {formatDateTime(lesson.scheduledAt)} · {lesson.durationMinutes} мин
        </div>
        {lesson.description && <p className="mt-3 text-[13.5px] text-ze-ink">{lesson.description}</p>}

        <div className="mt-4 flex gap-2">
          {lesson.meetingUrl && (
            <a
              href={lesson.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-ze-primary-dark"
            >
              Начать урок
            </a>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-ze-border bg-white p-5">
        <div className="text-[13px] font-semibold text-ze-muted">Ученики ({lesson.students.length})</div>
        {lesson.students.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {lesson.students.map((s) => (
              <Link
                key={s.id}
                href={`/teacher/students/${s.id}`}
                className="rounded-full border border-ze-border px-3 py-1.5 text-[12.5px] font-medium text-ze-ink hover:border-slate-300"
              >
                {s.fullName || "Без имени"}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-[13px] text-ze-muted">Ученики не назначены.</div>
        )}
      </div>

      <div className="rounded-xl border border-ze-border bg-white p-5">
        <div className="text-[13px] font-semibold text-ze-muted">Материалы</div>
        {lesson.materials.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {lesson.materials.map((m, i) => (
              <li key={m.url + i}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13.5px] font-medium text-ze-primary hover:underline"
                >
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 text-[13px] text-ze-muted">Материалов нет.</div>
        )}
      </div>
    </div>
  );
}
