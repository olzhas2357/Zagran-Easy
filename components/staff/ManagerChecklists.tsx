"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Flame, MessageSquareQuote, Minus, Plus, Target, Zap } from "lucide-react";
import { saveChecklistProgress } from "@/lib/staff-actions";
import type { ManagerChecklist } from "@/lib/types";

export function ManagerChecklists({ checklists, monthTitle }: { checklists: ManagerChecklist[]; monthTitle: string }) {
  return <section className="mt-6">
    <div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Чек-лист на месяц</div>
    <h2 className="mt-1 text-xl font-extrabold">{monthTitle}: ваши задачи</h2>
    {checklists.length
      ? <div className="mt-4 grid gap-4 xl:grid-cols-2">{checklists.map((c) => <ChecklistCard key={c.id} checklist={c} />)}</div>
      : <div className="mt-4 rounded-2xl border border-dashed border-ze-border bg-white p-8 text-center text-sm text-ze-muted">На этот месяц администратор ещё не добавил чек-лист.</div>}
  </section>;
}

function ChecklistCard({ checklist }: { checklist: ManagerChecklist }) {
  const [done, setDone] = useState<string[]>(checklist.myProgress?.completedSteps ?? []);
  const [count, setCount] = useState(checklist.myProgress?.doneCount ?? 0);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  function persist(nextDone: string[], nextCount: number) {
    const prev = { done, count };
    setDone(nextDone); setCount(nextCount); setError("");
    startTransition(async () => {
      const res = await saveChecklistProgress(checklist.id, nextDone, nextCount);
      if (!res.success) { setDone(prev.done); setCount(prev.count); setError(res.error || "Не удалось сохранить"); }
    });
  }

  const toggle = (id: string) => persist(done.includes(id) ? done.filter((d) => d !== id) : [...done, id], count);
  const target = checklist.targetCount;
  const percent = target ? Math.min(100, Math.round((count / target) * 100)) : 0;
  const stepsDone = checklist.steps.filter((s) => done.includes(s.id)).length;

  return <article className="rounded-[22px] border border-ze-border bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)]">
    <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700"><Flame className="h-5 w-5" /></div><div><h3 className="text-lg font-extrabold leading-snug">{checklist.title}</h3>{checklist.goal && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-ze-muted">{checklist.goal}</p>}</div></div>

    {target > 0 && <div className="mt-4 rounded-2xl bg-blue-50/60 p-4">
      <div className="flex items-center justify-between gap-3 text-sm font-bold"><span className="flex items-center gap-2 text-ze-primary"><Target className="h-4 w-4" />{checklist.targetLabel || "Цель"}</span><span>{count} / {target}</span></div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-ze-primary transition-all" style={{ width: `${percent}%` }} /></div>
      <div className="mt-3 flex items-center gap-2"><button type="button" aria-label="Минус один" onClick={() => persist(done, Math.max(0, count - 1))} className="grid h-9 w-9 place-items-center rounded-lg border border-ze-border bg-white"><Minus className="h-4 w-4" /></button><button type="button" aria-label="Плюс один" onClick={() => persist(done, count + 1)} className="grid h-9 w-9 place-items-center rounded-lg bg-ze-primary text-white"><Plus className="h-4 w-4" /></button><span className="text-xs text-ze-muted">{percent}% выполнено</span></div>
    </div>}

    <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ze-muted"><span>Шаги</span><span>{stepsDone} из {checklist.steps.length}</span></div>
    <ul className="mt-2 space-y-2">{checklist.steps.map((step, index) => {
      const checked = done.includes(step.id);
      const expanded = open === step.id;
      return <li key={step.id} className="rounded-xl border border-ze-border">
        <div className="flex items-center gap-3 p-3">
          <input type="checkbox" checked={checked} onChange={() => toggle(step.id)} aria-label={step.title} className="h-5 w-5 shrink-0 accent-[#3255AD]" />
          <button type="button" onClick={() => setOpen(expanded ? null : step.id)} className="flex flex-1 items-center justify-between gap-2 text-left"><span className={`text-sm font-bold ${checked ? "text-ze-muted line-through" : ""}`}>{index + 1}. {step.title}</span>{(step.say || step.do) && <ChevronDown className={`h-4 w-4 shrink-0 transition ${expanded ? "rotate-180" : ""}`} />}</button>
        </div>
        {expanded && <div className="space-y-3 border-t border-ze-border bg-slate-50/60 p-3 text-sm leading-6">
          {step.say && <div><div className="flex items-center gap-1.5 text-xs font-bold uppercase text-violet-700"><MessageSquareQuote className="h-3.5 w-3.5" />Что говорить</div><p className="mt-1 whitespace-pre-line">{step.say}</p></div>}
          {step.do && <div><div className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-700"><Zap className="h-3.5 w-3.5" />Что делать</div><p className="mt-1 whitespace-pre-line">{step.do}</p></div>}
        </div>}
      </li>;
    })}</ul>
    {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
  </article>;
}
