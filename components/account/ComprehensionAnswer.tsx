"use client";

import { useState } from "react";
import type { ComprehensionOptions } from "@/lib/task-types";
import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";

export function ComprehensionAnswer({ taskId, options, audioUrl, initialAnswer }: {
  taskId: string;
  options: ComprehensionOptions;
  audioUrl?: string | null;
  initialAnswer: string | null;
}) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try { return initialAnswer ? JSON.parse(initialAnswer) : {}; } catch { return {}; }
  });
  const questions = options.questions ?? [];
  const complete = questions.length === 5 && questions.every((question) => answers[question.id]?.trim());

  return (
    <form onSubmit={(event) => { event.preventDefault(); if (complete) submit(JSON.stringify(answers)); }} className="flex flex-col gap-4">
      {audioUrl && <audio controls preload="metadata" src={audioUrl} className="w-full" />}
      {questions.map((question, index) => (
        <label key={question.id} className="block">
          <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">{index + 1}. {question.text}</div>
          <textarea
            value={answers[question.id] ?? ""}
            onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
            rows={3}
            className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none focus:border-ze-primary"
          />
        </label>
      ))}
      <SubmitStatus error={error} done={done} />
      <SubmitButton isPending={isPending} disabled={!complete} hasInitial={!!initialAnswer} />
    </form>
  );
}
