"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Plus, Settings2, Trash2, UserPlus, X } from "lucide-react";
import type { Profile } from "@/lib/types";
import type { ScheduleCourse, ScheduleFormat, ScheduleSlot } from "@/lib/schedule-data";
import { addScheduleSlot, deleteScheduleSlot, enrollScheduleStudent, removeScheduleEnrollment, updateScheduleCourse, updateScheduleSlot } from "@/lib/schedule-actions";

export function StaffScheduleBackend({ profile, courses }: { profile: Profile; courses: ScheduleCourse[] }) {
  const router = useRouter();
  const isAdmin = profile.role === "admin";
  const [mode, setMode] = useState<"manager" | "admin">(isAdmin ? "admin" : "manager");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function mutate(action: () => Promise<{ success: boolean; error?: string }>) {
    setPending(true); setError("");
    const response = await action();
    if (!response.success) setError(response.error || "Не удалось сохранить изменения");
    else router.refresh();
    setPending(false);
  }

  return <div className="p-5 sm:p-9">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div className="flex items-center gap-2.5"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-ze-primary"><CalendarDays className="h-5 w-5" /></div><div><h1 className="text-[24px] font-extrabold tracking-tight sm:text-[28px]">Расписание уроков</h1><p className="mt-0.5 text-[14px] text-ze-muted">Общая запись студентов для команды</p></div></div>
      {isAdmin && <div className="inline-flex rounded-xl border border-ze-border bg-white p-1 shadow-sm"><button type="button" onClick={() => setMode("manager")} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold ${mode === "manager" ? "bg-blue-50 text-ze-primary" : "text-ze-muted"}`}><UserPlus className="h-4 w-4" /> Запись</button><button type="button" onClick={() => setMode("admin")} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold ${mode === "admin" ? "bg-blue-50 text-ze-primary" : "text-ze-muted"}`}><Settings2 className="h-4 w-4" /> Настройка</button></div>}
    </div>
    {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">{error}</div>}
    <div className="mt-7 space-y-5">
      {courses.length === 0 ? <div className="rounded-[20px] border border-dashed border-ze-border bg-white p-8 text-center text-[14px] text-ze-muted">Расписание пока не загрузилось. Проверьте подключение к серверу.</div> : courses.map((course) => <CourseCard key={course.id} course={course} mode={mode} pending={pending} mutate={mutate} />)}
    </div>
    <p className="mt-5 text-center text-[12px] text-ze-muted">Данные сохраняются на сервере и доступны всей команде.</p>
  </div>;
}

function CourseCard({ course, mode, pending, mutate }: { course: ScheduleCourse; mode: "manager" | "admin"; pending: boolean; mutate: (action: () => Promise<{ success: boolean; error?: string }>) => Promise<void> }) {
  return <section className="rounded-[20px] border border-ze-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-[17px] font-bold text-ze-ink">{course.name}</h2><p className="mt-1 text-[13px] text-ze-muted">{course.days}</p></div>{mode === "admin" && <div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><EditInput label="Дни" value={course.days} pending={pending} onSave={(value) => mutate(() => updateScheduleCourse(course.id, { days: value }))} /><EditNumber label="Офлайн мест" value={course.offline_cap} pending={pending} onSave={(value) => mutate(() => updateScheduleCourse(course.id, { offline_cap: value }))} /><EditNumber label="Онлайн мест" value={course.online_cap} pending={pending} onSave={(value) => mutate(() => updateScheduleCourse(course.id, { online_cap: value }))} /></div>}</div><div className="mt-5 space-y-5">{course.slots.map((slot) => <SlotCard key={slot.id} slot={slot} course={course} mode={mode} pending={pending} mutate={mutate} />)}</div>{mode === "admin" && <button type="button" disabled={pending} onClick={() => mutate(() => addScheduleSlot(course.id))} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ze-border py-2.5 text-[13px] font-semibold text-ze-primary hover:bg-blue-50 disabled:opacity-50"><Plus className="h-4 w-4" /> Добавить временной слот</button>}</section>;
}

function SlotCard({ slot, course, mode, pending, mutate }: { slot: ScheduleSlot; course: ScheduleCourse; mode: "manager" | "admin"; pending: boolean; mutate: (action: () => Promise<{ success: boolean; error?: string }>) => Promise<void> }) {
  return <div className="border-t border-ze-border pt-4 first:border-0 first:pt-0"><div className="mb-3 flex items-center justify-between gap-3">{mode === "admin" ? <div className="flex gap-2"><EditInput label="Начало" value={slot.time_start} pending={pending} onSave={(value) => mutate(() => updateScheduleSlot(slot.id, { time_start: value }))} /><EditInput label="Конец" value={slot.time_end} pending={pending} onSave={(value) => mutate(() => updateScheduleSlot(slot.id, { time_end: value }))} /></div> : <h3 className="text-[14px] font-bold text-ze-ink">{slot.time_start} — {slot.time_end}</h3>}{mode === "admin" && <button type="button" disabled={pending} onClick={() => mutate(() => deleteScheduleSlot(slot.id))} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ze-muted hover:text-red-600 disabled:opacity-40"><Trash2 className="h-3.5 w-3.5" /> Удалить</button>}</div><div className="grid gap-3 lg:grid-cols-2"><EnrollmentCard slot={slot} format="offline" capacity={course.offline_cap} pending={pending} mutate={mutate} /><EnrollmentCard slot={slot} format="online" capacity={course.online_cap} pending={pending} mutate={mutate} /></div></div>;
}

function EnrollmentCard({ slot, format, capacity, pending, mutate }: { slot: ScheduleSlot; format: ScheduleFormat; capacity: number; pending: boolean; mutate: (action: () => Promise<{ success: boolean; error?: string }>) => Promise<void> }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const students = slot.enrollments.filter((item) => item.format === format); const full = students.length >= capacity;
  return <div className="rounded-xl border border-ze-border p-3.5"><div className="flex items-center justify-between gap-2"><span className="text-[13px] font-bold text-ze-ink">{format === "offline" ? "Офлайн" : "Онлайн"}</span><span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${full ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{students.length} / {capacity}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-ze-primary" style={{ width: `${capacity ? Math.min(100, students.length / capacity * 100) : 100}%` }} /></div><div className="mt-3 space-y-1.5">{students.length === 0 ? <p className="py-1 text-[12px] text-ze-muted">Пока никто не записан.</p> : students.map((student) => <div key={student.id} className="flex items-center justify-between gap-2 border-b border-ze-border py-1.5 last:border-0"><span className="min-w-0 truncate text-[13px] text-ze-ink"><b>{student.student_name}</b>{student.student_phone && <span className="ml-1.5 text-[12px] text-ze-muted">{student.student_phone}</span>}</span><button type="button" aria-label={`Удалить ${student.student_name}`} disabled={pending} onClick={() => mutate(() => removeScheduleEnrollment(student.id))} className="rounded-md p-1 text-ze-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-40"><X className="h-4 w-4" /></button></div>)}</div><div className="mt-3 flex flex-wrap gap-1.5"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя студента" className="min-w-0 flex-1 rounded-lg border border-ze-border px-2.5 py-2 text-[12px] outline-none focus:border-ze-primary" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Телефон" className="min-w-0 flex-1 rounded-lg border border-ze-border px-2.5 py-2 text-[12px] outline-none focus:border-ze-primary" /><button type="button" disabled={pending || full} onClick={() => mutate(async () => { const result = await enrollScheduleStudent(slot.id, format, name, phone); if (result.success) { setName(""); setPhone(""); } return result; })} className="inline-flex items-center gap-1.5 rounded-lg bg-ze-primary px-3 py-2 text-[12px] font-bold text-white hover:bg-ze-primary-dark disabled:bg-slate-200 disabled:text-ze-muted">{full ? "Мест нет" : <><Check className="h-3.5 w-3.5" /> Записать</>}</button></div></div>;
}

function EditInput({ label, value, pending, onSave }: { label: string; value: string; pending: boolean; onSave: (value: string) => void }) { const [draft, setDraft] = useState(value); return <label className="text-[11px] font-medium text-ze-muted">{label}<input value={draft} disabled={pending} onChange={(event) => setDraft(event.target.value)} onBlur={() => draft !== value && onSave(draft)} className="mt-1 w-full rounded-lg border border-ze-border px-2.5 py-2 text-[13px] text-ze-ink outline-none focus:border-ze-primary disabled:opacity-50" /></label>; }
function EditNumber({ label, value, pending, onSave }: { label: string; value: number; pending: boolean; onSave: (value: number) => void }) { const [draft, setDraft] = useState(String(value)); return <label className="text-[11px] font-medium text-ze-muted">{label}<input type="number" min="0" value={draft} disabled={pending} onChange={(event) => setDraft(event.target.value)} onBlur={() => { const next = Math.max(0, Number(draft) || 0); if (next !== value) onSave(next); }} className="mt-1 w-full rounded-lg border border-ze-border px-2.5 py-2 text-[13px] text-ze-ink outline-none focus:border-ze-primary disabled:opacity-50" /></label>; }
