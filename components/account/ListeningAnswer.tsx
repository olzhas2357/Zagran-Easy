"use client";

import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";
import { useState } from "react";
import { TaskMedia } from "./TaskMedia";

export function ListeningAnswer({ taskId, audioUrl, mediaKind, initialAnswer }: { taskId: string; audioUrl: string; mediaKind?: unknown; initialAnswer: string | null }) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const [answer, setAnswer] = useState(initialAnswer ?? "");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!answer.trim()) return;
    submit(answer);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TaskMedia url={audioUrl} mediaKind={mediaKind} />
      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Ваш ответ</div>
        <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={6} className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none focus:border-ze-primary" placeholder="Напишите ответ после прослушивания..." />
      </label>
      <SubmitStatus error={error} done={done} />
      <SubmitButton isPending={isPending} hasInitial={!!initialAnswer} />
    </form>
  );
}
