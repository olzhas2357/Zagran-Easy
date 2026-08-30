import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Video, Users, FolderOpen, FileText } from "lucide-react";
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
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <Link href="/teacher/lessons" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Мои уроки
      </Link>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink sm:text-[24px]">{lesson.title}</h1>
        <div className="mt-2 flex items-center gap-1.5 text-[13.5px] text-ze-muted">
          <Clock className="h-4 w-4" strokeWidth={1.75} />
          {formatDateTime(lesson.scheduledAt)} · {lesson.durationMinutes} мин
        </div>
        {lesson.description && <p className="mt-4 text-[14.5px] leading-relaxed text-ze-ink">{lesson.description}</p>}

        {lesson.meetingUrl && (
          <div className="mt-5">
            <a
              href={lesson.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark"
            >
              <Video className="h-4.5 w-4.5" strokeWidth={2} />
              Начать урок
            </a>
          </div>
        )}
      </div>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="flex items-center gap-2 text-[13.5px] font-bold text-ze-ink">
          <Users className="h-4.5 w-4.5 text-ze-muted" strokeWidth={1.75} />
          Ученики ({lesson.students.length})
        </div>
        {lesson.students.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {lesson.students.map((s) => (
              <Link
                key={s.id}
                href={`/teacher/students/${s.id}`}
                className="rounded-full border border-ze-border px-3.5 py-1.5 text-[13px] font-medium text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary"
              >
                {s.fullName || "Без имени"}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-[13.5px] text-ze-muted">Ученики не назначены.</div>
        )}
      </div>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="flex items-center gap-2 text-[13.5px] font-bold text-ze-ink">
          <FolderOpen className="h-4.5 w-4.5 text-ze-muted" strokeWidth={1.75} />
          Материалы
        </div>
        {lesson.materials.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {lesson.materials.map((m, i) => (
              <li key={m.url + i}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[14px] font-medium text-ze-primary hover:underline"
                >
                  <FileText className="h-4 w-4 flex-none" strokeWidth={1.75} />
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-2 text-[13.5px] text-ze-muted">Материалов нет.</div>
        )}
      </div>
    </div>
  );
}
