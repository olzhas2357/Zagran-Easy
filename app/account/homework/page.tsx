import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ClipboardList, Star, CheckCircle2 } from "lucide-react";
import { getCurrentStudent, getMyAssignments } from "@/lib/student-data";

export const metadata: Metadata = { title: "Домашние задания — ZagranEasy" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Не отправлено",
  submitted: "На проверке",
  completed: "Проверено",
};

export default async function StudentHomeworkPage() {
  const student = await getCurrentStudent();
  if (!student) redirect("/account/login");

  const assignments = await getMyAssignments();
  const active = assignments.filter((a) => a.status !== "completed");
  const completed = assignments.filter((a) => a.status === "completed");

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-4xl px-4 py-9 sm:px-10 sm:py-11">
        <Link href="/account" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Кабинет
        </Link>

        <div className="mt-4">
          <h1 className="text-[23px] font-extrabold tracking-tight sm:text-[30px]">Домашние задания</h1>
          <p className="mt-2 text-[14.5px] text-ze-muted">{active.length} ожидают выполнения.</p>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-[15px] font-bold text-ze-ink">Активные</h2>
          {active.length > 0 ? (
            <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              {active.map((a) => (
                <Link
                  key={a.id}
                  href={`/account/homework/${a.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-4 text-[14px] transition-colors hover:bg-ze-surface"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-amber-50">
                      <ClipboardList className="h-4.5 w-4.5 text-amber-700" strokeWidth={1.75} />
                    </span>
                    <span className="truncate font-semibold text-ze-ink">{a.taskTitle}</span>
                  </span>
                  <span className="flex-none text-[13px] text-ze-muted">
                    {a.status === "submitted" ? STATUS_LABEL.submitted : a.dueDate ? `до ${formatDate(a.dueDate)}` : STATUS_LABEL.pending}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={1.5} />
              <div className="text-[14.5px] font-semibold text-ze-ink">Активных заданий нет</div>
              <div className="text-[13px] text-ze-muted">Новые задания появятся здесь.</div>
            </div>
          )}
        </div>

        {completed.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-[15px] font-bold text-ze-ink">Проверенные</h2>
            <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              {completed.map((a) => (
                <Link
                  key={a.id}
                  href={`/account/homework/${a.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-4 text-[14px] transition-colors hover:bg-ze-surface"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-50">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-700" strokeWidth={1.75} />
                    </span>
                    <span className="truncate font-semibold text-ze-ink">{a.taskTitle}</span>
                  </span>
                  <span className="flex flex-none items-center gap-1 text-[13px] font-semibold text-ze-muted">
                    {a.reviewScore !== null ? (
                      <>
                        <Star className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} fill="currentColor" />
                        {a.reviewScore}
                      </>
                    ) : (
                      STATUS_LABEL.completed
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
