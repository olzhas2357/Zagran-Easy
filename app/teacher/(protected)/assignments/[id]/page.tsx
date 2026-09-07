import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { getCurrentTeacher, getAssignmentById } from "@/lib/teacher-data";
import { ReviewForm } from "@/components/teacher/ReviewForm";
import { TASK_TYPE_LABEL, formatAnswerForDisplay } from "@/lib/task-types";

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export default async function TeacherAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const assignment = await getAssignmentById(teacher.id, id);
  if (!assignment) notFound();

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <Link href="/teacher/assignments" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Задания на проверку
      </Link>

      {/* Compact identity header instead of a full labeled-field card */}
      <div className="flex items-center gap-3.5 rounded-[20px] border border-ze-border bg-white p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ze-surface text-[13px] font-bold text-ze-ink">
          {assignment.studentName ? initials(assignment.studentName) : <User className="h-5 w-5 text-ze-muted" strokeWidth={1.75} />}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[16px] font-bold text-ze-ink">{assignment.studentName}</div>
          <div className="truncate text-[13px] text-ze-muted">
            {assignment.taskTitle}
            {assignment.tasks[0]?.type && ` · ${TASK_TYPE_LABEL[assignment.tasks[0].type] || assignment.tasks[0].type}`}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {assignment.tasks.length > 0 ? (
          assignment.tasks.map((task, index) => (
            <section key={task.id} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="flex flex-col gap-5">
                <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[13px] font-semibold text-ze-muted">Задание {index + 1}</div>
                    {task.type && (
                      <span className="rounded-full bg-ze-surface px-2.5 py-0.5 text-[11.5px] font-semibold text-ze-muted">
                        {TASK_TYPE_LABEL[task.type] || task.type}
                      </span>
                    )}
                  </div>
                  {task.question && <p className="mt-2 text-[14.5px] leading-relaxed text-ze-ink">{task.question}</p>}
                  {task.type === "listening" && task.audioUrl && <audio controls src={task.audioUrl} className="mt-4 w-full" />}
                </div>

                <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
                  <div className="text-[13px] font-semibold text-ze-muted">Ответ ученика</div>
                  {task.answerText ? (
                    task.type === "speaking" ? (
                      <audio controls src={task.answerText} className="mt-3 w-full" />
                    ) : (
                      <div className="mt-2.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ze-ink">
                        {formatAnswerForDisplay(task.type, task.options, task.answerText)}
                      </div>
                    )
                  ) : (
                    <div className="mt-2.5 text-[13.5px] text-ze-muted">Ответ ещё не отправлен.</div>
                  )}
                </div>
              </div>

              <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6 lg:sticky lg:top-6">
                <div className="mb-3.5 text-[13px] font-semibold text-ze-muted">Оценка задания {index + 1}</div>
                <ReviewForm
                  assignmentId={assignment.id}
                  taskId={task.id}
                  initialScore={task.reviewScore}
                  initialComment={task.reviewComment}
                  initialErrors={task.reviewErrors}
                  alreadyReviewed={task.reviewScore !== null}
                />
              </div>
            </section>
          ))
        ) : (
          <div className="rounded-[20px] border border-dashed border-ze-border bg-white p-6 text-[13.5px] text-ze-muted">
            В этом assignment нет привязанных заданий.
          </div>
        )}
      </div>
    </div>
  );
}
