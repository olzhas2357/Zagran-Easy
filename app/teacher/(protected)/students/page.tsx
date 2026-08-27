import Link from "next/link";
import { getCurrentTeacher, getStudents } from "@/lib/teacher-data";

export default async function TeacherStudentsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const students = await getStudents(teacher.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink">Мои ученики</h1>
        <p className="mt-1 text-[14px] text-ze-muted">{students.length} учеников в вашем кабинете.</p>
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {students.map((student) => {
            const progress = student.progress ?? 0;
            return (
              <div key={student.id} className="rounded-xl border border-ze-border bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ze-surface text-[18px]">
                    👤
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-bold text-ze-ink">{student.fullName || "Без имени"}</div>
                    {student.examType && (
                      <div className="text-[13px] text-ze-muted">Цель: {student.examType.toUpperCase()}</div>
                    )}
                  </div>
                </div>

                {student.currentScore !== null && student.targetScore !== null && (
                  <div className="mt-3 text-[13px] text-ze-muted">
                    Сейчас: {student.currentScore} · Прогресс: {progress}%
                  </div>
                )}

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ze-surface">
                  <div
                    className="h-full rounded-full bg-ze-primary"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center gap-4 text-[13px] text-ze-muted">
                  {student.streak !== null && <span>Streak: 🔥 {student.streak}</span>}
                  {student.xp !== null && <span>XP: {student.xp.toLocaleString("ru-RU")}</span>}
                </div>

                <Link
                  href={`/teacher/students/${student.id}`}
                  className="mt-4 inline-block text-[13.5px] font-semibold text-ze-primary hover:underline"
                >
                  Подробнее →
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-ze-border bg-white p-5 text-[13.5px] text-ze-muted">
          У вас пока нет учеников.
        </div>
      )}
    </div>
  );
}
