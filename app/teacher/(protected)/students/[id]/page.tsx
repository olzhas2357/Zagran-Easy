import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentTeacher, getStudentById } from "@/lib/teacher-data";

export default async function TeacherStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const student = await getStudentById(teacher.id, id);
  if (!student) notFound();

  const progress = student.progress ?? 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link href="/teacher/students" className="text-[13.5px] font-semibold text-ze-primary hover:underline">
        ← Мои ученики
      </Link>

      <div className="rounded-xl border border-ze-border bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ze-surface text-[20px]">
            👤
          </div>
          <div>
            <div className="text-[18px] font-extrabold text-ze-ink">{student.fullName || "Без имени"}</div>
            {student.phone && <div className="text-[13px] text-ze-muted">{student.phone}</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ze-border bg-white p-5">
          <div className="text-[13px] font-semibold text-ze-muted">Цель</div>
          <div className="mt-1 text-[16px] font-bold text-ze-ink">
            {student.examType ? student.examType.toUpperCase() : "Не задана"}
          </div>
          {student.currentScore !== null && student.targetScore !== null && (
            <div className="mt-1 text-[13.5px] text-ze-muted">
              Сейчас: {student.currentScore} · Цель: {student.targetScore}
            </div>
          )}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ze-surface">
            <div
              className="h-full rounded-full bg-ze-primary"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="mt-1 text-[12.5px] text-ze-muted">{progress}%</div>
        </div>

        <div className="rounded-xl border border-ze-border bg-white p-5">
          <div className="text-[13px] font-semibold text-ze-muted">Активность</div>
          <div className="mt-2 flex gap-6">
            <div>
              <div className="text-[22px] font-extrabold text-ze-ink">{student.streak ?? "—"}</div>
              <div className="text-[12.5px] text-ze-muted">Streak 🔥</div>
            </div>
            <div>
              <div className="text-[22px] font-extrabold text-ze-ink">
                {student.xp !== null ? student.xp.toLocaleString("ru-RU") : "—"}
              </div>
              <div className="text-[12.5px] text-ze-muted">XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
