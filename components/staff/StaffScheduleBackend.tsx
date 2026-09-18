"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3,
  Copy, Edit3, MapPin, Monitor, Plus, Trash2, UserPlus, Users, X,
} from "lucide-react";
import type { Profile } from "@/lib/types";
import type { ScheduleFormat, ScheduleLanguage, ScheduleSlot } from "@/lib/schedule-data";
import {
  addScheduleSlot, copyScheduleDay, deleteScheduleSlot, enrollScheduleStudent,
  removeScheduleEnrollment, updateScheduleSlot, type ScheduleSlotInput,
} from "@/lib/schedule-actions";

type Filter<T extends string> = T | "all";
type Notice = { type: "ok" | "error"; text: string };

const LANGUAGE = {
  english: { label: "Английский", days: "Пн–Ср", style: "bg-blue-50 text-blue-700" },
  chinese: { label: "Китайский", days: "Чт–Сб", style: "bg-red-50 text-red-700" },
} satisfies Record<ScheduleLanguage, { label: string; days: string; style: string }>;
const FIELD_CLASS = "mt-1.5 w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-sm text-ze-ink outline-none focus:border-ze-primary";

function parseDate(value: string) { return new Date(`${value}T12:00:00`); }
function isoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function addDays(value: string, amount: number) { const date = parseDate(value); date.setDate(date.getDate() + amount); return isoDate(date); }
function startOfWeek(value: string) { const date = parseDate(value); const day = date.getDay() || 7; date.setDate(date.getDate() - day + 1); return isoDate(date); }
function today() { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Almaty" }).format(new Date()); }
function shortDay(value: string) { return new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(parseDate(value)).replace(".", ""); }
function fullDate(value: string) { return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(parseDate(value)); }

export function StaffScheduleBackend({ profile, slots }: { profile: Profile; slots: ScheduleSlot[] }) {
  const router = useRouter();
  const isAdmin = profile.role === "admin";
  const initialDate = slots.find((slot) => slot.lesson_date >= today())?.lesson_date || today();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [weekStart, setWeekStart] = useState(startOfWeek(initialDate));
  const [language, setLanguage] = useState<Filter<ScheduleLanguage>>("all");
  const [format, setFormat] = useState<Filter<ScheduleFormat>>("all");
  const [editing, setEditing] = useState<ScheduleSlot | "new" | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
  const filtered = useMemo(() => slots.filter((slot) =>
    (language === "all" || slot.language === language) && (format === "all" || slot.format === format)
  ), [slots, language, format]);
  const selectedSlots = filtered.filter((slot) => slot.lesson_date === selectedDate);

  async function mutate(action: () => Promise<{ success: boolean; error?: string }>, successText: string) {
    setPending(true); setNotice(null);
    const response = await action();
    if (!response.success) setNotice({ type: "error", text: response.error || "Не удалось сохранить изменения" });
    else { setNotice({ type: "ok", text: successText }); router.refresh(); }
    setPending(false);
    return response.success;
  }

  function moveWeek(amount: number) {
    const next = addDays(weekStart, amount * 7);
    setWeekStart(next);
    setSelectedDate(next);
  }

  return <div className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-ze-primary"><CalendarDays className="h-5.5 w-5.5" /></div><div><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[32px]">Расписание языковых занятий</h1><p className="mt-1 text-sm text-ze-muted">Английский — Пн–Ср · Китайский — Чт–Сб · Онлайн 10 мест · Офлайн 8 мест</p></div></div>
      {isAdmin && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setCopyOpen(true)} className="flex items-center gap-2 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-sm font-bold text-slate-700"><Copy className="h-4 w-4" />Копировать день</button><button type="button" onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Добавить слот</button></div>}
    </div>

    {notice && <div className={`mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${notice.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.type === "ok" ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" /> : <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />}{notice.text}</div>}

    <section className="mt-6 rounded-2xl border border-ze-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-2 sm:justify-start"><button type="button" onClick={() => moveWeek(-1)} aria-label="Предыдущая неделя" className="rounded-lg border border-ze-border p-2 text-slate-600"><ChevronLeft className="h-4 w-4" /></button><div className="min-w-[190px] text-center text-sm font-extrabold">{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(parseDate(days[0]))} — {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(parseDate(days[6]))}</div><button type="button" onClick={() => moveWeek(1)} aria-label="Следующая неделя" className="rounded-lg border border-ze-border p-2 text-slate-600"><ChevronRight className="h-4 w-4" /></button></div>
        <div className="flex flex-wrap gap-2"><FilterButton active={language === "all"} onClick={() => setLanguage("all")}>Все языки</FilterButton><FilterButton active={language === "english"} onClick={() => setLanguage("english")}>Английский</FilterButton><FilterButton active={language === "chinese"} onClick={() => setLanguage("chinese")}>Китайский</FilterButton><span className="hidden h-8 w-px bg-ze-border sm:block" /><FilterButton active={format === "all"} onClick={() => setFormat("all")}>Все форматы</FilterButton><FilterButton active={format === "online"} onClick={() => setFormat("online")}>Онлайн</FilterButton><FilterButton active={format === "offline"} onClick={() => setFormat("offline")}>Офлайн</FilterButton></div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">{days.map((date) => { const count = filtered.filter((slot) => slot.lesson_date === date).length; const active = selectedDate === date; return <button key={date} type="button" onClick={() => setSelectedDate(date)} className={`rounded-xl border px-1 py-2.5 text-center transition sm:px-3 ${active ? "border-ze-primary bg-ze-primary text-white shadow-md" : "border-ze-border bg-white hover:border-blue-200"}`}><span className={`block text-[10px] font-bold uppercase sm:text-xs ${active ? "text-white/75" : "text-ze-muted"}`}>{shortDay(date)}</span><span className="mt-1 block text-base font-extrabold sm:text-lg">{parseDate(date).getDate()}</span><span className={`mt-0.5 block text-[9px] sm:text-[10px] ${active ? "text-white/75" : "text-ze-muted"}`}>{count || "—"}</span></button>; })}</div>
    </section>

    <div className="mt-6 flex items-center justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-ze-primary">Выбранный день</div><h2 className="mt-1 text-xl font-extrabold capitalize">{fullDate(selectedDate)}</h2></div><div className="text-sm font-semibold text-ze-muted">{selectedSlots.length} занятий</div></div>
    <div className="mt-4 grid gap-4 xl:grid-cols-2">{selectedSlots.map((slot) => <SlotCard key={slot.id} slot={slot} isAdmin={isAdmin} pending={pending} onEdit={() => setEditing(slot)} onDelete={() => { if (window.confirm("Удалить этот слот?")) void mutate(() => deleteScheduleSlot(slot.id), "Слот удалён"); }} mutate={mutate} />)}{selectedSlots.length === 0 && <div className="rounded-2xl border border-dashed border-ze-border bg-white p-12 text-center text-sm text-ze-muted xl:col-span-2">На этот день занятий нет.{isAdmin && <button type="button" onClick={() => setEditing("new")} className="mx-auto mt-3 block font-bold text-ze-primary">Добавить первый слот</button>}</div>}</div>

    {editing && <SlotModal slot={editing === "new" ? undefined : editing} initialDate={selectedDate} pending={pending} onClose={() => setEditing(null)} onSubmit={async (input) => { const ok = await mutate(() => editing === "new" ? addScheduleSlot(input) : updateScheduleSlot(editing.id, input), editing === "new" ? "Слот добавлен" : "Слот обновлён"); if (ok) setEditing(null); }} />}
    {copyOpen && <CopyDayModal sourceDate={selectedDate} pending={pending} onClose={() => setCopyOpen(false)} onCopy={async (targetDate) => { setPending(true); setNotice(null); const response = await copyScheduleDay(selectedDate, targetDate); if (!response.success) setNotice({ type: "error", text: response.error || "Не удалось скопировать день" }); else { const conflicts = response.data?.conflicts || []; setNotice({ type: conflicts.length ? "error" : "ok", text: `Скопировано слотов: ${response.data?.copied || 0}.${conflicts.length ? ` Пропущено: ${conflicts.length} — ${conflicts.map((item) => `${item.time_start} ${item.reason.toLowerCase()}`).join(", ")}.` : " Записи студентов не копировались."}` }); setCopyOpen(false); router.refresh(); } setPending(false); }} />}
  </div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${active ? "bg-blue-50 text-ze-primary" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>{children}</button>; }

function SlotCard({ slot, isAdmin, pending, onEdit, onDelete, mutate }: { slot: ScheduleSlot; isAdmin: boolean; pending: boolean; onEdit: () => void; onDelete: () => void; mutate: (action: () => Promise<{ success: boolean; error?: string }>, text: string) => Promise<boolean> }) {
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const full = slot.free_places === 0;
  return <article className="rounded-2xl border border-ze-border bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${slot.format === "online" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>{slot.format === "online" ? <Monitor className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}</span><div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${LANGUAGE[slot.language].style}`}>{LANGUAGE[slot.language].label}</span><span className="text-xs font-bold text-ze-muted">{slot.format === "online" ? "Онлайн" : "Офлайн"}</span></div><div className="mt-1.5 flex items-center gap-1.5 text-lg font-extrabold"><Clock3 className="h-4 w-4 text-ze-primary" />{slot.time_start}–{slot.time_end}</div></div></div>{isAdmin && <div className="flex gap-1"><button type="button" onClick={onEdit} className="rounded-lg p-2 text-ze-muted hover:bg-blue-50 hover:text-ze-primary"><Edit3 className="h-4 w-4" /></button><button type="button" onClick={onDelete} className="rounded-lg p-2 text-ze-muted hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>}</div>
    <div className="mt-4"><div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">Записано {slot.enrollment_count} из {slot.capacity}</span><span className={full ? "font-bold text-red-600" : "font-bold text-emerald-700"}>{full ? "Мест нет" : `Свободно ${slot.free_places}`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${full ? "bg-red-500" : "bg-ze-primary"}`} style={{ width: `${Math.min(100, slot.enrollment_count / slot.capacity * 100)}%` }} /></div></div>
    <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setStudentsOpen((value) => !value)} className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"><Users className="h-3.5 w-3.5" />{studentsOpen ? "Скрыть список" : "Студенты"}</button><button type="button" disabled={full} onClick={() => setFormOpen((value) => !value)} className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-ze-primary disabled:opacity-50"><UserPlus className="h-3.5 w-3.5" />Записать вручную</button></div>
    {studentsOpen && <div className="mt-4 rounded-xl bg-slate-50 p-3"><div className="mb-2 text-xs font-extrabold text-slate-700">Список студентов</div>{slot.enrollments.length ? <div className="space-y-1.5">{slot.enrollments.map((student, index) => <div key={student.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-xs"><span className="min-w-0 truncate"><b>{index + 1}. {student.student_name}</b>{student.student_phone && <span className="ml-2 text-ze-muted">{student.student_phone}</span>}</span><button type="button" disabled={pending} onClick={() => void mutate(() => removeScheduleEnrollment(student.id), "Запись студента удалена")} aria-label="Удалить запись" className="text-ze-muted hover:text-red-600"><X className="h-4 w-4" /></button></div>)}</div> : <p className="text-xs text-ze-muted">Пока никто не записан.</p>}</div>}
    {formOpen && <div className="mt-4 grid gap-2 rounded-xl border border-blue-100 bg-blue-50/40 p-3 sm:grid-cols-[1fr_1fr_auto]"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя студента" className="rounded-lg border border-ze-border bg-white px-3 py-2 text-xs" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Телефон" className="rounded-lg border border-ze-border bg-white px-3 py-2 text-xs" /><button type="button" disabled={pending || !name.trim()} onClick={async () => { const ok = await mutate(() => enrollScheduleStudent(slot.id, name, phone), "Студент записан"); if (ok) { setName(""); setPhone(""); setFormOpen(false); } }} className="rounded-lg bg-ze-primary px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Записать</button></div>}
  </article>;
}

function SlotModal({ slot, initialDate, pending, onClose, onSubmit }: { slot?: ScheduleSlot; initialDate: string; pending: boolean; onClose: () => void; onSubmit: (input: ScheduleSlotInput) => Promise<void> }) {
  const [language, setLanguage] = useState<ScheduleLanguage>(slot?.language || "english");
  const [lessonDate, setLessonDate] = useState(slot?.lesson_date || initialDate);
  const [format, setFormat] = useState<ScheduleFormat>(slot?.format || "online");
  const [capacity, setCapacity] = useState(slot?.capacity || (format === "online" ? 10 : 8));
  const [timeStart, setTimeStart] = useState(slot?.time_start || "15:00");
  const [timeEnd, setTimeEnd] = useState(slot?.time_end || "17:00");
  return <Modal title={slot ? "Редактировать слот" : "Новый слот"} onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); void onSubmit({ language, lessonDate, timeStart, timeEnd, format, capacity }); }}>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Язык"><select value={language} onChange={(event) => setLanguage(event.target.value as ScheduleLanguage)} className={FIELD_CLASS}><option value="english">Английский — Пн–Ср</option><option value="chinese">Китайский — Чт–Сб</option></select></Field><Field label="Дата"><input type="date" required value={lessonDate} onChange={(event) => setLessonDate(event.target.value)} className={FIELD_CLASS} /></Field><Field label="Начало"><input type="time" required value={timeStart} onChange={(event) => setTimeStart(event.target.value)} className={FIELD_CLASS} /></Field><Field label="Окончание"><input type="time" required value={timeEnd} onChange={(event) => setTimeEnd(event.target.value)} className={FIELD_CLASS} /></Field><Field label="Формат"><select value={format} onChange={(event) => { const next = event.target.value as ScheduleFormat; setFormat(next); if (!slot) setCapacity(next === "online" ? 10 : 8); }} className={FIELD_CLASS}><option value="online">Онлайн</option><option value="offline">Офлайн</option></select></Field><Field label="Количество мест"><input type="number" min={1} max={100} required value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} className={FIELD_CLASS} /></Field></div>
    <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-800">Английский можно поставить только на понедельник–среду, китайский — на четверг–субботу. Рекомендуемая вместимость: онлайн 10, офлайн 8.</p>
    <button disabled={pending} className="mt-5 w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Сохраняем…" : slot ? "Сохранить изменения" : "Добавить слот"}</button>
  </form></Modal>;
}

function CopyDayModal({ sourceDate, pending, onClose, onCopy }: { sourceDate: string; pending: boolean; onClose: () => void; onCopy: (targetDate: string) => Promise<void> }) {
  const [targetDate, setTargetDate] = useState(addDays(sourceDate, 7));
  return <Modal title="Копировать расписание дня" onClose={onClose}><p className="text-sm leading-6 text-ze-muted">Все слоты за <b className="text-ze-ink">{fullDate(sourceDate)}</b> будут скопированы на новую дату. Записанные студенты не копируются.</p><Field label="Дата назначения"><input type="date" value={targetDate} min={today()} onChange={(event) => setTargetDate(event.target.value)} className={FIELD_CLASS} /></Field><button type="button" disabled={pending || !targetDate || targetDate === sourceDate} onClick={() => void onCopy(targetDate)} className="mt-5 w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Копируем…" : "Копировать слоты"}</button></Modal>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"><div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">{title}</h2><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>{children}</div></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="mt-3 block text-xs font-semibold text-ze-muted">{label}{children}</label>; }
