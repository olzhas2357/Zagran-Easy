"use client";

import { useMemo, useState } from "react";
import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";
import type { MatchingOptions } from "@/lib/task-types";

const selectClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";

// Правые варианты показываются в перемешанном порядке — иначе id пары
// сразу выдаёт правильный ответ (позиция совпадает с левым списком).
function shuffledRights(pairs: MatchingOptions["pairs"]) {
  const arr = [...pairs];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function MatchingAnswer({
  taskId,
  options,
  initialAnswer,
}: {
  taskId: string;
  options: MatchingOptions;
  initialAnswer: string | null;
}) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const pairs = options.pairs ?? [];
  const rights = useMemo(() => shuffledRights(pairs), [pairs]);

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    if (!initialAnswer) return {};
    try {
      const parsed = JSON.parse(initialAnswer);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.keys(selection).length < pairs.length) return;
    submit(JSON.stringify(selection));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        {pairs.map((p) => (
          <div key={p.id} className="flex items-center gap-2.5">
            <div className="flex-1 rounded-xl border border-ze-border bg-ze-surface px-3.5 py-3 text-[14px] text-ze-ink">
              {p.left}
            </div>
            <span className="flex-none text-ze-muted">→</span>
            <select
              value={selection[p.id] ?? ""}
              onChange={(e) => setSelection((prev) => ({ ...prev, [p.id]: e.target.value }))}
              className={`flex-1 ${selectClass}`}
            >
              <option value="" disabled>
                Выберите...
              </option>
              {rights.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.right}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <SubmitStatus error={error} done={done} />
      <SubmitButton isPending={isPending} hasInitial={!!initialAnswer} />
    </form>
  );
}
