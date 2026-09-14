"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiPatch } from "@/lib/api";

const FINAL_LABELS: Record<string, string> = {
  accepted: "Вы приняли это предложение",
  rejected: "Вы отклонили это предложение",
  expired: "Срок действия предложения истёк",
};

export function OfferResponseActions({ token, initialStatus }: { token: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function respond(nextStatus: "accepted" | "rejected") {
    setError(null);
    startTransition(async () => {
      const response = await apiPatch<{ status: string }>(`/cost-calculations/public/${token}/status`, { status: nextStatus });
      if (response.error || !response.data) {
        setError(response.error || "Не удалось сохранить ответ");
        return;
      }
      setStatus(response.data.status);
    });
  }

  if (FINAL_LABELS[status]) {
    return (
      <div className={`mt-6 rounded-2xl px-4 py-4 text-center text-sm font-bold ${status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
        {FINAL_LABELS[status]}
      </div>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-ze-border p-4 print:hidden">
      <h2 className="text-center text-[16px] font-bold">Ваше решение</h2>
      <p className="mt-1 text-center text-[13px] text-ze-muted">Ответ будет сразу передан вашему менеджеру.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button disabled={pending} onClick={() => respond("accepted")} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
          <CheckCircle2 className="h-4 w-4" />
          Принять предложение
        </button>
        <button disabled={pending} onClick={() => respond("rejected")} className="flex items-center justify-center gap-2 rounded-xl border border-ze-border px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-60">
          <XCircle className="h-4 w-4" />
          Отклонить
        </button>
      </div>
      {error && <div className="mt-3 text-center text-xs text-red-600">{error}</div>}
    </section>
  );
}
