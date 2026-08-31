import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Flame, Zap, Target } from "lucide-react";
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

      {/* Profile hero: banner + overlapping avatar, like a real profile page rather than a data card */}
      <div className="overflow-hidden rounded-[24px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="h-20 bg-gradient-to-r from-[#0F1B3D] to-[#1A56DB] sm:h-24" />
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-9 flex flex-col gap-3 sm:-mt-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3.5">
              <div className="flex h-[72px] w-[72px] flex-none items-center justify-center rounded-2xl border-4 border-white bg-ze-surface text-[19px] font-bold text-ze-ink shadow-[0_4px_12px_rgba(15,23,42,0.1)] sm:h-20 sm:w-20">
                {student.fullName ? initials(student.fullName) : <User className="h-7 w-7 text-ze-muted" strokeWidth={1.75} />}
              </div>
              <div className="pb-1">
                <div className="text-[19px] font-extrabold text-ze-ink sm:text-[21px]">{student.fullName || "Без имени"}</div>
                {student.phone && <div className="mt-0.5 text-[13.5px] text-ze-muted">{student.phone}</div>}
              </div>
            </div>
            {student.examType && (
              <span className="w-fit rounded-full bg-blue-50 px-3.5 py-1.5 text-[13px] font-bold text-blue-700">
                Цель: {student.examType.toUpperCase()}
              </span>
            )}
          </div>

          {/* Unified activity strip — same pattern as the dashboard stat strip, for product-wide consistency */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-ze-border rounded-[16px] border border-ze-border bg-ze-surface/60">
            <div className="flex flex-col items-center gap-1 py-3.5">
              <div className="flex items-center gap-1.5 text-[20px] font-extrabold text-ze-ink">
                <Flame className="h-4.5 w-4.5 text-amber-500" strokeWidth={2} fill="currentColor" />
                {student.streak ?? "—"}
              </div>
              <div className="text-[12px] text-ze-muted">Серия дней</div>
            </div>
            <div className="flex flex-col items-center gap-1 py-3.5">
              <div className="flex items-center gap-1.5 text-[20px] font-extrabold text-ze-ink">
                <Zap className="h-4.5 w-4.5 text-blue-600" strokeWidth={2} fill="currentColor" />
                {student.xp !== null ? student.xp.toLocaleString("ru-RU") : "—"}
              </div>
              <div className="text-[12px] text-ze-muted">Очки опыта</div>
            </div>
            <div className="flex flex-col items-center gap-1 py-3.5">
              <div className="flex items-center gap-1.5 text-[20px] font-extrabold text-ze-ink">
                <Target className="h-4.5 w-4.5 text-emerald-600" strokeWidth={2} />
                {progress}%
              </div>
              <div className="text-[12px] text-ze-muted">К цели</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress toward goal gets its own dedicated panel — it's the most decision-relevant info for a teacher */}
      {(student.currentScore !== null && student.targetScore !== null) && (
        <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex items-center justify-between text-[13px] font-semibold text-ze-muted">
            <span>Прогресс к цели</span>
            <span>
              {student.currentScore} <span className="text-ze-border">→</span> {student.targetScore}
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ze-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ze-primary to-[#3D7BFF] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
