"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { reviewAssignment } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

export function ReviewForm({
  assignmentId,
  taskId,
  initialScore,
  initialComment,
  initialErrors,
  alreadyReviewed,
}: {
  assignmentId: string;
  taskId: string;
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
      const res = await reviewAssignment({ assignmentId, taskId, score: scoreNum, comment, errors });
      if (!res.success) {
        setError(res.error || "Не удалось отправить оценку");
        return;
      }
      setDone(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Оценка</div>
        <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="7.5" className={`${inputClass} max-w-[140px]`} />
      </label>

      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Комментарий</div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className={textareaClass} />
      </label>

      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Ошибки и рекомендации</div>
        <textarea value={errors} onChange={(e) => setErrors(e.target.value)} rows={4} className={textareaClass} />
      </label>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}
      {done && !error && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[13.5px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2} />
          Оценка отправлена.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Отправляем…" : alreadyReviewed ? "Обновить оценку" : "Отправить оценку"}
      </button>
    </form>
  );
}
