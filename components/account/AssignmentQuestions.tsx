"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { AssignmentAnswerDispatcher } from "./AssignmentAnswerDispatcher";
import { formatAnswerForDisplay } from "@/lib/task-types";
import type { StudentAssignmentTask } from "@/lib/student-data";

export function AssignmentQuestions({ tasks, assignmentStatus }: { tasks: StudentAssignmentTask[]; assignmentStatus: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const task = tasks[currentIndex];
  if (!task) {
    return <div className="text-[13.5px] text-ze-muted">В этой домашней работе пока нет вопросов.</div>;
  }

  const isReviewed = assignmentStatus === "completed" || task.reviewScore !== null;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === tasks.length - 1;

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
        {isReviewed ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13px] font-semibold text-ze-muted">Ваш ответ</div>
              {task.reviewScore !== null && (
                <span className="flex items-center gap-1 text-[15px] font-bold text-ze-ink">
                  <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                  {task.reviewScore}
                </span>
              )}
            </div>
            <div className="mt-2.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ze-ink">
              {formatAnswerForDisplay(task.type, task.options, task.answerText) || "Ответ не отправлен"}
            </div>
            {task.reviewComment && <p className="mt-3 text-[14px] leading-relaxed text-ze-ink">{task.reviewComment}</p>}
            {task.reviewErrors && (
              <div className="mt-3 border-t border-[#DFE8FA] pt-3">
                <div className="text-[12.5px] font-semibold text-ze-muted">Ошибки и рекомендации</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ze-ink">{task.reviewErrors}</p>
              </div>
            )}
          </>
        ) : (
          <AssignmentAnswerDispatcher
            taskId={task.id}
            taskType={task.type}
            taskQuestion={task.question}
            taskOptions={task.options}
            initialAnswer={task.answerText}
          />
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
    </div>
  );
}
