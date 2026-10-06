"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { reviewAssignment } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

export function ReviewForm({
  assignmentId,
  initialComment,
  xpReward,
  accepted,
}: {
  assignmentId: string;
  initialComment: string | null;
  xpReward: number;
  accepted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [comment, setComment] = useState(initialComment ?? "");

  function handleDecision(decision: "accepted" | "returned") {
    setError(null);
    if (decision === "returned" && !comment.trim()) return setError("Напишите, что ученику нужно исправить");

    startTransition(async () => {
      const res = await reviewAssignment({ assignmentId, decision, comment });
      if (!res.success) {
        setError(res.error || "Не удалось сохранить решение");
        return;
      }
      setDone(true);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Комментарий ученику</div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={5} placeholder="Коротко похвалите или напишите, что исправить…" className={textareaClass} />
      </label>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}
      {done && !error && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[13.5px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2} />
          Решение сохранено.
        </div>
      )}

      <button
        type="button"
        onClick={() => handleDecision("accepted")}
        disabled={isPending || accepted}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(5,150,105,0.2)] transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {accepted ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />}
        {accepted ? "Задание принято" : isPending ? "Сохраняем…" : `Принять${xpReward > 0 ? ` · +${xpReward} XP` : ""}`}
      </button>
      {!accepted && (
        <button
          type="button"
          onClick={() => handleDecision("returned")}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-ze-border bg-white px-5 py-3 text-[13.5px] font-semibold text-ze-ink transition-colors hover:border-amber-300 hover:bg-amber-50 disabled:opacity-60"
        >
          <RotateCcw className="h-4 w-4" />
          Вернуть на доработку
        </button>
      )}
    </div>
  );
}
