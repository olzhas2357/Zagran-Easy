"use client";

import { useState } from "react";
import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";

// Текстовая форма ответа — используется для типов задания, где ответ — это
// произвольный текст: письмо, лексика, грамматика, чтение, аудирование,
// говорение (аудиозапись пока не реализована, ответ принимается текстом).
export function AssignmentAnswerForm({ taskId, initialAnswer }: { taskId: string; initialAnswer: string | null }) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const [answer, setAnswer] = useState(initialAnswer ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    submit(answer);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Ваш ответ</div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={8}
          placeholder="Напишите ответ здесь..."
          className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary"
        />
      </label>

      <SubmitStatus error={error} done={done} />
      <SubmitButton isPending={isPending} hasInitial={!!initialAnswer} />
    </form>
  );
}
