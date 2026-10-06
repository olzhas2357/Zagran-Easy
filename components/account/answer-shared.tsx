"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { submitAssignmentAnswer } from "@/lib/student-actions";

/**
 * Общая логика отправки ответа на задание (таймер, pending/error/done),
 * переиспользуется всеми type-специфичными формами ответа.
 */
export function useAnswerSubmit(taskId: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function submit(rawAnswer: string) {
    setError(null);
    setDone(false);
    startTransition(async () => {
      const timeSpentSeconds = startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0;
      const res = await submitAssignmentAnswer(taskId, rawAnswer, timeSpentSeconds);
      if (!res.success) {
        setError(res.error || "Не удалось отправить ответ");
        return;
      }
      setDone(true);
      router.refresh();
    });
  }

  return { submit, isPending, error, done };
}

export function SubmitStatus({ error, done, autoChecked = false }: { error: string | null; done: boolean; autoChecked?: boolean }) {
  return (
    <>
      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}
      {done && !error && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[13.5px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2} />
          {autoChecked ? "Ответ проверен и сохранён в черновике." : "Ответ сохранён в черновике. Его можно изменить до сдачи работы."}
        </div>
      )}
    </>
  );
}

export function SubmitButton({ isPending, hasInitial, disabled = false }: { isPending: boolean; hasInitial: boolean; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending || disabled}
      className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
    >
      {isPending ? "Сохраняем…" : hasInitial ? "Обновить ответ" : "Сохранить ответ"}
    </button>
  );
}
