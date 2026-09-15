"use client";
/* eslint-disable react-hooks/purity */

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, Plus, RotateCcw, X } from "lucide-react";
import { createManagerTask, updateManagerTask } from "@/lib/staff-actions";
import type { Client, ManagerTask, ManagerTaskPriority, ManagerTaskType, Profile } from "@/lib/types";

const TYPES: { value: ManagerTaskType; label: string }[] = [
  { value: "call", label: "Звонок" }, { value: "whatsapp", label: "WhatsApp" }, { value: "meeting", label: "Встреча" },
  { value: "document_review", label: "Проверка документа" }, { value: "payment", label: "Получение оплаты" },
  { value: "proposal", label: "Подготовка предложения" }, { value: "application", label: "Подача заявки" },
  { value: "reminder", label: "Напоминание" }, { value: "other", label: "Другая задача" },
];
const PRIORITIES: { value: ManagerTaskPriority; label: string }[] = [
  { value: "low", label: "Низкий" }, { value: "normal", label: "Обычный" }, { value: "high", label: "Высокий" }, { value: "urgent", label: "Срочный" },
];
const priorityStyle: Record<ManagerTaskPriority, string> = { low: "bg-slate-100 text-slate-600", normal: "bg-blue-50 text-blue-700", high: "bg-amber-50 text-amber-700", urgent: "bg-red-50 text-red-700" };

function localDateTime(date: Date) {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
}

export function ManagerTasksBoard({ tasks, managers, clients, currentProfile }: { tasks: ManagerTask[]; managers: Profile[]; clients: Client[]; currentProfile: Profile }) {
  const [view, setView] = useState<"today" | "upcoming" | "overdue" | "completed" | "calendar">("today");
  const [managerId, setManagerId] = useState(currentProfile.role === "admin" ? "all" : currentProfile.id);
  const [clientId, setClientId] = useState("all");
  const [creating, setCreating] = useState(false);
  const [busy, startTransition] = useTransition();
  const [range] = useState(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endToday = new Date(startToday); endToday.setDate(endToday.getDate() + 1);
    return { now, startToday, endToday };
  });
  const { now, startToday, endToday } = range;

  const visible = useMemo(() => tasks.filter((task) => {
    if (managerId !== "all" && task.managerId !== managerId) return false;
    if (clientId !== "all" && task.clientId !== clientId) return false;
    const due = task.dueAt ? new Date(task.dueAt) : null;
    if (view === "completed") return task.status === "completed";
    if (task.status === "completed" || task.status === "cancelled") return false;
    if (view === "today") return due && due >= startToday && due < endToday;
    if (view === "overdue") return due && due < now;
    if (view === "upcoming") return !due || due >= endToday;
    return true;
  }).sort((a, b) => (a.dueAt || "9999").localeCompare(b.dueAt || "9999")), [tasks, managerId, clientId, view, now, startToday, endToday]);

  const counts = {
    today: tasks.filter((t) => t.status !== "completed" && t.dueAt && new Date(t.dueAt) >= startToday && new Date(t.dueAt) < endToday).length,
    overdue: tasks.filter((t) => t.status !== "completed" && t.dueAt && new Date(t.dueAt) < now).length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  function mutate(taskId: string, input: Parameters<typeof updateManagerTask>[1]) {
    startTransition(async () => { await updateManagerTask(taskId, input); });
  }

  const tabs = [["today", `Сегодня · ${counts.today}`], ["upcoming", "Ближайшие"], ["overdue", `Просроченные · ${counts.overdue}`], ["completed", `Выполненные · ${counts.completed}`], ["calendar", "Календарь"]] as const;

  return <div className="mt-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">{tabs.map(([key, label]) => <button key={key} onClick={() => setView(key)} className={`rounded-xl px-3.5 py-2 text-[13px] font-semibold ${view === key ? "bg-ze-primary text-white" : "border border-ze-border bg-white text-ze-muted"}`}>{label}</button>)}</div>
      <button onClick={() => setCreating(true)} className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white"><Plus className="h-4 w-4" />Новая задача</button>
    </div>
    <div className="mt-4 grid gap-3 rounded-2xl border border-ze-border bg-white p-4 sm:grid-cols-2">
      <select value={managerId} onChange={(e) => setManagerId(e.target.value)} className="rounded-xl border border-ze-border px-3 py-2 text-sm"><option value="all">Все менеджеры</option>{managers.map((m) => <option key={m.id} value={m.id}>{m.fullName || "Без имени"}</option>)}</select>
      <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="rounded-xl border border-ze-border px-3 py-2 text-sm"><option value="all">Все клиенты</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}</select>
    </div>

    {view === "calendar" ? <CalendarView tasks={visible} /> : <div className="mt-4 space-y-3">
      {visible.length === 0 && <div className="rounded-2xl border border-dashed border-ze-border bg-white p-12 text-center text-sm text-ze-muted">В этом разделе задач пока нет.</div>}
      {visible.map((task) => <article key={task.id} className="rounded-2xl border border-ze-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,.04)] sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${priorityStyle[task.priority]}`}>{PRIORITIES.find((p) => p.value === task.priority)?.label}</span><span className="text-[12px] text-ze-muted">{TYPES.find((t) => t.value === task.taskType)?.label}</span></div><h2 className="mt-2 text-[15px] font-bold">{task.title}</h2>{task.description && <p className="mt-1 text-[13px] text-ze-muted">{task.description}</p>}<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ze-muted"><span>{task.clientName || "Без клиента"}</span><span>{task.managerName || "Менеджер"}</span><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{task.dueAt ? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(task.dueAt)) : "Без срока"}</span></div></div>
          {task.status !== "completed" ? <div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => { const comment = window.prompt("Комментарий результата (необязательно)") ?? ""; mutate(task.id, { status: "completed", resultComment: comment }); }} className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[12px] font-bold text-emerald-700"><Check className="h-4 w-4" />Завершить</button><button disabled={busy} onClick={() => { const value = window.prompt("Новый срок (ГГГГ-ММ-ДД ЧЧ:ММ)", localDateTime(task.dueAt ? new Date(task.dueAt) : now)); if (value) mutate(task.id, { dueAt: new Date(value).toISOString() }); }} className="flex items-center gap-1.5 rounded-xl border border-ze-border px-3 py-2 text-[12px] font-bold"><ChevronRight className="h-4 w-4" />Перенести</button></div> : <button disabled={busy} onClick={() => mutate(task.id, { status: "open", resultComment: "" })} className="flex items-center gap-1.5 rounded-xl border border-ze-border px-3 py-2 text-[12px] font-bold"><RotateCcw className="h-4 w-4" />Вернуть</button>}
        </div>{task.resultComment && <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[12.5px] text-slate-600">Результат: {task.resultComment}</div>}
      </article>)}
    </div>}
    {creating && <TaskModal managers={managers} clients={clients} defaultManagerId={managerId === "all" ? currentProfile.id : managerId} onClose={() => setCreating(false)} />}
  </div>;
}

function CalendarView({ tasks }: { tasks: ManagerTask[] }) {
  const groups = new Map<string, ManagerTask[]>();
  for (const task of tasks) { const key = task.dueAt ? task.dueAt.slice(0, 10) : "Без срока"; groups.set(key, [...(groups.get(key) || []), task]); }
  return <div className="mt-4 grid gap-4 lg:grid-cols-2">{Array.from(groups.entries()).map(([date, items]) => <section key={date} className="rounded-2xl border border-ze-border bg-white p-4"><h2 className="flex items-center gap-2 text-sm font-bold"><CalendarDays className="h-4 w-4 text-ze-primary" />{date === "Без срока" ? date : new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00`))}</h2><div className="mt-3 space-y-2">{items.map((t) => <div key={t.id} className="rounded-xl bg-slate-50 p-3"><div className="text-[13px] font-semibold">{t.title}</div><div className="mt-1 text-[11.5px] text-ze-muted">{t.clientName || "Без клиента"}</div></div>)}</div></section>)}</div>;
}

function TaskModal({ managers, clients, defaultManagerId, onClose }: { managers: Profile[]; clients: Client[]; defaultManagerId: string; onClose: () => void }) {
  const [pending, startTransition] = useTransition(); const [error, setError] = useState("");
  function submit(form: FormData) { startTransition(async () => { const res = await createManagerTask({ managerId: String(form.get("managerId")), clientId: String(form.get("clientId")) || null, title: String(form.get("title")), description: String(form.get("description")), taskType: String(form.get("taskType")) as ManagerTaskType, priority: String(form.get("priority")) as ManagerTaskPriority, dueAt: form.get("dueAt") ? new Date(String(form.get("dueAt"))).toISOString() : null }); if (res.success) onClose(); else setError(res.error || "Ошибка"); }); }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"><form action={submit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">Новая задача</h2><button type="button" onClick={onClose} aria-label="Закрыть"><X className="h-5 w-5" /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-ze-muted sm:col-span-2">Название<input name="title" required className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink" /></label><label className="text-xs font-semibold text-ze-muted">Менеджер<select name="managerId" defaultValue={defaultManagerId} className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink">{managers.map((m) => <option key={m.id} value={m.id}>{m.fullName || "Без имени"}</option>)}</select></label><label className="text-xs font-semibold text-ze-muted">Клиент<select name="clientId" className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink"><option value="">Без клиента</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}</select></label><label className="text-xs font-semibold text-ze-muted">Тип<select name="taskType" className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink">{TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></label><label className="text-xs font-semibold text-ze-muted">Приоритет<select name="priority" className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink">{PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select></label><label className="text-xs font-semibold text-ze-muted">Срок<input name="dueAt" type="datetime-local" defaultValue={localDateTime(new Date(Date.now() + 86_400_000))} className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink" /></label><label className="text-xs font-semibold text-ze-muted sm:col-span-2">Описание<textarea name="description" rows={3} className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink" /></label></div>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<button disabled={pending} className="mt-5 w-full rounded-xl bg-ze-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Сохраняем…" : "Создать задачу"}</button></form></div>;
}
