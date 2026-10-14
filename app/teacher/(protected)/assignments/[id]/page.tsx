import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { getCurrentTeacher, getAssignmentById } from "@/lib/teacher-data";
import { ReviewForm } from "@/components/teacher/ReviewForm";
import { HOMEWORK_SUBMISSION_MODE_LABEL, TASK_TYPE_LABEL, formatAudioDuration, parseSpeakingSubmission, type HomeworkSubmissionMode } from "@/lib/task-types";
import { HomeworkSubmissionView } from "@/components/account/HomeworkSubmissionView";
import { TaskMedia } from "@/components/account/TaskMedia";
import { AudioPlayback } from "@/components/account/AudioPlayback";

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
  const reviewXpReward = assignment.tasks.reduce(
    (sum, task) => sum + (task.isCorrect === false ? 0 : task.xpReward),
    0,
  );

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

      {assignment.tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="flex flex-col gap-5">
            {assignment.tasks.map((task, index) => (
              <section key={task.id} className="flex flex-col gap-3">
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
                  {task.type === "writing" && ["photo", "text", "choice"].includes(String(task.options?.submissionMode)) && (
                    <div className="mt-3 rounded-xl bg-blue-50 px-3.5 py-2.5 text-[12.5px] font-semibold text-blue-800">
                      Способ сдачи: {HOMEWORK_SUBMISSION_MODE_LABEL[task.options?.submissionMode as HomeworkSubmissionMode]}
                    </div>
                  )}
                  {task.type === "listening" && task.audioUrl && <TaskMedia url={task.audioUrl} mediaKind={task.options?.mediaKind} className="mt-4" />}
                </div>

                <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[13px] font-semibold text-ze-muted">Ответ ученика</div>
                    {task.isCorrect !== null && (
                      <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${task.isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {task.isCorrect ? "Автопроверка: верно" : "Автопроверка: неверно"}
                      </span>
                    )}
                  </div>
                  {task.answerText ? (
                    task.type === "speaking" ? (() => {
                      const submission = parseSpeakingSubmission(task.answerText);
                      return submission ? (
                        <div className="mt-3">
                          <AudioPlayback url={submission.url} mimeType={submission.mimeType} />
                          {submission.durationSeconds !== null && <div className="mt-2 text-[12.5px] font-semibold text-ze-muted">Длительность: {formatAudioDuration(submission.durationSeconds)}</div>}
                        </div>
                      ) : null;
                    })() : <div className="mt-2.5"><HomeworkSubmissionView answer={task.answerText} type={task.type} options={task.options} /></div>
                  ) : (
                    <div className="mt-2.5 text-[13.5px] text-ze-muted">Ответ ещё не отправлен.</div>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6 lg:sticky lg:top-6">
            <div className="mb-1 text-[16px] font-bold text-ze-ink">Проверка работы</div>
            <p className="mb-4 text-[12.5px] leading-relaxed text-ze-muted">Посмотрите ответ, оставьте комментарий и примите работу или верните её ученику.</p>
            {assignment.status === "submitted" || assignment.status === "completed" ? (
              <ReviewForm
                assignmentId={assignment.id}
                initialComment={assignment.tasks.find((task) => task.reviewComment)?.reviewComment ?? null}
                xpReward={reviewXpReward}
                accepted={assignment.status === "completed"}
              />
            ) : (
              <div className="rounded-xl bg-ze-surface px-3.5 py-3 text-[13.5px] font-medium text-ze-muted">
                {assignment.status === "returned" ? "Работа возвращена. Ждём новый ответ ученика." : "Ученик ещё не отправил всю работу."}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-ze-border bg-white p-6 text-[13.5px] text-ze-muted">
          В задании пока нет вопросов.
        </div>
      )}
    </div>
  );
}
