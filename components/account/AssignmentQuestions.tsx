"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, RotateCcw, Send } from "lucide-react";
import { AssignmentAnswerDispatcher } from "./AssignmentAnswerDispatcher";
import type { StudentAssignmentTask } from "@/lib/student-data";
import { HomeworkSubmissionView } from "./HomeworkSubmissionView";
import { reopenSubmittedAssignment, turnInAssignment } from "@/lib/student-actions";

function correctAnswerLabel(task: StudentAssignmentTask): string | null {
  const options = task.options;
  if (task.type === "multiple_choice") {
    const choices = Array.isArray(options?.choices) ? options.choices as Array<{ id?: string; text?: string }> : [];
    return choices.find((choice) => choice.id === options?.correctId)?.text ?? null;
  }
  if (task.type === "multiple_select") {
    const choices = Array.isArray(options?.choices) ? options.choices as Array<{ id?: string; text?: string }> : [];
    const ids = Array.isArray(options?.correctIds) ? options.correctIds.map(String) : [];
    return choices.filter((choice) => choice.id && ids.includes(choice.id)).map((choice) => choice.text).filter(Boolean).join(", ") || null;
  }
  if (task.type === "matching") {
    const pairs = Array.isArray(options?.pairs) ? options.pairs as Array<{ left?: string; right?: string }> : [];
    return pairs.map((pair) => `${pair.left ?? "—"} → ${pair.right ?? "—"}`).join("; ") || null;
  }
  if (task.type === "fill_blanks") {
    const blanks = Array.isArray(options?.blanks) ? options.blanks.map(String).filter(Boolean) : [];
    return blanks.map((answer, index) => `${index + 1}. ${answer.split("|").join(" / ")}`).join("; ") || null;
  }
  return task.correctAnswer?.trim() || null;
}

export function AssignmentQuestions({ tasks, assignmentId, assignmentStatus, isOverdue }: { tasks: StudentAssignmentTask[]; assignmentId: string; assignmentStatus: string; isOverdue: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const task = tasks[currentIndex];
  if (!task) {
    return <div className="text-[13.5px] text-ze-muted">В этой домашней работе пока нет вопросов.</div>;
  }

  const isAccepted = assignmentStatus === "completed";
  const isReturned = assignmentStatus === "returned";
  const isWaiting = assignmentStatus === "submitted";
  const isLocked = isAccepted || isWaiting || isOverdue;
  const answeredCount = tasks.filter((item) => Boolean(item.answerText)).length;
  const allAnswered = tasks.length > 0 && answeredCount === tasks.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === tasks.length - 1;
  const revealedCorrectAnswer = isOverdue ? correctAnswerLabel(task) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[13px] font-semibold text-ze-muted">
          Вопрос {currentIndex + 1} из {tasks.length}
        </div>
        <div className="flex items-center gap-1.5" aria-label={`Прогресс: вопрос ${currentIndex + 1} из ${tasks.length}`}>
          {tasks.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Открыть вопрос ${index + 1}`}
              className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-7 bg-ze-primary" : "w-2 bg-[#D8E0ED] hover:bg-ze-primary/50"}`}
            />
          ))}
        </div>
      </div>

      {task.question && task.question !== task.title && (
        <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] font-semibold text-ze-muted">Вопрос {currentIndex + 1}</div>
            {task.type && <div className="text-[12px] font-semibold text-ze-muted">{task.type}</div>}
          </div>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ze-ink">{task.question}</p>
        </div>
      )}

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        {isLocked ? (
          <>
            <div className="text-[13px] font-semibold text-ze-muted">Ваша работа</div>
            <div className="mt-2.5"><HomeworkSubmissionView answer={task.answerText} type={task.type} options={task.options} /></div>
            {isOverdue && task.isCorrect !== null && (
              <div className={`mt-4 rounded-xl px-3.5 py-3 text-[13.5px] font-semibold ${task.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
                {task.isCorrect ? "Ответ верный" : "Ответ неверный"}
              </div>
            )}
            {revealedCorrectAnswer && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[13.5px] text-emerald-900">
                <div className="font-semibold">Правильный ответ</div>
                <div className="mt-1 whitespace-pre-wrap">{revealedCorrectAnswer}</div>
              </div>
            )}
            {isWaiting && <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-3 text-[13.5px] font-semibold text-amber-800"><CheckCircle2 className="h-4 w-4" />Отправлено преподавателю</div>}
            {isOverdue && !isAccepted && !isWaiting && <div className="mt-4 rounded-xl bg-slate-100 px-3.5 py-3 text-[13.5px] font-semibold text-slate-700">Срок сдачи истёк. Изменение ответов недоступно.</div>}
            {task.reviewComment && (
              <div className="mt-4 rounded-xl bg-blue-50 px-3.5 py-3 text-blue-950">
                <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-blue-700"><MessageCircle className="h-3.5 w-3.5" />Комментарий преподавателя</div>
                <p className="mt-1.5 text-[14px] leading-relaxed">{task.reviewComment}</p>
              </div>
            )}
          </>
        ) : (
          <>
            {isReturned && task.reviewComment && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-amber-950">
                <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-amber-800"><MessageCircle className="h-3.5 w-3.5" />Что нужно исправить</div>
                <p className="mt-1.5 text-[14px] leading-relaxed">{task.reviewComment}</p>
              </div>
            )}
            <AssignmentAnswerDispatcher
              taskId={task.id}
              taskType={task.type}
              taskQuestion={task.question}
              taskOptions={task.options}
              taskAudioUrl={task.audioUrl}
              initialAnswer={task.answerText}
            />
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => setCurrentIndex((index) => index - 1)}
          className="flex items-center gap-2 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>
        {isLast ? (
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Последний вопрос
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => index + 1)}
            className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-ze-primary-dark"
          >
            Следующий вопрос
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isAccepted && (
        <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[15px] font-bold text-ze-ink">Сдача работы</div>
              <div className="mt-1 text-[13px] text-ze-muted">Сохранено ответов: {answeredCount} из {tasks.length}. До сдачи их можно обновлять.</div>
            </div>
            {isWaiting ? (
              <button
                type="button"
                disabled={isPending || isOverdue}
                onClick={() => startTransition(async () => {
                  setWorkflowError(null);
                  const result = await reopenSubmittedAssignment(assignmentId);
                  if (!result.success) return setWorkflowError(result.error || "Не удалось отменить сдачу");
                  router.refresh();
                })}
                className="flex items-center justify-center gap-2 rounded-xl border border-ze-border bg-white px-5 py-3 text-[13.5px] font-semibold text-ze-ink hover:border-ze-primary hover:text-ze-primary disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Отменить сдачу и изменить
              </button>
            ) : (
              <button
                type="button"
                disabled={isPending || isOverdue || !allAnswered}
                onClick={() => startTransition(async () => {
                  setWorkflowError(null);
                  const result = await turnInAssignment(assignmentId);
                  if (!result.success) return setWorkflowError(result.error || "Не удалось сдать работу");
                  router.refresh();
                })}
                className="flex items-center justify-center gap-2 rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white hover:bg-ze-primary-dark disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isPending ? "Сдаём…" : "Сдать работу преподавателю"}
              </button>
            )}
          </div>
          {!allAnswered && !isWaiting && !isOverdue && <div className="mt-3 text-[12.5px] font-medium text-amber-700">Сначала сохраните ответ на каждый вопрос.</div>}
          {workflowError && <div className="mt-3 rounded-xl bg-red-50 px-3.5 py-3 text-[13px] font-medium text-red-700">{workflowError}</div>}
        </div>
      )}
    </div>
  );
}
