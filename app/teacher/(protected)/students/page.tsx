import Link from "next/link";
import { User, Flame, Zap, Users } from "lucide-react";
import { getCurrentTeacher, getStudents } from "@/lib/teacher-data";

function initials(name: string | null) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export default async function TeacherStudentsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const students = await getStudents(teacher.id);

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Мои ученики</h1>
        <p className="mt-1.5 text-[14.5px] text-ze-muted">{students.length} учеников в вашем кабинете.</p>
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {students.map((student) => {
            const progress = student.progress ?? 0;
            return (
              <Link
                key={student.id}
                href={`/teacher/students/${student.id}`}
                className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-ze-surface text-[14px] font-bold text-ze-ink">
                    {student.fullName ? initials(student.fullName) : <User className="h-5 w-5 text-ze-muted" strokeWidth={1.75} />}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[16px] font-bold text-ze-ink">{student.fullName || "Без имени"}</div>
                    {student.examType && (
                      <div className="text-[13px] text-ze-muted">Цель: {student.examType.toUpperCase()}</div>
                    )}
                  </div>
                </div>

                {student.currentScore !== null && student.targetScore !== null && (
                  <div className="mt-3.5 text-[13px] text-ze-muted">
                    Сейчас: {student.currentScore} · Прогресс: {progress}%
                  </div>
                )}

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ze-surface">
                  <div
                    className="h-full rounded-full bg-ze-primary transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>

                <div className="mt-3.5 flex items-center gap-4 text-[13px] text-ze-muted">
                  {student.streak !== null && (
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} fill="currentColor" />
                      {student.streak}
                    </span>
                  )}
                  {student.xp !== null && (
                    <span className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} fill="currentColor" />
                      {student.xp.toLocaleString("ru-RU")}
                    </span>
                  )}
                </div>

                <span className="mt-4 inline-block text-[13.5px] font-semibold text-ze-primary">Подробнее →</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
          <Users className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
          <div className="text-[14.5px] font-semibold text-ze-ink">У вас пока нет учеников</div>
        </div>
      )}
    </div>
  );
}
