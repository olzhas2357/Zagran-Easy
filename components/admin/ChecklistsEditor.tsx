"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Copy, Plus, Trash2, X } from "lucide-react";
import { copyChecklists, deleteChecklist, saveChecklist, type ChecklistInput } from "@/lib/staff-actions";
import { monthLabel, shiftMonth } from "@/lib/checklist-month";
import type { ManagerChecklist } from "@/lib/types";

const empty = (month: string): ChecklistInput => ({ month, title: "", goal: "", targetCount: 0, targetLabel: "", steps: [{ title: "", say: "", do: "" }] });
const field = "w-full rounded-lg border border-ze-border bg-white px-3 py-2 text-sm outline-none focus:border-ze-primary";

export function ChecklistsEditor({ month, checklists }: { month: string; checklists: ManagerChecklist[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<{ id: string | null; data: ChecklistInput } | null>(null);
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();
  const prev = shiftMonth(month, -1);

  function run(action: () => Promise<{ success: boolean; error?: string }>, after?: () => void) {
    setError("");
    startTransition(async () => {
      const res = await action();
      if (!res.success) return setError(res.error || "Ошибка");
      after?.();
      router.refresh();
    });
  }

  const edit = (c: ManagerChecklist) => setEditing({ id: c.id, data: { month: c.month, title: c.title, goal: c.goal, targetCount: c.targetCount, targetLabel: c.targetLabel, steps: c.steps.map((s) => ({ ...s })) } });

  return <div>
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 rounded-xl border border-ze-border bg-white p-1">
        <Link href={`/admin/checklists?month=${shiftMonth(month, -1)}`} aria-label="Предыдущий месяц" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"><ChevronLeft className="h-4 w-4" /></Link>
        <span className="min-w-40 text-center text-sm font-bold">{monthLabel(month)}</span>
        <Link href={`/admin/checklists?month=${shiftMonth(month, 1)}`} aria-label="Следующий месяц" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"><ChevronRight className="h-4 w-4" /></Link>
      </div>
      <button type="button" onClick={() => setEditing({ id: null, data: empty(month) })} className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Добавить чек-лист</button>
      <button type="button" disabled={busy} onClick={() => run(() => copyChecklists(prev, month))} className="flex items-center gap-2 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-sm font-bold disabled:opacity-50"><Copy className="h-4 w-4" />Скопировать из {monthLabel(prev)}</button>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

    <div className="mt-5 space-y-4">
      {checklists.length === 0 && <div className="rounded-2xl border border-dashed border-ze-border bg-white p-10 text-center text-sm text-ze-muted">На этот месяц чек-листов нет. Добавьте новый или скопируйте с прошлого месяца.</div>}
      {checklists.map((c) => <article key={c.id} className="rounded-2xl border border-ze-border bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h3 className="text-lg font-extrabold">{c.title}</h3><p className="mt-1 text-sm text-ze-muted">{c.targetCount ? `${c.targetLabel || "Цель"}: ${c.targetCount} · ` : ""}шагов: {c.steps.length}</p></div>
          <div className="flex gap-2"><button type="button" onClick={() => edit(c)} className="rounded-lg border border-ze-border px-3 py-2 text-sm font-bold">Изменить</button><button type="button" disabled={busy} aria-label="Удалить" onClick={() => { if (confirm(`Удалить «${c.title}»? Прогресс менеджеров тоже будет удалён.`)) run(() => deleteChecklist(c.id)); }} className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600"><Trash2 className="h-4 w-4" /></button></div>
        </div>
        <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-ze-muted"><tr><th className="py-2 pr-4">Менеджер</th><th className="py-2 pr-4">{c.targetLabel || "Выполнено"}</th><th className="py-2">Шаги</th></tr></thead><tbody>
          {c.teamProgress.length ? c.teamProgress.map((p) => <tr key={p.managerId} className="border-t border-ze-border"><td className="py-2 pr-4 font-semibold">{p.managerName || "—"}</td><td className="py-2 pr-4">{p.doneCount}{c.targetCount ? ` / ${c.targetCount}` : ""}</td><td className="py-2">{c.steps.filter((s) => p.completedSteps.includes(s.id)).length} / {c.steps.length}</td></tr>) : <tr><td colSpan={3} className="border-t border-ze-border py-3 text-ze-muted">Менеджеры ещё не отмечали прогресс.</td></tr>}
        </tbody></table></div>
      </article>)}
    </div>

    {editing && <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4" role="dialog" aria-modal="true">
      <form className="my-6 w-full max-w-3xl rounded-2xl bg-white p-6" onSubmit={(e) => { e.preventDefault(); run(() => saveChecklist(editing.id, editing.data), () => setEditing(null)); }}>
        <div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">{editing.id ? "Изменить чек-лист" : "Новый чек-лист"} · {monthLabel(editing.data.month)}</h2><button type="button" aria-label="Закрыть" onClick={() => setEditing(null)}><X className="h-5 w-5" /></button></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-bold">Название<input required className={`${field} mt-1`} value={editing.data.title} onChange={(e) => setEditing({ ...editing, data: { ...editing.data, title: e.target.value } })} placeholder="Привести 90 клиентов на встречу" /></label>
          <label className="sm:col-span-2 text-sm font-bold">Цель и задача<textarea rows={3} className={`${field} mt-1`} value={editing.data.goal} onChange={(e) => setEditing({ ...editing, data: { ...editing.data, goal: e.target.value } })} placeholder="Довести клиента до горячего лида, готового купить продукт" /></label>
          <label className="text-sm font-bold">Целевое число<input type="number" min={0} className={`${field} mt-1`} value={editing.data.targetCount} onChange={(e) => setEditing({ ...editing, data: { ...editing.data, targetCount: Number(e.target.value) } })} /></label>
          <label className="text-sm font-bold">Что считаем<input className={`${field} mt-1`} value={editing.data.targetLabel} onChange={(e) => setEditing({ ...editing, data: { ...editing.data, targetLabel: e.target.value } })} placeholder="Клиентов на встрече" /></label>
        </div>
        <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-ze-muted">Шаги</h3>
        <div className="mt-2 space-y-3">{editing.data.steps.map((step, i) => {
          const setStep = (patch: Partial<typeof step>) => setEditing({ ...editing, data: { ...editing.data, steps: editing.data.steps.map((s, j) => j === i ? { ...s, ...patch } : s) } });
          return <div key={step.id ?? i} className="rounded-xl border border-ze-border p-3">
            <div className="flex gap-2"><input className={field} value={step.title} onChange={(e) => setStep({ title: e.target.value })} placeholder={`Шаг ${i + 1}: например, презентовать полный пакет`} /><button type="button" aria-label="Удалить шаг" onClick={() => setEditing({ ...editing, data: { ...editing.data, steps: editing.data.steps.filter((_, j) => j !== i) } })} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-red-200 text-red-600"><Trash2 className="h-4 w-4" /></button></div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2"><textarea rows={3} className={field} value={step.say} onChange={(e) => setStep({ say: e.target.value })} placeholder="Что говорить клиенту" /><textarea rows={3} className={field} value={step.do} onChange={(e) => setStep({ do: e.target.value })} placeholder="Что делать (пригласить в офис, отправить КП…)" /></div>
          </div>;
        })}</div>
        <button type="button" onClick={() => setEditing({ ...editing, data: { ...editing.data, steps: [...editing.data.steps, { title: "", say: "", do: "" }] } })} className="mt-3 flex items-center gap-2 text-sm font-bold text-ze-primary"><Plus className="h-4 w-4" />Добавить шаг</button>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-ze-border px-4 py-2.5 text-sm font-bold">Отмена</button><button type="submit" disabled={busy} className="rounded-xl bg-ze-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Сохранить</button></div>
      </form>
    </div>}
  </div>;
}
