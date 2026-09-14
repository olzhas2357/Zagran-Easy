"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import {
  createCostCalculationVersion,
  publishCostCalculation,
} from "@/lib/staff-actions";

export function ClientCalculations({
  clientId,
  calculations,
}: {
  clientId: string;
  calculations: Record<string, unknown>[];
}) {
  const [rows, setRows] = useState(calculations);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string[]>([]);
  function version(id: string) {
    startTransition(async () => {
      const res = await createCostCalculationVersion(id, clientId);
      if (!res.success) return setError(res.error);
      setRows((v) => [res.calculation, ...v]);
    });
  }
  function publish(id: string) {
    startTransition(async () => {
      const res = await publishCostCalculation(id, clientId);
      if (!res.success) return setError(res.error);
      const url = `${window.location.origin}/offer/${res.token}`;
      await navigator.clipboard.writeText(url);
      setRows((v) =>
        v.map((r) =>
          r.id === id ? { ...r, status: "sent", public_token: res.token } : r,
        ),
      );
    });
  }
  return (
    <section className="rounded-[20px] border border-ze-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold">Расчёты</h2>
        <Link
          href={`/staff/clients/${clientId}/calculations/new`}
          className="rounded-lg bg-ze-primary px-3 py-2 text-[12px] font-semibold text-white"
        >
          Новый расчёт
        </Link>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((row) => {
          const uni = row.universities as Record<string, unknown> | null;
          return (
            <div
              key={String(row.id)}
              className="rounded-xl border border-ze-border p-3"
            >
              <div className="flex justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-[13px] font-semibold">
                    <input
                      type="checkbox"
                      checked={selected.includes(String(row.id))}
                      onChange={(event) => setSelected((value) => event.target.checked ? [...value, String(row.id)] : value.filter((id) => id !== String(row.id)))}
                      aria-label="Добавить к сравнению"
                    />
                    {String(row.title)} · v{String(row.version)}
                  </div>
                  <div className="text-[12px] text-ze-muted">
                    {String(uni?.name || "Университет")} · {String(row.status)}
                  </div>
                </div>
                <div className="font-bold">
                  {Number(row.grand_total).toLocaleString("ru-RU")}{" "}
                  {String(row.currency)}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  disabled={pending}
                  onClick={() => version(String(row.id))}
                  className="flex items-center gap-1 rounded-lg border border-ze-border px-2.5 py-1.5 text-[11.5px] font-semibold"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Новая версия
                </button>
                <button
                  disabled={pending}
                  onClick={() => publish(String(row.id))}
                  className="flex items-center gap-1 rounded-lg bg-[#EBF1FE] px-2.5 py-1.5 text-[11.5px] font-semibold text-ze-primary"
                >
                  Опубликовать и копировать ссылку
                </button>
                {Boolean(row.public_token) && (
                  <a
                    target="_blank"
                    href={`/offer/${row.public_token}`}
                    className="flex items-center gap-1 rounded-lg border border-ze-border px-2.5 py-1.5 text-[11.5px] font-semibold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Открыть
                  </a>
                )}
              </div>
            </div>
          );
        })}
        {!rows.length && (
          <div className="text-[13px] text-ze-muted">
            Сохранённых расчётов пока нет.
          </div>
        )}
      </div>
      {selected.length > 1 && (
        <div className="mt-4 overflow-x-auto rounded-xl bg-slate-50 p-3">
          <div className="mb-2 text-[12px] font-bold">Сравнение предложений</div>
          <table className="w-full text-left text-[12px]"><thead><tr><th className="py-1">Университет</th><th>Версия</th><th className="text-right">Итого</th></tr></thead><tbody>
            {rows.filter((row) => selected.includes(String(row.id))).map((row) => {
              const university = row.universities as Record<string, unknown> | null;
              return <tr key={String(row.id)} className="border-t border-ze-border"><td className="py-1.5">{String(university?.name || "—")}</td><td>v{String(row.version)}</td><td className="text-right font-bold">{Number(row.grand_total).toLocaleString("ru-RU")} {String(row.currency)}</td></tr>;
            })}
          </tbody></table>
        </div>
      )}
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
    </section>
  );
}
