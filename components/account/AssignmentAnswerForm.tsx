"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { submitAssignmentAnswer } from "@/lib/student-actions";

export function AssignmentAnswerForm({ taskId, initialAnswer }: { taskId: string; initialAnswer: string | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState(initialAnswer ?? "");
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);

    startTransition(async () => {
      const timeSpentSeconds = startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0;
      const res = await submitAssignmentAnswer(taskId, answer, timeSpentSeconds);
      if (!res.success) {
        setError(res.error || "Не удалось отправить ответ");
        return;
      }
      setDone(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Ваш ответ</div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={8}
          placeholder="Напишите ответ здесь..."
          className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary"
        />
      </label>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}
      {done && !error && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[13.5px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2} />
          Ответ отправлен на проверку.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Отправляем…" : initialAnswer ? "Отправить ещё раз" : "Отправить ответ"}
      </button>
    </form>
  );
}
