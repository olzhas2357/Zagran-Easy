"use client";

import { useState } from "react";
import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";

export function TextAnswer({
  taskId,
  initialAnswer,
  placeholder,
  autoChecked = true,
}: {
  taskId: string;
  initialAnswer: string | null;
  placeholder: string;
  autoChecked?: boolean;
}) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const [answer, setAnswer] = useState(initialAnswer ?? "");

  return (
    <form onSubmit={(event) => { event.preventDefault(); if (answer.trim()) submit(answer.trim()); }} className="flex flex-col gap-4">
      <label>
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Ваш ответ</div>
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none focus:border-ze-primary"
        />
      </label>
      <SubmitStatus error={error} done={done} autoChecked={autoChecked} />
      <SubmitButton isPending={isPending} hasInitial={Boolean(initialAnswer)} disabled={!answer.trim()} />
    </form>
  );
}
