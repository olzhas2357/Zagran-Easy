"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, CalendarCheck2, CheckCircle2, ChevronLeft, ChevronRight,
  Clock3, MapPin, Monitor, X,
} from "lucide-react";
import type { ScheduleFormat, ScheduleLanguage, ScheduleSlot } from "@/lib/schedule-data";
import { enrollMyScheduleSlot } from "@/lib/schedule-actions";

const LANGUAGE: Record<ScheduleLanguage, { label: string; style: string }> = {
  english: { label: "Английский", style: "bg-blue-50 text-blue-700" },
  chinese: { label: "Китайский", style: "bg-red-50 text-red-700" },
};
function parseDate(value: string) { return new Date(`${value}T12:00:00`); }
function isoDate(value: Date) { return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`; }
function addDays(value: string, amount: number) { const date = parseDate(value); date.setDate(date.getDate() + amount); return isoDate(date); }
function startOfWeek(value: string) { const date = parseDate(value); const day = date.getDay() || 7; date.setDate(date.getDate() - day + 1); return isoDate(date); }
function today() { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Almaty" }).format(new Date()); }
function fullDate(value: string) { return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(parseDate(value)); }

export function StudentScheduleBooking({ slots }: { slots: ScheduleSlot[] }) {
  const router = useRouter();
  const firstDate = slots.find((slot) => slot.lesson_date >= today())?.lesson_date || today();
  const [weekStart, setWeekStart] = useState(startOfWeek(firstDate));
  const [language, setLanguage] = useState<ScheduleLanguage | "all">("all");
  const [format, setFormat] = useState<ScheduleFormat | "all">("all");
  const [confirming, setConfirming] = useState<ScheduleSlot | null>(null);
  const [confirmed, setConfirmed] = useState<ScheduleSlot | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const weekEnd = addDays(weekStart, 6);
  const shown = useMemo(() => slots.filter((slot) =>
    slot.lesson_date >= weekStart && slot.lesson_date <= weekEnd
    && (language === "all" || slot.language === language)
    && (format === "all" || slot.format === format)
  ), [slots, weekStart, weekEnd, language, format]);
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  function enroll(slot: ScheduleSlot) {
    setError("");
    startTransition(async () => {
      const response = await enrollMyScheduleSlot(slot.id);
      if (!response.success) setError(response.error || "Не удалось записаться");
      else { setConfirming(null); setConfirmed(slot); router.refresh(); }
    });
  }

  return <div className="min-h-[calc(100vh-62px)] bg-ze-surface">
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-10 sm:py-11">
      <div className="flex items-start gap-3"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 text-ze-primary"><CalendarCheck2 className="h-5.5 w-5.5" /></span><div><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Запись на языковые занятия</h1><p className="mt-1.5 text-sm leading-6 text-ze-muted">Выберите английский или китайский, удобное время и формат занятия.</p></div></div>

      {confirmed && <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" /><div><div className="font-extrabold">Вы записаны</div><p className="mt-1 text-sm capitalize">{LANGUAGE[confirmed.language].label} · {fullDate(confirmed.lesson_date)} · {confirmed.time_start}–{confirmed.time_end} · {confirmed.format === "online" ? "онлайн" : "офлайн"}</p></div></div>}
      {error && <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}

      <section className="mt-6 rounded-2xl border border-ze-border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center justify-between gap-2 sm:justify-start"><button type="button" onClick={() => setWeekStart(addDays(weekStart, -7))} className="rounded-lg border border-ze-border p-2"><ChevronLeft className="h-4 w-4" /></button><div className="min-w-[190px] text-center text-sm font-extrabold">{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(parseDate(weekStart))} — {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(parseDate(weekEnd))}</div><button type="button" onClick={() => setWeekStart(addDays(weekStart, 7))} className="rounded-lg border border-ze-border p-2"><ChevronRight className="h-4 w-4" /></button></div><div className="flex flex-wrap gap-2"><SelectFilter value={language} onChange={(value) => setLanguage(value as typeof language)} options={[["all", "Все языки"], ["english", "Английский"], ["chinese", "Китайский"]]} /><SelectFilter value={format} onChange={(value) => setFormat(value as typeof format)} options={[["all", "Все форматы"], ["online", "Онлайн"], ["offline", "Офлайн"]]} /></div></div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center">{days.map((date) => <div key={date} className={`rounded-lg px-1 py-2 ${date === today() ? "bg-blue-50 text-ze-primary" : "bg-slate-50"}`}><div className="text-[9px] font-bold uppercase text-ze-muted sm:text-[11px]">{new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(parseDate(date)).replace(".", "")}</div><div className="mt-1 text-sm font-extrabold sm:text-base">{parseDate(date).getDate()}</div></div>)}</div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shown.map((slot) => <article key={slot.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${slot.is_enrolled ? "border-emerald-300" : "border-ze-border"}`}><div className="flex items-start justify-between gap-3"><span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${LANGUAGE[slot.language].style}`}>{LANGUAGE[slot.language].label}</span>{slot.is_enrolled && <span className="flex items-center gap-1 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Вы записаны</span>}</div><div className="mt-4 text-sm font-bold capitalize text-slate-700">{fullDate(slot.lesson_date)}</div><div className="mt-2 flex items-center gap-2 text-xl font-extrabold"><Clock3 className="h-5 w-5 text-ze-primary" />{slot.time_start}–{slot.time_end}</div><div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm"><span className="flex items-center gap-2 font-semibold">{slot.format === "online" ? <Monitor className="h-4 w-4 text-violet-600" /> : <MapPin className="h-4 w-4 text-emerald-600" />}{slot.format === "online" ? "Онлайн" : "Офлайн"}</span><span className={`font-bold ${slot.free_places ? "text-emerald-700" : "text-red-600"}`}>{slot.free_places ? `${slot.free_places} мест` : "Мест нет"}</span></div><button type="button" disabled={slot.is_enrolled || slot.free_places === 0} onClick={() => { setConfirmed(null); setError(""); setConfirming(slot); }} className="mt-4 w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:bg-slate-100 disabled:text-ze-muted">{slot.is_enrolled ? "Вы уже записаны" : slot.free_places === 0 ? "Свободных мест нет" : "Выбрать занятие"}</button></article>)}{shown.length === 0 && <div className="rounded-2xl border border-dashed border-ze-border bg-white p-12 text-center text-sm text-ze-muted md:col-span-2 xl:col-span-3">На этой неделе подходящих занятий нет. Перейдите на следующую неделю или измените фильтры.</div>}</div>
    </div>

    {confirming && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"><div className="w-full max-w-md rounded-3xl bg-white p-6"><div className="flex items-start justify-between gap-3"><div><div className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${LANGUAGE[confirming.language].style}`}>{LANGUAGE[confirming.language].label}</div><h2 className="mt-3 text-xl font-extrabold">Подтвердить запись?</h2></div><button type="button" onClick={() => setConfirming(null)}><X className="h-5 w-5" /></button></div><div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm"><div className="capitalize"><b>Дата:</b> {fullDate(confirming.lesson_date)}</div><div><b>Время:</b> {confirming.time_start}–{confirming.time_end}</div><div><b>Формат:</b> {confirming.format === "online" ? "Онлайн" : "Офлайн"}</div><div><b>Свободно:</b> {confirming.free_places} из {confirming.capacity}</div></div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setConfirming(null)} className="rounded-xl border border-ze-border py-3 text-sm font-bold text-slate-700">Отмена</button><button type="button" disabled={pending} onClick={() => enroll(confirming)} className="rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Записываем…" : "Подтвердить"}</button></div></div></div>}
  </div>;
}

function SelectFilter({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: [string, string][] }) { return <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-ze-border bg-white px-3 py-2.5 text-sm font-semibold text-slate-700">{options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>; }
