"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Target } from "lucide-react";
import { setMyGoal } from "@/lib/student-actions";
import type { StudentGoal } from "@/lib/student-data";
import { LANGUAGE_GOALS } from "@/lib/language-data";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-2.5 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";

function GoalForm({ initial, onDone }: { initial: StudentGoal | null; onDone: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [examType, setExamType] = useState(initial?.examType ?? LANGUAGE_GOALS[0].label);
  const [targetScore, setTargetScore] = useState(initial?.targetScore !== null ? String(initial?.targetScore ?? "") : "");
  const [currentScore, setCurrentScore] = useState(initial?.currentScore !== null ? String(initial?.currentScore ?? "") : "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await setMyGoal({
        goalId: initial?.id ?? null,
        examType,
        targetScore: targetScore.trim() ? Number(targetScore.replace(",", ".")) : null,
        currentScore: currentScore.trim() ? Number(currentScore.replace(",", ".")) : null,
      });
      if (!res.success) {
        setError(res.error || "Не удалось сохранить цель");
        return;
      }
      router.refresh();
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <label className="block">
        <div className="mb-1.5 text-[12.5px] font-semibold text-ze-muted">Направление</div>
        <select value={examType} onChange={(e) => setExamType(e.target.value)} className={inputClass}>
          {LANGUAGE_GOALS.map((g) => (
            <option key={g.id} value={g.label}>
              {g.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <div className="mb-1.5 text-[12.5px] font-semibold text-ze-muted">Текущий балл</div>
          <input value={currentScore} onChange={(e) => setCurrentScore(e.target.value)} placeholder="5.5" className={inputClass} />
        </label>
        <label className="block">
          <div className="mb-1.5 text-[12.5px] font-semibold text-ze-muted">Целевой балл</div>
          <input value={targetScore} onChange={(e) => setTargetScore(e.target.value)} placeholder="7.0" className={inputClass} />
        </label>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Сохраняем…" : "Сохранить цель"}
      </button>
    </form>
  );
}

export function GoalCard({ goal }: { goal: StudentGoal | null }) {
  const [editing, setEditing] = useState(false);

  const progress =
    goal?.progress ?? (goal?.currentScore != null && goal?.targetScore ? Math.min(100, Math.round((goal.currentScore / goal.targetScore) * 100)) : null);

  return (
    <div className="mt-6 rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#EBF1FE]">
          <Target className="h-4.5 w-4.5 text-ze-primary" strokeWidth={1.75} />
        </span>
        <div className="text-[15px] font-bold">Моя цель</div>
      </div>

      {editing || !goal ? (
        <div className="mt-4">
          <GoalForm initial={goal} onDone={() => setEditing(false)} />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[14px] font-semibold text-ze-ink">{goal.examType}</div>
            <button onClick={() => setEditing(true)} className="text-[12.5px] font-semibold text-ze-primary hover:underline">
              Изменить
            </button>
          </div>

          {(goal.currentScore !== null || goal.targetScore !== null) && (
            <div className="mt-1 text-[13px] text-ze-muted">
              {goal.currentScore !== null && `Сейчас: ${goal.currentScore}`}
              {goal.currentScore !== null && goal.targetScore !== null && " · "}
              {goal.targetScore !== null && `Цель: ${goal.targetScore}`}
            </div>
          )}

          {progress !== null && (
            <div className="mt-3.5">
              <div className="h-2 overflow-hidden rounded-full bg-[#EEF1F6]">
                <div className="h-full rounded-full bg-ze-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-1.5 text-[12px] font-semibold text-ze-muted">{progress}% к цели</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
