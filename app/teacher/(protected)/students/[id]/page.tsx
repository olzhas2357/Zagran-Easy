import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Flame, Zap } from "lucide-react";
import { getCurrentTeacher, getStudentById } from "@/lib/teacher-data";

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export default async function TeacherStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const student = await getStudentById(teacher.id, id);
  if (!student) notFound();

  const progress = student.progress ?? 0;

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <Link href="/teacher/students" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Мои ученики
      </Link>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-ze-surface text-[16px] font-bold text-ze-ink">
            {student.fullName ? initials(student.fullName) : <User className="h-6 w-6 text-ze-muted" strokeWidth={1.75} />}
          </div>
          <div>
            <div className="text-[19px] font-extrabold text-ze-ink">{student.fullName || "Без имени"}</div>
            {student.phone && <div className="mt-0.5 text-[13.5px] text-ze-muted">{student.phone}</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="text-[13px] font-semibold text-ze-muted">Цель</div>
          <div className="mt-1.5 text-[17px] font-bold text-ze-ink">
            {student.examType ? student.examType.toUpperCase() : "Не задана"}
          </div>
          {student.currentScore !== null && student.targetScore !== null && (
            <div className="mt-1.5 text-[14px] text-ze-muted">
              Сейчас: {student.currentScore} · Цель: {student.targetScore}
            </div>
          )}
          <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-ze-surface">
            <div
              className="h-full rounded-full bg-ze-primary transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="mt-1.5 text-[12.5px] text-ze-muted">{progress}%</div>
        </div>

        <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="text-[13px] font-semibold text-ze-muted">Активность</div>
          <div className="mt-3 flex gap-7">
            <div>
              <div className="flex items-center gap-1.5 text-[24px] font-extrabold text-ze-ink">
                <Flame className="h-5 w-5 text-amber-500" strokeWidth={2} fill="currentColor" />
                {student.streak ?? "—"}
              </div>
              <div className="mt-1 text-[12.5px] text-ze-muted">Серия дней</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[24px] font-extrabold text-ze-ink">
                <Zap className="h-5 w-5 text-blue-600" strokeWidth={2} fill="currentColor" />
                {student.xp !== null ? student.xp.toLocaleString("ru-RU") : "—"}
              </div>
              <div className="mt-1 text-[12.5px] text-ze-muted">Очки опыта</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
