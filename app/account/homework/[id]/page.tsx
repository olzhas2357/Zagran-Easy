import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { getCurrentStudent, getMyAssignmentById } from "@/lib/student-data";
import { AssignmentAnswerForm } from "@/components/account/AssignmentAnswerForm";

export default async function StudentHomeworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getCurrentStudent();
  if (!student) redirect("/account/login");

  const assignment = await getMyAssignmentById(id);
  if (!assignment) notFound();

  const isReviewed = assignment.status === "completed";

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-3xl px-4 py-9 sm:px-10 sm:py-11">
        <Link href="/account/homework" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Домашние задания
        </Link>

        <div className="mt-4">
          <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink sm:text-[24px]">{assignment.taskTitle}</h1>
          {assignment.dueDate && (
            <p className="mt-1.5 text-[13.5px] text-ze-muted">
              Срок: {new Date(assignment.dueDate).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>

        {assignment.taskQuestion && assignment.taskQuestion !== assignment.taskTitle && (
          <div className="mt-5 rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="text-[13px] font-semibold text-ze-muted">Задание</div>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ze-ink">{assignment.taskQuestion}</p>
          </div>
        )}

        <div className="mt-5 rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          {isReviewed ? (
            <>
              <div className="text-[13px] font-semibold text-ze-muted">Ваш ответ</div>
              <div className="mt-2.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ze-ink">{assignment.answerText}</div>
            </>
          ) : assignment.taskId ? (
            <AssignmentAnswerForm taskId={assignment.taskId} initialAnswer={assignment.answerText} />
          ) : (
            <div className="text-[13.5px] text-ze-muted">Задание пока не привязано к упражнению — обратитесь к преподавателю.</div>
          )}
        </div>

        {isReviewed && (
          <div className="mt-5 rounded-[20px] border border-[#DFE8FA] bg-[#F5F8FE] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13px] font-semibold text-ze-muted">Оценка преподавателя</div>
              {assignment.reviewScore !== null && (
                <span className="flex items-center gap-1 text-[15px] font-bold text-ze-ink">
                  <Star className="h-4 w-4 text-amber-500" strokeWidth={2} fill="currentColor" />
                  {assignment.reviewScore}
                </span>
              )}
            </div>
            {assignment.reviewComment && <p className="mt-3 text-[14px] leading-relaxed text-ze-ink">{assignment.reviewComment}</p>}
            {assignment.reviewErrors && (
              <div className="mt-3 border-t border-[#DFE8FA] pt-3">
                <div className="text-[12.5px] font-semibold text-ze-muted">Ошибки и рекомендации</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ze-ink">{assignment.reviewErrors}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
