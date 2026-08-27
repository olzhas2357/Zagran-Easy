"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewAssignment } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-lg border border-ze-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

export function ReviewForm({
  attemptId,
  initialScore,
  initialComment,
  initialErrors,
  alreadyReviewed,
}: {
  attemptId: string;
  initialScore: number | null;
  initialComment: string | null;
  initialErrors: string | null;
  alreadyReviewed: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [score, setScore] = useState(initialScore !== null ? String(initialScore) : "");
  const [comment, setComment] = useState(initialComment ?? "");
  const [errors, setErrors] = useState(initialErrors ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const scoreNum = Number(score.replace(",", "."));
    if (!Number.isFinite(scoreNum)) return setError("Укажите оценку");

    startTransition(async () => {
      const res = await reviewAssignment({ attemptId, score: scoreNum, comment, errors });
      if (!res.success) {
        setError(res.error || "Не удалось отправить оценку");
        return;
      }
      setDone(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block">
        <div className="mb-1.5 text-[12px] font-semibold text-ze-muted">Оценка</div>
        <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="7.5" className={`${inputClass} max-w-[120px]`} />
      </label>

      <label className="block">
        <div className="mb-1.5 text-[12px] font-semibold text-ze-muted">Комментарий</div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className={textareaClass} />
      </label>

      <label className="block">
        <div className="mb-1.5 text-[12px] font-semibold text-ze-muted">Ошибки и рекомендации</div>
        <textarea value={errors} onChange={(e) => setErrors(e.target.value)} rows={4} className={textareaClass} />
      </label>

      {error && <div className="text-[13px] text-red-600">{error}</div>}
      {done && !error && <div className="text-[13px] text-green-600">Оценка отправлена.</div>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-lg bg-ze-primary px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-ze-primary-dark disabled:opacity-60"
      >
        {isPending ? "Отправляем…" : alreadyReviewed ? "Обновить оценку" : "Отправить оценку"}
      </button>
    </form>
  );
}
