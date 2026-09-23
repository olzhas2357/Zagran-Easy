"use client";

import { useState } from "react";
import { CorrectAnswer, SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";
import type { MultipleChoiceOptions } from "@/lib/task-types";

export function MultipleChoiceAnswer({
  taskId,
  options,
  initialAnswer,
}: {
  taskId: string;
  options: MultipleChoiceOptions;
  initialAnswer: string | null;
}) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const [selected, setSelected] = useState(initialAnswer ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    submit(selected);
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
              type="radio"
              name="choice"
              value={c.id}
              checked={selected === c.id}
              onChange={() => setSelected(c.id)}
              className="h-4.5 w-4.5 accent-ze-primary"
            />
            {c.text}
          </label>
        ))}
      </div>

      <SubmitStatus error={error} done={done} autoChecked />
      <CorrectAnswer show={done}>{options.choices.find((choice) => choice.id === options.correctId)?.text ?? "—"}</CorrectAnswer>
      <SubmitButton isPending={isPending} hasInitial={!!initialAnswer} />
    </form>
  );
}
