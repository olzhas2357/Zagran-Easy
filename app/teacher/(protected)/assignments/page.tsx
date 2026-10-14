import Link from "next/link";
import { ClipboardCheck, CheckCircle2, Clock3, Plus } from "lucide-react";
import { getCurrentTeacher, getAssignments } from "@/lib/teacher-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Выдано",
  assigned: "Выдано",
  in_progress: "В работе",
  submitted: "На проверке",
  returned: "На доработке",
  completed: "Принято",
  overdue: "Просрочено",
};

export default async function TeacherAssignmentsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const assignments = await getAssignments(teacher.id);
  const pending = assignments.filter((a) => a.status === "submitted");
  const active = assignments.filter((a) => !["submitted", "completed"].includes(a.status));
  const reviewed = assignments.filter((a) => a.status === "completed");

  return (
    <div className="flex flex-col gap-8 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Задания на проверку</h1>
          <p className="mt-1.5 text-[14.5px] text-ze-muted">{pending.length > 0 ? `${pending.length} ожидают проверки.` : "Новых работ на проверку нет."}</p>
        </div>
        <Link
          href="/teacher/assignments/new"
          className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2} />
          Назначить задание
        </Link>
      </div>

      {active.length > 0 && (
        <div>
          <h2 className="mb-3 text-[17px] font-bold text-ze-ink">Выданные</h2>
          <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {active.map((a) => (
              <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-4 text-[14px] transition-colors hover:bg-ze-surface">
                <span className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-blue-50"><Clock3 className="h-4.5 w-4.5 text-blue-700" strokeWidth={1.75} /></span><span className="truncate text-ze-ink"><span className="font-semibold">{a.studentName}</span> · {a.taskTitle}</span></span>
                <span className={`flex-none text-[13px] font-semibold ${a.status === "returned" || a.status === "overdue" ? "text-amber-700" : "text-ze-muted"}`}>{STATUS_LABEL[a.status] || "Выдано"}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-[17px] font-bold text-ze-ink">На проверке</h2>
        {pending.length > 0 ? (
          <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {pending.map((a) => (
              <Link
                key={a.id}
                href={`/teacher/assignments/${a.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 text-[14px] transition-colors hover:bg-ze-surface"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-amber-50">
                    <ClipboardCheck className="h-4.5 w-4.5 text-amber-700" strokeWidth={1.75} />
                  </span>
                  <span className="truncate text-ze-ink">
                    <span className="font-semibold">{a.studentName}</span> · {a.taskTitle}
                  </span>
                </span>
                <span className="flex-none text-[13px] text-ze-muted">{formatDate(a.createdAt)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={1.5} />
            <div className="text-[14.5px] font-semibold text-ze-ink">Все задания проверены</div>
            <div className="text-[13px] text-ze-muted">Новые работы учеников появятся здесь.</div>
          </div>
        )}
      </div>

      {reviewed.length > 0 && (
        <div>
          <h2 className="mb-3 text-[17px] font-bold text-ze-ink">Проверенные</h2>
          <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {reviewed.map((a) => (
              <Link
                key={a.id}
                href={`/teacher/assignments/${a.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 text-[14px] transition-colors hover:bg-ze-surface"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-50">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-700" strokeWidth={1.75} />
                  </span>
                  <span className="truncate text-ze-ink">
                    <span className="font-semibold">{a.studentName}</span> · {a.taskTitle}
                  </span>
                </span>
                <span className="flex flex-none items-center gap-1 text-[13px] font-semibold text-emerald-700">{STATUS_LABEL[a.status]}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
