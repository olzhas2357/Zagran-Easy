import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Flame, Zap, Plus, ClipboardCheck, Clock3, CheckCircle2, ChevronRight } from "lucide-react";
import { getAssignments, getCurrentTeacher, getStudentById } from "@/lib/teacher-data";

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export default async function TeacherStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const [student, assignments] = await Promise.all([getStudentById(teacher.id, id), getAssignments(teacher.id)]);
  if (!student) notFound();

  const studentAssignments = assignments.filter((assignment) => assignment.studentId === student.id);
  const acceptedCount = studentAssignments.filter((assignment) => assignment.status === "completed").length;
  const reviewCount = studentAssignments.filter((assignment) => assignment.status === "submitted").length;
  const activeCount = studentAssignments.filter((assignment) => !["completed", "submitted"].includes(assignment.status)).length;
  const completionRate = studentAssignments.length > 0 ? Math.round((acceptedCount / studentAssignments.length) * 100) : 0;
  const level = Math.floor(Math.max(0, student.xp ?? 0) / 500) + 1;
  const recentAssignments = [...studentAssignments]
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .slice(0, 6);
  const statusLabel: Record<string, string> = { pending: "Выдано", assigned: "Выдано", in_progress: "В работе", submitted: "На проверке", returned: "На доработке", completed: "Принято", overdue: "Просрочено" };

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
            <Link href={`/teacher/assignments/new?student=${student.id}`} className="flex w-fit items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white"><Plus className="h-4 w-4" />Дать задание</Link>
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
                <ClipboardCheck className="h-4.5 w-4.5 text-emerald-600" strokeWidth={2} />
                {acceptedCount}
              </div>
              <div className="text-[12px] text-ze-muted">Принято работ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[{ label: "Уровень", value: level, icon: Zap, tone: "text-blue-600 bg-blue-50" }, { label: "На проверке", value: reviewCount, icon: ClipboardCheck, tone: "text-amber-700 bg-amber-50" }, { label: "В работе", value: activeCount, icon: Clock3, tone: "text-slate-600 bg-slate-100" }, { label: "Выполнено", value: `${completionRate}%`, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50" }].map((item) => (
          <div key={item.label} className="rounded-[18px] border border-ze-border bg-white p-4">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.tone}`}><item.icon className="h-4.5 w-4.5" /></span>
            <div className="mt-3 text-[22px] font-extrabold text-ze-ink">{item.value}</div>
            <div className="mt-0.5 text-[12px] text-ze-muted">{item.label}</div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-[17px] font-bold text-ze-ink">Последние задания</h2><span className="text-[12.5px] text-ze-muted">Всего {studentAssignments.length}</span></div>
        {recentAssignments.length > 0 ? (
          <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white">
            {recentAssignments.map((assignment) => (
              <Link key={assignment.id} href={`/teacher/assignments/${assignment.id}`} className="flex items-center justify-between gap-3 px-4.5 py-4 transition-colors hover:bg-ze-surface sm:px-5">
                <div className="min-w-0"><div className="truncate text-[14px] font-semibold text-ze-ink">{assignment.taskTitle}</div><div className="mt-1 text-[12px] text-ze-muted">{new Date(assignment.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}</div></div>
                <div className="flex items-center gap-2"><span className={`text-[12.5px] font-semibold ${assignment.status === "completed" ? "text-emerald-700" : assignment.status === "submitted" ? "text-amber-700" : "text-ze-muted"}`}>{statusLabel[assignment.status] || assignment.status}</span><ChevronRight className="h-4 w-4 text-ze-muted" /></div>
              </Link>
            ))}
          </div>
        ) : <div className="rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-8 text-center text-[13.5px] text-ze-muted">Заданий пока нет.</div>}
      </section>
    </div>
  );
}
