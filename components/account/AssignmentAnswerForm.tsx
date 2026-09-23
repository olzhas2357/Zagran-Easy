"use client";

import { useState } from "react";
import { SubmitStatus, useAnswerSubmit } from "./answer-shared";

// Текстовая форма ответа — используется для типов задания, где ответ — это
// произвольный текст: письмо, лексика, грамматика, чтение, аудирование,
// говорение (аудиозапись пока не реализована, ответ принимается текстом).
export function AssignmentAnswerForm({ taskId, initialAnswer, wordLimit }: { taskId: string; initialAnswer: string | null; wordLimit?: number }) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const [answer, setAnswer] = useState(initialAnswer ?? "");
  const wordCount = answer.trim() ? answer.trim().split(/\s+/u).length : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    submit(answer);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block">
        <div className="mb-1.5 flex justify-between gap-3 text-[13px] font-semibold text-ze-muted">
          <span>Ваш ответ</span>
          {wordLimit && <span className={wordCount < wordLimit ? "text-amber-600" : "text-emerald-700"}>{wordCount} / минимум {wordLimit} слов</span>}
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={8}
          placeholder="Напишите ответ здесь..."
          className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary"
        />
      </label>

      <SubmitStatus error={error} done={done} />
      <button type="submit" disabled={isPending || Boolean(wordLimit && wordCount < wordLimit)} className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-50">
        {isPending ? "Отправляем…" : initialAnswer ? "Отправить ещё раз" : "Отправить ответ"}
      </button>
    </form>
  );
}
