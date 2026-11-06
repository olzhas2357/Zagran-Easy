"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3,
  Copy, Edit3, MapPin, Monitor, Plus, Trash2, UserPlus, Users, X,
} from "lucide-react";
import type { ScheduleEnrollment, ScheduleFormat, ScheduleLanguage, ScheduleResources, ScheduleSlot } from "@/lib/schedule-data";
import { trialUnavailableReason } from "@/lib/trial-booking";
import {
  addScheduleGroupStudent, cancelScheduleSession, copyScheduleDay, createScheduleGroup, deleteScheduleSlot, enrollScheduleStudent,
  getScheduleGroup, getScheduleGroupStudents,
  removeScheduleGroupStudent,
  removeScheduleEnrollment, updateScheduleSlot, type ScheduleGroupInput, type ScheduleSlotInput,
  type ScheduleGroupStudent,
  type EditableScheduleRule,
  updateScheduleSession,
  updateScheduleGroupFuture,
  deleteScheduleGroupFuture,
  updateScheduleMeeting,
  validateScheduleGroup,
  type ScheduleConflict,
  createTrialBooking,
  getTrialClients,
  type TrialClient,
} from "@/lib/schedule-actions";

type Filter<T extends string> = T | "all";
type Notice = { type: "ok" | "error"; text: string };
type CalendarView = "day" | "week" | "month";

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
function startOfMonth(value: string) { const date = parseDate(value); date.setDate(1); return isoDate(date); }
function addMonths(value: string, amount: number) { const date = parseDate(value); date.setDate(1); date.setMonth(date.getMonth() + amount); return isoDate(date); }
function today() { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Almaty" }).format(new Date()); }
function shortDay(value: string) { return new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(parseDate(value)).replace(".", ""); }
function fullDate(value: string) { return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(parseDate(value)); }

const TRIAL_STATUS_LABELS = {
  booked: "Запланирован",
  attended: "Проведён",
  enrolled: "Перешёл в группу",
  thinking: "Думает",
  declined: "Отказался",
  no_show: "Не пришёл",
  cancelled: "Отменён",
} as const;

function EnrollmentBadge({ type, status }: { type?: "group" | "trial"; status?: keyof typeof TRIAL_STATUS_LABELS }) {
  if (type === "trial" || status) return <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">Пробный · 45 мин{status ? ` · ${TRIAL_STATUS_LABELS[status]}` : ""}</span>;
  return <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Постоянный</span>;
}

function StudentInfo({ student, index }: { student: ScheduleEnrollment; index?: number }) {
  return <div className="min-w-0">
    <div className="flex flex-wrap items-center gap-1.5">
      <b className="break-words">{index !== undefined ? `${index + 1}. ` : ""}{student.student_name}</b>
      <EnrollmentBadge type={student.enrollment_type} status={student.trial_status} />
    </div>
    <div className="mt-1 text-xs text-ze-muted">Телефон: {student.student_phone?.trim()
      ? <a href={`tel:${student.student_phone.replace(/[^+\d]/g, "")}`} className="break-all underline underline-offset-2">{student.student_phone}</a>
      : "не указан"}</div>
  </div>;
}

export function StaffScheduleBackend({ profile, slots, onChanged, resources = { teachers: [], courses: [], classrooms: [] } }: { profile: { role: "admin" | "manager" | "teacher" }; slots: ScheduleSlot[]; onChanged?: () => Promise<void>; resources?: ScheduleResources }) {
  const router = useRouter();
  const isAdmin = profile.role === "admin";
  const initialDate = slots.find((slot) => slot.lesson_date >= today())?.lesson_date || today();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [weekStart, setWeekStart] = useState(startOfWeek(initialDate));
  const [view, setView] = useState<CalendarView>("week");
  const [language, setLanguage] = useState<Filter<ScheduleLanguage>>("all");
  const [format, setFormat] = useState<Filter<ScheduleFormat>>("all");
  const [teacherId, setTeacherId] = useState("all");
  const [courseId, setCourseId] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<ScheduleSlot | null>(null);
  const [deletingFuture, setDeletingFuture] = useState<ScheduleSlot | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const [details, setDetails] = useState<ScheduleSlot | null>(null);
  const [sessionEditing, setSessionEditing] = useState<ScheduleSlot | null>(null);
  const [managingGroup, setManagingGroup] = useState<ScheduleSlot | null>(null);
  const [meetingEditing, setMeetingEditing] = useState<ScheduleSlot | null>(null);
  const [trialBooking, setTrialBooking] = useState<ScheduleSlot | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const gridStart = startOfWeek(monthStart);
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [selectedDate]);
  const teacherOptions = useMemo(() => Array.from(new Map(slots.filter((slot) => slot.teacher_id).map((slot) => [slot.teacher_id!, slot.teacher_name || "Без имени"])).entries()), [slots]);
  const courseOptions = useMemo(() => Array.from(new Map(slots.filter((slot) => slot.course_id).map((slot) => [slot.course_id!, slot.course_name || slot.language_name])).entries()), [slots]);
  const filtered = useMemo(() => slots.filter((slot) =>
    (language === "all" || slot.language === language)
    && (format === "all" || slot.format === format)
    && (teacherId === "all" || slot.teacher_id === teacherId)
    && (courseId === "all" || slot.course_id === courseId)
    && (status === "all" || (slot.status || "scheduled") === status)
  ), [slots, language, format, teacherId, courseId, status]);
  const selectedSlots = filtered.filter((slot) => slot.lesson_date === selectedDate);

  async function mutate(action: () => Promise<{ success: boolean; error?: string }>, successText: string) {
    setPending(true); setNotice(null);
    try {
      const response = await action();
      if (!response.success) setNotice({ type: "error", text: response.error || "Не удалось сохранить изменения" });
      else {
        setNotice({ type: "ok", text: successText });
        try {
          if (onChanged) await onChanged();
          else router.refresh();
        } catch {
          setNotice({ type: "error", text: `${successText}, но расписание не удалось обновить. Обновите страницу, прежде чем повторять действие.` });
        }
      }
      return response.success;
    } catch {
      setNotice({ type: "error", text: "Не удалось обновить расписание. Обновите страницу и проверьте результат." });
      return false;
    } finally {
      setPending(false);
    }
  }

  function movePeriod(amount: number) {
    const next = view === "month"
      ? addMonths(selectedDate, amount)
      : addDays(selectedDate, amount * (view === "week" ? 7 : 1));
    setSelectedDate(next);
    setWeekStart(startOfWeek(next));
  }

  function goToday() {
    const value = today();
    setSelectedDate(value);
    setWeekStart(startOfWeek(value));
  }

  return <div className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-ze-primary"><CalendarDays className="h-5.5 w-5.5" /></div><div><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[32px]">Расписание</h1><p className="mt-1 text-sm text-ze-muted">Управляйте расписанием преподавателей, онлайн- и офлайн-занятиями.</p></div></div>
      {isAdmin && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setCopyOpen(true)} className="flex items-center gap-2 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-sm font-bold text-slate-700"><Copy className="h-4 w-4" />Копировать день</button><button type="button" onClick={() => setGroupOpen(true)} className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Создать расписание</button></div>}
    </div>

    {notice && <div className={`mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${notice.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.type === "ok" ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" /> : <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />}{notice.text}</div>}

    <section className="mt-6 rounded-2xl border border-ze-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={goToday} className="rounded-lg border border-ze-border px-3 py-2 text-xs font-bold text-slate-700">Сегодня</button><button type="button" onClick={() => movePeriod(-1)} aria-label="Предыдущий период" className="rounded-lg border border-ze-border p-2 text-slate-600"><ChevronLeft className="h-4 w-4" /></button><div className="min-w-[190px] text-center text-sm font-extrabold">{view === "month" ? new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(parseDate(selectedDate)) : view === "day" ? fullDate(selectedDate) : `${new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(parseDate(days[0]))} — ${new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(parseDate(days[6]))}`}</div><button type="button" onClick={() => movePeriod(1)} aria-label="Следующий период" className="rounded-lg border border-ze-border p-2 text-slate-600"><ChevronRight className="h-4 w-4" /></button></div>
        <div className="flex flex-wrap gap-2"><FilterSelect value={teacherId} onChange={setTeacherId} label="Все преподаватели" options={teacherOptions} /><FilterSelect value={courseId} onChange={setCourseId} label="Все курсы" options={courseOptions} /><FilterSelect value={format} onChange={(value) => setFormat(value as Filter<ScheduleFormat>)} label="Все форматы" options={[["online", "Онлайн"], ["offline", "Офлайн"]]} /><FilterSelect value={status} onChange={setStatus} label="Все статусы" options={[["scheduled", "Запланировано"], ["completed", "Завершено"], ["cancelled", "Отменено"]]} /><span className="hidden h-8 w-px bg-ze-border sm:block" /><FilterButton active={language === "all"} onClick={() => setLanguage("all")}>Все языки</FilterButton><FilterButton active={language === "english"} onClick={() => setLanguage("english")}>Английский</FilterButton><FilterButton active={language === "chinese"} onClick={() => setLanguage("chinese")}>Китайский</FilterButton></div>
      </div>
      <div className="mt-4 flex justify-end"><div className="inline-flex rounded-xl bg-slate-100 p-1">{(["day", "week", "month"] as CalendarView[]).map((item) => <button key={item} type="button" onClick={() => setView(item)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${view === item ? "bg-white text-ze-primary shadow-sm" : "text-ze-muted"}`}>{item === "day" ? "День" : item === "week" ? "Неделя" : "Месяц"}</button>)}</div></div>
      {view === "week" && <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">{days.map((date) => { const count = filtered.filter((slot) => slot.lesson_date === date).length; const active = selectedDate === date; return <button key={date} type="button" onClick={() => setSelectedDate(date)} className={`rounded-xl border px-1 py-2.5 text-center transition sm:px-3 ${active ? "border-ze-primary bg-ze-primary text-white shadow-md" : "border-ze-border bg-white hover:border-blue-200"}`}><span className={`block text-[10px] font-bold uppercase sm:text-xs ${active ? "text-white/75" : "text-ze-muted"}`}>{shortDay(date)}</span><span className="mt-1 block text-base font-extrabold sm:text-lg">{parseDate(date).getDate()}</span><span className={`mt-0.5 block text-[9px] sm:text-[10px] ${active ? "text-white/75" : "text-ze-muted"}`}>{count || "—"}</span></button>; })}</div>}
      {view === "day" && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold capitalize text-ze-primary">{fullDate(selectedDate)}</div>}
      {view === "month" && <><div className="mt-4 grid grid-cols-7 text-center text-[10px] font-bold uppercase text-ze-muted">{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((label) => <div key={label} className="py-2">{label}</div>)}</div><div className="grid grid-cols-7 overflow-hidden rounded-xl border border-ze-border">{monthDays.map((date) => { const dateSlots = filtered.filter((slot) => slot.lesson_date === date); const inMonth = parseDate(date).getMonth() === parseDate(selectedDate).getMonth(); const active = date === selectedDate; return <button key={date} type="button" onClick={() => setSelectedDate(date)} className={`min-h-20 border-b border-r border-ze-border p-1.5 text-left sm:min-h-28 ${active ? "bg-blue-50" : "bg-white"} ${inMonth ? "" : "text-slate-300"}`}><span className={`text-xs font-bold ${active ? "text-ze-primary" : ""}`}>{parseDate(date).getDate()}</span><span className="mt-1 block space-y-1">{dateSlots.slice(0, 2).map((slot) => <span key={slot.id} className={`block truncate rounded px-1 py-0.5 text-[8px] font-bold sm:text-[9px] ${slot.status === "cancelled" ? "bg-slate-100 text-slate-500 line-through" : slot.format === "online" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>{slot.time_start} {slot.course_name || LANGUAGE[slot.language].label} · {slot.format === "online" ? "On" : "Off"}</span>)}{dateSlots.length > 2 && <span className="block text-[8px] font-bold text-ze-muted">+ ещё {dateSlots.length - 2}</span>}</span></button>; })}</div></>}
    </section>

    {view === "week" && <WeekTimeGrid days={days} slots={filtered} onOpen={(slot) => setDetails(slot)} />}
    {view === "day" && <DayTimeGrid date={selectedDate} slots={selectedSlots} onOpen={(slot) => setDetails(slot)} />}

    {view === "month" && <><div className="mt-6 flex items-center justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-ze-primary">Выбранный день</div><h2 className="mt-1 text-xl font-extrabold capitalize">{fullDate(selectedDate)}</h2></div><div className="text-sm font-semibold text-ze-muted">{selectedSlots.length} занятий</div></div>
    <div className="mt-4 grid gap-4 xl:grid-cols-2">{selectedSlots.map((slot) => <SlotCard key={slot.id} slot={slot} isAdmin={isAdmin} pending={pending} onDetails={() => setDetails(slot)} onEdit={() => setEditing(slot)} onDelete={() => { if (window.confirm("Удалить этот слот?")) void mutate(() => deleteScheduleSlot(slot.id), "Слот удалён"); }} mutate={mutate} />)}{selectedSlots.length === 0 && <div className="rounded-2xl border border-dashed border-ze-border bg-white p-12 text-center text-sm text-ze-muted xl:col-span-2">На этот день занятий нет.{isAdmin && <button type="button" onClick={() => setGroupOpen(true)} className="mx-auto mt-3 block font-bold text-ze-primary">Создать расписание</button>}</div>}</div></>}

    {editing && <SlotModal slot={editing} initialDate={selectedDate} pending={pending} onClose={() => setEditing(null)} onSubmit={async (input) => { const ok = await mutate(() => updateScheduleSlot(editing.id, input), "Слот обновлён"); if (ok) setEditing(null); }} />}
    {groupOpen && <ScheduleGroupModal resources={resources} pending={pending} onClose={() => setGroupOpen(false)} onSubmit={async (input) => { const ok = await mutate(() => createScheduleGroup(input), "Расписание создано"); if (ok) setGroupOpen(false); }} />}
    {details && <ScheduleDetails canManageTrial={profile.role === "manager" || isAdmin} onBookTrial={() => { setNotice(null); setTrialBooking(details); setDetails(null); }} onDeleteFuture={() => { setDeletingFuture(details); setDetails(null); }} slot={details} canManage={isAdmin} canSetMeeting={(profile.role === "teacher" || isAdmin) && Boolean(details.group_id)} pending={pending} onClose={() => setDetails(null)} onMeeting={() => { setMeetingEditing(details); setDetails(null); }} onManage={() => { setManagingGroup(details); setDetails(null); }} onEdit={() => { setDetails(null); if (details.group_id) setSessionEditing(details); else setEditing(details); }} onCancel={async (reason) => { const ok = await mutate(() => cancelScheduleSession(details.id, reason), "Занятие отменено"); if (ok) setDetails(null); }} />}
    {deletingFuture?.group_id && <DeleteFutureModal slot={deletingFuture} pending={pending} onClose={() => { if (!pending) setDeletingFuture(null); }} onSubmit={async (date) => {
      const ok = await mutate(() => deleteScheduleGroupFuture(deletingFuture.group_id!, date), "Будущие занятия удалены");
      if (ok) setDeletingFuture(null);
    }} />}
    {sessionEditing && <SessionEditModal slot={sessionEditing} pending={pending} onClose={() => setSessionEditing(null)} onSubmitOne={async (date, start, end) => { const ok = await mutate(() => updateScheduleSession(sessionEditing.id, date, start, end), "Занятие обновлено"); if (ok) setSessionEditing(null); }} onSubmitFuture={async (date, rules) => { const ok = await mutate(() => updateScheduleGroupFuture(sessionEditing.group_id!, date, rules), "Будущее расписание обновлено"); if (ok) setSessionEditing(null); }} />}
    {managingGroup?.group_id && <GroupStudentsModal groupId={managingGroup.group_id} title={managingGroup.group_title || managingGroup.language_name} onClose={() => setManagingGroup(null)} />}
    {meetingEditing && <MeetingModal slot={meetingEditing} pending={pending} onClose={() => setMeetingEditing(null)} onSubmit={async (url) => { const ok = await mutate(() => updateScheduleMeeting(meetingEditing.id, url), "Ссылка на встречу сохранена"); if (ok) setMeetingEditing(null); }} />}
    {trialBooking && <TrialBookingModal slot={trialBooking} pending={pending} submitError={notice?.type === "error" ? notice.text : ""} onClose={() => { if (!pending) setTrialBooking(null); }} onSubmit={async (input) => { const ok = await mutate(() => createTrialBooking({ sessionId: trialBooking.id, ...input }), "Клиент записан на пробный урок"); if (ok) setTrialBooking(null); }} />}
    {copyOpen && <CopyDayModal sourceDate={selectedDate} pending={pending} onClose={() => setCopyOpen(false)} onCopy={async (targetDate) => { setPending(true); setNotice(null); const response = await copyScheduleDay(selectedDate, targetDate); if (!response.success) setNotice({ type: "error", text: response.error || "Не удалось скопировать день" }); else { const conflicts = response.data?.conflicts || []; setNotice({ type: conflicts.length ? "error" : "ok", text: `Скопировано слотов: ${response.data?.copied || 0}.${conflicts.length ? ` Пропущено: ${conflicts.length} — ${conflicts.map((item) => `${item.time_start} ${item.reason.toLowerCase()}`).join(", ")}.` : " Записи студентов не копировались."}` }); setCopyOpen(false); router.refresh(); } setPending(false); }} />}
  </div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${active ? "bg-blue-50 text-ze-primary" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>{children}</button>; }

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: [string, string][] }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-xs font-bold text-slate-700"><option value="all">{label}</option>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select>;
}

const GRID_START_HOUR = 8;
const GRID_END_HOUR = 22;
const HOUR_HEIGHT = 64;

function timeMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function WeekTimeGrid({ days, slots, onOpen }: { days: string[]; slots: ScheduleSlot[]; onOpen: (slot: ScheduleSlot) => void }) {
  const hours = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, index) => GRID_START_HOUR + index);
  const height = hours.length * HOUR_HEIGHT;
  return <section className="mt-6 overflow-hidden rounded-2xl border border-ze-border bg-white shadow-sm"><div className="overflow-x-auto"><div className="min-w-[1050px]"><div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-ze-border"><div className="bg-slate-50" />{days.map((date) => <button key={date} type="button" className={`border-l border-ze-border px-2 py-3 text-center ${date === today() ? "bg-blue-50" : "bg-slate-50"}`}><div className="text-[10px] font-bold uppercase text-ze-muted">{shortDay(date)}</div><div className={`mt-1 text-sm font-extrabold ${date === today() ? "text-ze-primary" : ""}`}>{parseDate(date).getDate()}</div></button>)}</div><div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]"><div className="relative bg-slate-50" style={{ height }}>{hours.map((hour, index) => <div key={hour} className="absolute right-2 text-[10px] font-semibold text-ze-muted" style={{ top: index * HOUR_HEIGHT - 7 }}>{String(hour).padStart(2, "0")}:00</div>)}</div>{days.map((date) => <div key={date} className={`relative border-l border-ze-border ${date === today() ? "bg-blue-50/20" : ""}`} style={{ height }}>{hours.map((hour, index) => <div key={hour} className="absolute inset-x-0 border-t border-slate-100" style={{ top: index * HOUR_HEIGHT }} />)}{slots.filter((slot) => slot.lesson_date === date).map((slot) => { const start = timeMinutes(slot.time_start); const end = timeMinutes(slot.time_end); const top = Math.max(0, (start - GRID_START_HOUR * 60) / 60 * HOUR_HEIGHT); const cardHeight = Math.max(42, (end - start) / 60 * HOUR_HEIGHT); const cancelled = slot.status === "cancelled"; return <button key={slot.id} type="button" onClick={() => onOpen(slot)} className={`absolute inset-x-1 z-10 overflow-hidden rounded-lg border p-2 text-left shadow-sm transition hover:z-20 hover:shadow-md ${cancelled ? "border-slate-200 bg-slate-100 text-slate-500" : slot.format === "online" ? "border-violet-200 bg-violet-50 text-violet-950" : "border-emerald-200 bg-emerald-50 text-emerald-950"}`} style={{ top, height: cardHeight }}><div className="truncate text-[10px] font-extrabold">{slot.time_start}–{slot.time_end}</div><div className="mt-0.5 truncate text-[11px] font-bold">{slot.course_name || LANGUAGE[slot.language].label}</div>{cardHeight >= 62 && <div className="mt-0.5 truncate text-[9px] opacity-70">{slot.teacher_name || (slot.format === "online" ? "Online" : slot.classroom_name || "Offline")}</div>}{cardHeight >= 82 && <div className="mt-1 text-[9px] font-bold">{slot.enrollment_count} / {slot.capacity}</div>}</button>; })}</div>)}</div></div></div></section>;
}

function DayTimeGrid({ date, slots, onOpen }: { date: string; slots: ScheduleSlot[]; onOpen: (slot: ScheduleSlot) => void }) {
  const hours = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, index) => GRID_START_HOUR + index);
  const height = hours.length * HOUR_HEIGHT;
  const positioned = slots.map((slot) => {
    const start = timeMinutes(slot.time_start);
    const end = timeMinutes(slot.time_end);
    const simultaneous = slots.filter((other) => timeMinutes(other.time_start) < end && timeMinutes(other.time_end) > start);
    const ordered = [...simultaneous].sort((a, b) => timeMinutes(a.time_start) - timeMinutes(b.time_start) || a.id.localeCompare(b.id));
    return { slot, lane: ordered.findIndex((item) => item.id === slot.id), lanes: ordered.length, start, end };
  });
  return <section className="mt-6 overflow-hidden rounded-2xl border border-ze-border bg-white shadow-sm">
    <div className="grid grid-cols-[72px_minmax(0,1fr)] border-b border-ze-border bg-slate-50"><div /><div className={`border-l border-ze-border px-4 py-3 ${date === today() ? "bg-blue-50" : ""}`}><div className="text-xs font-bold uppercase text-ze-muted">{shortDay(date)}</div><div className="mt-0.5 text-sm font-extrabold capitalize">{fullDate(date)} · {slots.length} занятий</div></div></div>
    <div className="grid grid-cols-[72px_minmax(0,1fr)]"><div className="relative bg-slate-50" style={{ height }}>{hours.map((hour, index) => <div key={hour} className="absolute right-3 text-[10px] font-semibold text-ze-muted" style={{ top: index * HOUR_HEIGHT - 7 }}>{String(hour).padStart(2, "0")}:00</div>)}</div><div className={`relative border-l border-ze-border ${date === today() ? "bg-blue-50/20" : ""}`} style={{ height }}>{hours.map((hour, index) => <div key={hour} className="absolute inset-x-0 border-t border-slate-100" style={{ top: index * HOUR_HEIGHT }} />)}{positioned.map(({ slot, lane, lanes, start, end }) => { const top = Math.max(0, (start - GRID_START_HOUR * 60) / 60 * HOUR_HEIGHT); const cardHeight = Math.max(44, (end - start) / 60 * HOUR_HEIGHT); const cancelled = slot.status === "cancelled"; const width = 100 / lanes; return <button key={slot.id} type="button" onClick={() => onOpen(slot)} className={`absolute z-10 overflow-hidden rounded-xl border p-3 text-left shadow-sm transition hover:z-20 hover:shadow-md ${cancelled ? "border-slate-200 bg-slate-100 text-slate-500" : slot.format === "online" ? "border-violet-200 bg-violet-50 text-violet-950" : "border-emerald-200 bg-emerald-50 text-emerald-950"}`} style={{ top, height: cardHeight, left: `calc(${lane * width}% + 6px)`, width: `calc(${width}% - 12px)` }}><div className="flex items-center justify-between gap-3"><div className="truncate text-xs font-extrabold">{slot.time_start}–{slot.time_end}</div><div className="shrink-0 text-[10px] font-bold uppercase opacity-70">{slot.format === "online" ? "Online" : slot.classroom_name || "Offline"}</div></div><div className="mt-1 truncate text-sm font-extrabold">{slot.group_title || slot.course_name || LANGUAGE[slot.language].label}</div>{cardHeight >= 76 && <div className="mt-1 truncate text-xs opacity-70">{slot.teacher_name || "Преподаватель не указан"}</div>}{cardHeight >= 98 && <div className="mt-2 text-[11px] font-bold">Студенты: {slot.enrollment_count} / {slot.capacity}</div>}</button>; })}{slots.length === 0 && <div className="absolute inset-x-6 top-8 rounded-xl border border-dashed border-ze-border bg-white p-8 text-center text-sm text-ze-muted">На этот день занятий нет.</div>}</div></div>
  </section>;
}

function SlotCard({ slot, isAdmin, pending, onDetails, onEdit, onDelete, mutate }: { slot: ScheduleSlot; isAdmin: boolean; pending: boolean; onDetails: () => void; onEdit: () => void; onDelete: () => void; mutate: (action: () => Promise<{ success: boolean; error?: string }>, text: string) => Promise<boolean> }) {
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const full = slot.free_places === 0;
  return <article className="rounded-2xl border border-ze-border bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${slot.format === "online" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>{slot.format === "online" ? <Monitor className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}</span><div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${LANGUAGE[slot.language].style}`}>{slot.course_name || LANGUAGE[slot.language].label}</span><span className="text-xs font-bold text-ze-muted">{slot.format === "online" ? "Онлайн" : "Офлайн"}</span>{slot.status === "cancelled" && <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">Отменено</span>}</div><div className="mt-1.5 flex items-center gap-1.5 text-lg font-extrabold"><Clock3 className="h-4 w-4 text-ze-primary" />{slot.time_start}–{slot.time_end}</div>{slot.teacher_name && <div className="mt-1 text-xs font-semibold text-slate-600">{slot.teacher_name}</div>}{slot.classroom_name && <div className="mt-0.5 text-xs text-ze-muted">{slot.classroom_name}</div>}</div></div>{isAdmin && <div className="flex gap-1"><button type="button" onClick={onEdit} className="rounded-lg p-2 text-ze-muted hover:bg-blue-50 hover:text-ze-primary"><Edit3 className="h-4 w-4" /></button><button type="button" onClick={onDelete} className="rounded-lg p-2 text-ze-muted hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>}</div>
    <div className="mt-4"><div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">Записано {slot.enrollment_count} из {slot.capacity}</span><span className={full ? "font-bold text-red-600" : "font-bold text-emerald-700"}>{full ? "Мест нет" : `Свободно ${slot.free_places}`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${full ? "bg-red-500" : "bg-ze-primary"}`} style={{ width: `${Math.min(100, slot.enrollment_count / slot.capacity * 100)}%` }} /></div></div>
    <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={onDetails} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-xs font-bold text-ze-primary">Подробнее</button><button type="button" onClick={() => setStudentsOpen((value) => !value)} className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"><Users className="h-3.5 w-3.5" />{studentsOpen ? "Скрыть список" : "Студенты"}</button>{isAdmin && <button type="button" disabled={full} onClick={() => setFormOpen((value) => !value)} className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-ze-primary disabled:opacity-50"><UserPlus className="h-3.5 w-3.5" />Добавить студента</button>}</div>
    {studentsOpen && <div className="mt-4 rounded-xl bg-slate-50 p-3"><div className="mb-2 text-xs font-extrabold text-slate-700">Список студентов</div>{slot.enrollments.length ? <div className="space-y-1.5">{slot.enrollments.map((student, index) => <div key={student.id} className="flex items-start justify-between gap-2 rounded-lg bg-white px-3 py-2 text-xs"><StudentInfo student={student} index={index} /><button type="button" disabled={pending} onClick={() => void mutate(() => removeScheduleEnrollment(student.id), "Запись студента удалена")} aria-label="Удалить запись" className="text-ze-muted hover:text-red-600"><X className="h-4 w-4" /></button></div>)}</div> : <p className="text-xs text-ze-muted">Пока никто не записан.</p>}</div>}
    {formOpen && <div className="mt-4 grid gap-2 rounded-xl border border-blue-100 bg-blue-50/40 p-3 sm:grid-cols-[1fr_1fr_auto]"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя студента" className="rounded-lg border border-ze-border bg-white px-3 py-2 text-xs" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Телефон" className="rounded-lg border border-ze-border bg-white px-3 py-2 text-xs" /><button type="button" disabled={pending || !name.trim()} onClick={async () => { const ok = await mutate(() => enrollScheduleStudent(slot.id, name, phone), "Студент записан"); if (ok) { setName(""); setPhone(""); setFormOpen(false); } }} className="rounded-lg bg-ze-primary px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Записать</button></div>}
  </article>;
}
function ScheduleDetails({ slot, canManageTrial, onBookTrial, canManage, canSetMeeting, pending, onClose, onMeeting, onManage, onEdit, onCancel, onDeleteFuture }: { slot: ScheduleSlot; canManageTrial: boolean; onBookTrial: () => void; canManage: boolean; canSetMeeting: boolean; pending: boolean; onClose: () => void; onMeeting: () => void; onManage: () => void; onEdit: () => void; onCancel: (reason: string) => Promise<void>; onDeleteFuture: () => void }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const statusLabel = slot.status === "cancelled" ? "Отменено" : slot.status === "completed" ? "Завершено" : "Запланировано";
  const unavailableReason = trialUnavailableReason(slot);
  return <div className="fixed inset-0 z-50 bg-slate-950/35" onMouseDown={onClose}><aside onMouseDown={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><span className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase ${LANGUAGE[slot.language].style}`}>{slot.course_name || LANGUAGE[slot.language].label}</span><h2 className="mt-3 text-2xl font-extrabold">{slot.group_title || slot.language_name}</h2><p className="mt-1 text-sm text-ze-muted">{slot.teacher_name || "Преподаватель пока не указан"}</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-ze-muted hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="mt-6 grid grid-cols-2 gap-3"><DetailValue label="Дата" value={fullDate(slot.lesson_date)} /><DetailValue label="Время" value={`${slot.time_start}–${slot.time_end}`} /><DetailValue label="Формат" value={slot.format === "online" ? "Online" : "Offline"} /><DetailValue label="Статус" value={statusLabel} /><DetailValue label="Вместимость" value={`${slot.enrollment_count} / ${slot.capacity}`} /><DetailValue label="Свободно" value={String(slot.free_places)} />{slot.classroom_name && <DetailValue label="Кабинет" value={slot.classroom_name} />}</div>{slot.meeting_url && <a href={slot.meeting_url} target="_blank" rel="noopener noreferrer" className="mt-4 block rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">Открыть Google Meet / Zoom ↗</a>}{canSetMeeting && slot.status !== "cancelled" && <button type="button" onClick={onMeeting} className="mt-2 w-full rounded-xl border border-emerald-200 py-2.5 text-sm font-bold text-emerald-700">{slot.meeting_url ? "Изменить ссылку встречи" : "Добавить ссылку Google Meet"}</button>}<div className="mt-6"><div className="text-xs font-bold uppercase tracking-wider text-ze-muted">Студенты</div>
      {canManageTrial && <><button type="button" disabled={pending || Boolean(unavailableReason)} aria-describedby={unavailableReason ? "trial-unavailable-reason" : undefined} onClick={onBookTrial} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-not-allowed disabled:opacity-50"><UserPlus className="h-4 w-4 shrink-0" />Записать на пробный урок</button>{unavailableReason && <p id="trial-unavailable-reason" className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{unavailableReason}</p>}</>}
      <div className="mt-3 space-y-2">{slot.enrollments.length ? slot.enrollments.map((student) => <div key={student.id} className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold"><StudentInfo student={student} /></div>) : <div className="rounded-xl border border-dashed border-ze-border p-4 text-sm text-ze-muted">Студенты пока не назначены.</div>}</div>{canManage && slot.group_id && <button type="button" onClick={onManage} className="mt-3 text-sm font-bold text-ze-primary">Управлять составом группы</button>}</div>{canManage && slot.status !== "completed" && <div className="mt-auto space-y-2 pt-8"><button type="button" onClick={onEdit} className="w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white">Изменить занятие</button>{slot.group_id && slot.status !== "cancelled" && (!cancelOpen ? <button type="button" onClick={() => setCancelOpen(true)} className="w-full rounded-xl border border-red-200 py-3 text-sm font-bold text-red-600">Отменить занятие</button> : <div className="rounded-xl bg-red-50 p-3"><textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Причина отмены (необязательно)" className="w-full rounded-lg border border-red-100 bg-white p-2 text-sm" /><div className="mt-2 flex gap-2"><button type="button" onClick={() => setCancelOpen(false)} className="flex-1 rounded-lg bg-white py-2 text-xs font-bold">Назад</button><button type="button" disabled={pending} onClick={() => void onCancel(reason)} className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white disabled:opacity-50">Подтвердить</button></div></div>)}</div>}{canManage && slot.group_id && <button type="button" disabled={pending} onClick={onDeleteFuture} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-bold text-red-600 disabled:opacity-50"><Trash2 className="h-4 w-4" />Удалить будущие занятия</button>}</aside></div>;
}

function TrialBookingModal({ slot, pending, submitError, onClose, onSubmit }: { slot: ScheduleSlot; pending: boolean; submitError: string; onClose: () => void; onSubmit: (input: { clientId?: string; clientName: string; clientPhone?: string; notes?: string }) => Promise<void> }) {
  const [clients, setClients] = useState<TrialClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { let cancelled = false; getTrialClients().then((response) => { if (cancelled) return; if (response.success) setClients(response.data); else setError(response.error); setLoading(false); }).catch(() => { if (!cancelled) { setError("Не удалось загрузить список клиентов. Можно указать клиента вручную."); setLoading(false); } }); return () => { cancelled = true; }; }, []);
  function selectClient(id: string) { setClientId(id); const client = clients.find((item) => item.id === id); if (client) { setName(client.full_name); setPhone(client.phone || ""); } else { setName(""); setPhone(""); } }
  return <Modal title="Записать на пробный урок" onClose={onClose}><div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><b>{slot.group_title || slot.course_name}</b><div className="mt-1">{fullDate(slot.lesson_date)} · Начало в {slot.time_start}</div><div className="mt-1 font-bold">Длительность пробного урока — 45 минут</div><div className="mt-1 text-xs">Запись действует только для этого занятия и не добавляет клиента в постоянную группу.</div></div>{loading ? <div className="py-8 text-center text-sm text-ze-muted">Загрузка клиентов…</div> : <><Field label="Существующий клиент"><select value={clientId} onChange={(event) => selectClient(event.target.value)} className={FIELD_CLASS}><option value="">Указать клиента вручную</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.full_name}{client.phone ? ` · ${client.phone}` : ""}</option>)}</select></Field><Field label="Имя клиента"><input value={name} onChange={(event) => { setName(event.target.value); setClientId(""); }} className={FIELD_CLASS} /></Field><Field label="Телефон"><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7..." className={FIELD_CLASS} /></Field><Field label="Комментарий"><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Уровень языка, пожелания или источник заявки" className={FIELD_CLASS} /></Field>{error && <div role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}{submitError && <div role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{submitError}</div>}<button type="button" disabled={pending || !name.trim() || slot.free_places === 0} onClick={() => void onSubmit({ clientId: clientId || undefined, clientName: name, clientPhone: phone, notes })} className="mt-5 w-full rounded-xl bg-amber-500 py-3 text-sm font-extrabold text-white disabled:opacity-50">{pending ? "Записываем…" : "Подтвердить пробный урок"}</button></>}</Modal>;
}

function MeetingModal({ slot, pending, onClose, onSubmit }: { slot: ScheduleSlot; pending: boolean; onClose: () => void; onSubmit: (url: string) => Promise<void> }) {
  const [url, setUrl] = useState(slot.meeting_url || ""); const valid = /^https:\/\/(meet\.google\.com|zoom\.us)\//.test(url);
  return <Modal title="Ссылка на онлайн-занятие" onClose={onClose}><Field label="Google Meet или Zoom"><input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://meet.google.com/abc-defg-hij" className={FIELD_CLASS} /></Field><p className="mt-3 text-xs leading-5 text-ze-muted">Создайте встречу в Google Meet, скопируйте ссылку и вставьте её сюда. Студенты увидят кнопку подключения в своём уроке.</p><button type="button" disabled={pending || !valid} onClick={() => void onSubmit(url)} className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-40">{pending ? "Сохраняем…" : "Сохранить ссылку"}</button></Modal>;
}

function DeleteFutureModal({ slot, pending, onClose, onSubmit }: { slot: ScheduleSlot; pending: boolean; onClose: () => void; onSubmit: (date: string) => Promise<void> }) {
  const [date, setDate] = useState(slot.lesson_date > today() ? slot.lesson_date : today());
  return <Modal title="Удалить будущие занятия?" onClose={onClose}>
    <p className="text-sm leading-6 text-ze-muted">Группа: <b className="text-ze-ink">{slot.group_title || slot.language_name}</b></p>
    <Field label="Удалить начиная с даты (включительно)"><input type="date" min={today()} value={date} disabled={pending} onChange={(event) => setDate(event.target.value)} className={FIELD_CLASS} /></Field>
    <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-800">Будут безвозвратно удалены ещё не начавшиеся занятия этой группы с выбранной даты, включая отменённые, и записи на их пробные уроки. Прошедшие и завершённые занятия, сама группа и её состав сохранятся.</p>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <button type="button" disabled={pending} onClick={onClose} className="rounded-xl border border-ze-border py-3 text-sm font-bold disabled:opacity-50">Назад</button>
      <button type="button" disabled={pending || !date || date < today()} onClick={() => void onSubmit(date)} className="rounded-xl bg-red-600 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Удаляем…" : "Удалить занятия"}</button>
    </div>
  </Modal>;
}

function SessionEditModal({ slot, pending, onClose, onSubmitOne, onSubmitFuture }: { slot: ScheduleSlot; pending: boolean; onClose: () => void; onSubmitOne: (date: string, start: string, end: string) => Promise<void>; onSubmitFuture: (date: string, rules: EditableScheduleRule[]) => Promise<void> }) {
  const [scope, setScope] = useState<"one" | "future">("one");
  const [date, setDate] = useState(slot.lesson_date); const [start, setStart] = useState(slot.time_start); const [end, setEnd] = useState(slot.time_end);
  const [rules, setRules] = useState<EditableScheduleRule[]>([]); const [loadingRules, setLoadingRules] = useState(Boolean(slot.group_id)); const [error, setError] = useState("");
  useEffect(() => { if (!slot.group_id) return; let cancelled = false; getScheduleGroup(slot.group_id).then((response) => { if (cancelled) return; if (!response.success) setError(response.error); else setRules(response.data.rules.map((rule) => ({ ...rule, time_start: rule.time_start.slice(0, 5), time_end: rule.time_end.slice(0, 5) }))); setLoadingRules(false); }); return () => { cancelled = true; }; }, [slot.group_id]);
  const invalidRules = !rules.length || new Set(rules.map((rule) => rule.weekday)).size !== rules.length || rules.some((rule) => rule.time_end <= rule.time_start);
  return <Modal title="Что изменить?" onClose={onClose}><div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => setScope("one")} className={`rounded-xl border p-4 text-left ${scope === "one" ? "border-ze-primary bg-blue-50" : "border-ze-border"}`}><div className="text-sm font-extrabold">Только это занятие</div><div className="mt-1 text-xs text-ze-muted">Остальные даты не изменятся</div></button><button type="button" onClick={() => setScope("future")} className={`rounded-xl border p-4 text-left ${scope === "future" ? "border-ze-primary bg-blue-50" : "border-ze-border"}`}><div className="text-sm font-extrabold">Это и будущие занятия</div><div className="mt-1 text-xs text-ze-muted">Новые правила действуют с выбранной даты</div></button></div>{scope === "one" ? <><div className="mt-5 grid gap-3 sm:grid-cols-3"><Field label="Дата"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={FIELD_CLASS} /></Field><Field label="Начало"><input type="time" value={start} onChange={(event) => setStart(event.target.value)} className={FIELD_CLASS} /></Field><Field label="Окончание"><input type="time" value={end} onChange={(event) => setEnd(event.target.value)} className={FIELD_CLASS} /></Field></div><p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-800">Изменится только выбранное занятие.</p><button type="button" disabled={pending || !date || end <= start} onClick={() => void onSubmitOne(date, start, end)} className="mt-5 w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Сохраняем…" : "Сохранить"}</button></> : <><Field label="Применить новые правила начиная с"><input type="date" min={slot.lesson_date} value={date} onChange={(event) => setDate(event.target.value)} className={FIELD_CLASS} /></Field>{loadingRules ? <div className="py-8 text-center text-sm text-ze-muted">Загрузка правил…</div> : <div className="mt-4 space-y-2">{rules.map((rule, index) => <div key={index} className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_120px_120px]"><select value={rule.weekday} onChange={(event) => setRules(rules.map((item, itemIndex) => itemIndex === index ? { ...item, weekday: Number(event.target.value) } : item))} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-sm">{WEEKDAYS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><input type="time" value={rule.time_start} onChange={(event) => setRules(rules.map((item, itemIndex) => itemIndex === index ? { ...item, time_start: event.target.value } : item))} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-sm" /><input type="time" value={rule.time_end} onChange={(event) => setRules(rules.map((item, itemIndex) => itemIndex === index ? { ...item, time_end: event.target.value } : item))} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-sm" /></div>)}</div>}{error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}<p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">Будущие старые занятия сохранятся в истории как отменённые. Прошедшие занятия не изменятся.</p><button type="button" disabled={pending || loadingRules || invalidRules || !date} onClick={() => void onSubmitFuture(date, rules)} className="mt-5 w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Перестраиваем…" : "Изменить будущие занятия"}</button></>}</Modal>;
}

function GroupStudentsModal({ groupId, title, onClose }: { groupId: string; title: string; onClose: () => void }) {
  const router = useRouter();
  const [students, setStudents] = useState<ScheduleGroupStudent[]>([]);
  const [capacity, setCapacity] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const response = await getScheduleGroupStudents(groupId);
    if (!response.success) setError(response.error);
    else { setStudents(response.data.students); setCapacity(response.data.capacity); setActiveCount(response.data.active_count); setError(""); }
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    getScheduleGroupStudents(groupId).then((response) => {
      if (cancelled) return;
      if (!response.success) setError(response.error);
      else { setStudents(response.data.students); setCapacity(response.data.capacity); setActiveCount(response.data.active_count); }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [groupId]);

  async function toggle(student: ScheduleGroupStudent) {
    setPendingId(student.student_id); setError("");
    const response = student.status === "active" ? await removeScheduleGroupStudent(groupId, student.student_id) : await addScheduleGroupStudent(groupId, student.student_id);
    if (!response.success) setError(response.error || "Не удалось изменить состав группы");
    else { await load(); router.refresh(); }
    setPendingId("");
  }

  return <Modal title={`Состав группы · ${title}`} onClose={onClose}><div className="flex items-center justify-between rounded-xl bg-blue-50 p-3 text-sm"><span className="font-semibold text-blue-900">Занято мест</span><b className="text-ze-primary">{activeCount} / {capacity}</b></div>{error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}{loading ? <div className="py-10 text-center text-sm text-ze-muted">Загрузка студентов…</div> : students.length ? <div className="mt-4 space-y-2">{students.map((student) => { const active = student.status === "active"; return <div key={student.student_id} className="flex items-center justify-between gap-3 rounded-xl border border-ze-border p-3"><div className="min-w-0"><div className="truncate text-sm font-bold">{student.full_name}</div>{student.phone && <div className="mt-0.5 text-xs text-ze-muted">{student.phone}</div>}</div><button type="button" disabled={pendingId === student.student_id || (!active && activeCount >= capacity)} onClick={() => void toggle(student)} className={`rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-40 ${active ? "bg-red-50 text-red-600" : "bg-blue-50 text-ze-primary"}`}>{pendingId === student.student_id ? "…" : active ? "Исключить" : "Добавить"}</button></div>; })}</div> : <div className="mt-4 rounded-xl border border-dashed border-ze-border p-6 text-center text-sm text-ze-muted">У этого преподавателя пока нет закреплённых студентов. Назначьте преподавателя в админ-панели студента.</div>}<p className="mt-4 text-xs leading-5 text-ze-muted">Здесь отображаются только студенты, которых администратор заранее закрепил за преподавателем этой группы.</p></Modal>;
}

function DetailValue({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-ze-muted">{label}</div><div className="mt-1 text-sm font-extrabold text-slate-800 capitalize">{value}</div></div>;
}

const WEEKDAYS = [[1, "Понедельник"], [2, "Вторник"], [3, "Среда"], [4, "Четверг"], [5, "Пятница"], [6, "Суббота"], [7, "Воскресенье"]] as const;

function countGeneratedLessons(startsOn: string, endsOn: string, weekdays: number[]) {
  if (!startsOn || !endsOn || endsOn < startsOn) return 0;
  let count = 0;
  const cursor = parseDate(startsOn);
  const end = parseDate(endsOn);
  while (cursor <= end) {
    const isoWeekday = cursor.getDay() || 7;
    if (weekdays.includes(isoWeekday)) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

function ScheduleGroupModal({ resources, pending, onClose, onSubmit }: { resources: ScheduleResources; pending: boolean; onClose: () => void; onSubmit: (input: ScheduleGroupInput) => Promise<void> }) {
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [validating, setValidating] = useState(false);
  const [title, setTitle] = useState("");
  const [teacherId, setTeacherId] = useState(resources.teachers[0]?.id || "");
  const [courseId, setCourseId] = useState(resources.courses[0]?.id || "");
  const [format, setFormat] = useState<ScheduleFormat>("online");
  const [classroomId, setClassroomId] = useState(resources.classrooms[0]?.id || "");
  const [capacity, setCapacity] = useState(5);
  const [startsOn, setStartsOn] = useState(today());
  const [endsOn, setEndsOn] = useState(addDays(today(), 90));
  const [rules, setRules] = useState([{ weekday: 1, timeStart: "10:00", timeEnd: "11:30" }]);
  const lessonCount = countGeneratedLessons(startsOn, endsOn, rules.map((rule) => rule.weekday));
  const teacherName = resources.teachers.find((item) => item.id === teacherId)?.name || "—";
  const courseName = resources.courses.find((item) => item.id === courseId)?.name || "—";
  const classroomName = resources.classrooms.find((item) => item.id === classroomId)?.name || "—";

  function validate() {
    if (!title.trim()) return "Укажите название учебной группы";
    if (!teacherId) return "Выберите преподавателя";
    if (!courseId) return "Выберите курс";
    if (format === "offline" && !classroomId) return "Выберите кабинет";
    if (endsOn < startsOn) return "Дата окончания должна быть позже даты начала";
    if (!rules.length) return "Добавьте хотя бы один день занятий";
    if (new Set(rules.map((rule) => rule.weekday)).size !== rules.length) return "Один день недели выбран несколько раз";
    if (rules.some((rule) => rule.timeEnd <= rule.timeStart)) return "Время окончания должно быть позже начала";
    return "";
  }

  async function openPreview() {
    const message = validate();
    setError(message);
    setConflicts([]);
    if (message) return;
    setValidating(true);
    const response = await validateScheduleGroup(input);
    setValidating(false);
    if (!response.success) { setError(response.error); return; }
    if (!response.data.valid) { setConflicts(response.data.conflicts); return; }
    setPreview(true);
  }

  const input: ScheduleGroupInput = { title, teacherId, courseId, format, classroomId, capacity, startsOn, endsOn, rules };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"><div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-ze-primary">{preview ? "Шаг 2 из 2" : "Шаг 1 из 2"}</div><h2 className="mt-1 text-2xl font-extrabold">{preview ? "Проверьте расписание" : "Создать расписание"}</h2></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-ze-muted hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
    {!preview ? <div className="mt-6 space-y-6"><section><h3 className="text-sm font-extrabold">Основная информация</h3><div className="mt-2 grid gap-3 sm:grid-cols-2"><Field label="Название группы"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Chinese A1" className={FIELD_CLASS} /></Field><Field label="Преподаватель"><select value={teacherId} onChange={(event) => setTeacherId(event.target.value)} className={FIELD_CLASS}><option value="">Выберите преподавателя</option>{resources.teachers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Курс"><select value={courseId} onChange={(event) => setCourseId(event.target.value)} className={FIELD_CLASS}><option value="">Выберите курс</option>{resources.courses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Формат"><select value={format} onChange={(event) => { const value = event.target.value as ScheduleFormat; setFormat(value); setCapacity(value === "online" ? 5 : 9); }} className={FIELD_CLASS}><option value="online">Online</option><option value="offline">Offline</option></select></Field>{format === "offline" && <Field label="Кабинет"><select value={classroomId} onChange={(event) => setClassroomId(event.target.value)} className={FIELD_CLASS}><option value="">Выберите кабинет</option>{resources.classrooms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>}<Field label="Количество мест"><input type="number" min={1} max={100} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} className={FIELD_CLASS} /></Field></div></section>
      <section><div className="flex items-center justify-between"><h3 className="text-sm font-extrabold">Дни занятий</h3><button type="button" disabled={rules.length >= 7} onClick={() => setRules([...rules, { weekday: Math.min(7, rules.length + 1), timeStart: "10:00", timeEnd: "11:30" }])} className="text-xs font-bold text-ze-primary disabled:opacity-40">+ Добавить день</button></div><div className="mt-2 space-y-2">{rules.map((rule, index) => <div key={index} className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_120px_120px_auto]"><select value={rule.weekday} onChange={(event) => setRules(rules.map((item, itemIndex) => itemIndex === index ? { ...item, weekday: Number(event.target.value) } : item))} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-sm">{WEEKDAYS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><input type="time" value={rule.timeStart} onChange={(event) => setRules(rules.map((item, itemIndex) => itemIndex === index ? { ...item, timeStart: event.target.value } : item))} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-sm" /><input type="time" value={rule.timeEnd} onChange={(event) => setRules(rules.map((item, itemIndex) => itemIndex === index ? { ...item, timeEnd: event.target.value } : item))} className="rounded-lg border border-ze-border bg-white px-3 py-2 text-sm" /><button type="button" disabled={rules.length === 1} onClick={() => setRules(rules.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-ze-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-30"><X className="h-4 w-4" /></button></div>)}</div></section>
      <section><h3 className="text-sm font-extrabold">Период действия</h3><div className="mt-2 grid gap-3 sm:grid-cols-2"><Field label="Дата начала"><input type="date" value={startsOn} onChange={(event) => setStartsOn(event.target.value)} className={FIELD_CLASS} /></Field><Field label="Дата окончания"><input type="date" value={endsOn} onChange={(event) => setEndsOn(event.target.value)} className={FIELD_CLASS} /></Field></div><div className="mt-3 flex flex-wrap gap-2">{[[30, "1 месяц"], [90, "3 месяца"], [180, "6 месяцев"]].map(([days, label]) => <button key={String(days)} type="button" onClick={() => setEndsOn(addDays(startsOn, Number(days)))} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">{label}</button>)}</div></section>{error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}{conflicts.length > 0 && <div className="rounded-2xl border border-red-200 bg-red-50 p-4"><div className="font-extrabold text-red-800">Найдены конфликты расписания</div><div className="mt-3 space-y-2">{conflicts.map((conflict, index) => <div key={`${conflict.date}-${index}`} className="rounded-xl bg-white p-3 text-sm"><div className="font-bold capitalize">{fullDate(conflict.date)} · {conflict.requested_time_start}–{conflict.requested_time_end}</div><div className="mt-1 text-red-700">{conflict.message}: <b>{conflict.group_title}</b>, {conflict.existing_time_start}–{conflict.existing_time_end}</div></div>)}</div><p className="mt-3 text-xs text-red-700">Измените время, преподавателя или кабинет.</p></div>}<button type="button" disabled={validating} onClick={() => void openPreview()} className="w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{validating ? "Проверяем конфликты…" : "Продолжить"}</button></div> : <div className="mt-6"><div className="rounded-2xl bg-slate-50 p-5"><div className="text-xl font-extrabold">{title}</div><div className="mt-1 text-sm text-ze-muted">{courseName} · {teacherName}</div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold">{format === "online" ? "ONLINE" : "OFFLINE"}</span><span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold">Максимум: {capacity}</span>{format === "offline" && <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold">{classroomName}</span>}</div><div className="mt-5 space-y-2">{rules.map((rule) => <div key={rule.weekday} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm"><b>{WEEKDAYS.find(([value]) => value === rule.weekday)?.[1]}</b><span>{rule.timeStart} — {rule.timeEnd}</span></div>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><DetailValue label="Начало" value={startsOn} /><DetailValue label="Окончание" value={endsOn} /></div><div className="mt-4 rounded-xl bg-blue-50 p-4 text-center"><div className="text-xs font-bold uppercase tracking-wider text-blue-600">Будет создано</div><div className="mt-1 text-2xl font-extrabold text-ze-primary">{lessonCount} занятий</div></div></div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setPreview(false)} className="rounded-xl border border-ze-border py-3 text-sm font-bold">Назад</button><button type="button" disabled={pending} onClick={() => void onSubmit(input)} className="rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Создаём…" : "Создать расписание"}</button></div></div>}
  </div></div>;
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
