"use client";

import { useState } from "react";
import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";
import type { FillBlanksOptions } from "@/lib/task-types";

export function FillBlanksAnswer({
  taskId,
  question,
  options,
  initialAnswer,
}: {
  taskId: string;
  question: string;
  options: FillBlanksOptions;
  initialAnswer: string | null;
}) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const blankCount = options.blanks?.length ?? 0;
  const [values, setValues] = useState<string[]>(() => {
    if (!initialAnswer) return Array(blankCount).fill("");
    try {
      const parsed = JSON.parse(initialAnswer);
      if (Array.isArray(parsed)) {
        const arr = parsed.map(String);
        while (arr.length < blankCount) arr.push("");
        return arr;
      }
    } catch {
      // fallthrough
    }
    return Array(blankCount).fill("");
  });

  // Разбиваем текст задания по ___, чтобы показать поля ввода прямо в тексте.
  const segments = question.split("___");

  function update(i: number, value: string) {
    setValues((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (values.some((v) => !v.trim())) return;
    submit(JSON.stringify(values));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1.5 text-[14.5px] leading-relaxed text-ze-ink">
        {segments.map((seg, i) => (
          <span key={i} className="contents">
            <span>{seg}</span>
            {i < segments.length - 1 && (
              <input
                value={values[i] ?? ""}
                onChange={(e) => update(i, e.target.value)}
                className="w-28 rounded-lg border border-ze-border bg-white px-2.5 py-1.5 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary"
              />
            )}
          </span>
        ))}
      </div>

      <SubmitStatus error={error} done={done} />
      <SubmitButton isPending={isPending} hasInitial={!!initialAnswer} />
    </form>
  );
}
