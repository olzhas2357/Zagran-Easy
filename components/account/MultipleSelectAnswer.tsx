"use client";

import { useState } from "react";
import { CorrectAnswer, SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";
import type { MultipleSelectOptions } from "@/lib/task-types";

export function MultipleSelectAnswer({
  taskId,
  options,
  initialAnswer,
}: {
  taskId: string;
  options: MultipleSelectOptions;
  initialAnswer: string | null;
}) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const [selected, setSelected] = useState<string[]>(() => {
    if (!initialAnswer) return [];
    try {
      const parsed = JSON.parse(initialAnswer);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  });

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) return;
    submit(JSON.stringify(selected));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        {(options.choices ?? []).map((c) => (
          <label
            key={c.id}
            className="flex items-center gap-2.5 rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink transition-colors has-[:checked]:border-ze-primary has-[:checked]:bg-blue-50"
          >
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
              className="h-4.5 w-4.5 accent-ze-primary"
            />
            {c.text}
          </label>
        ))}
      </div>

      <SubmitStatus error={error} done={done} autoChecked />
      <CorrectAnswer show={done}>
        {options.choices.filter((choice) => options.correctIds.includes(choice.id)).map((choice) => choice.text).join(", ")}
      </CorrectAnswer>
      <SubmitButton isPending={isPending} hasInitial={!!initialAnswer} />
    </form>
  );
}
