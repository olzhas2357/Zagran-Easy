import { CalendarDays } from "lucide-react";
import { getParentSchedule } from "@/lib/parent-data";
import { ParentEmptyState, ParentPage } from "@/components/parent/ParentPage";

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Asia/Almaty", day: "numeric", month: "long", year: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Asia/Almaty", hour: "2-digit", minute: "2-digit",
});
const statuses: Record<string, { label: string; style: string }> = {
  scheduled: { label: "Запланировано", style: "bg-blue-50 text-blue-700" },
  completed: { label: "Проведено", style: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Отменено", style: "bg-slate-100 text-slate-600" },
  in_progress: { label: "Идёт урок", style: "bg-amber-50 text-amber-800" },
};

export default async function ParentsSchedulePage() {
  const result = await getParentSchedule();
  return <ParentPage title="Расписание" description="Время и статус занятий ребёнка. Время указано по Алматы.">
    {result.error ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Не удалось загрузить расписание: {result.error}</p>
      : result.data?.length ? <div className="space-y-6">{result.data.map((child) => <section key={child.student_id} className="rounded-2xl border border-ze-border bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-bold">{child.student_name}</h2>
        {child.lessons.length ? <ul className="divide-y divide-ze-border">{child.lessons.map((lesson) => {
          const start = new Date(lesson.starts_at);
          const end = new Date(lesson.ends_at);
          const startDate = dateFormat.format(start);
          const endDate = dateFormat.format(end);
          const status = statuses[lesson.status] ?? { label: "Статус не указан", style: "bg-slate-100 text-slate-600" };
          return <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div><div className="text-sm text-ze-muted">{startDate}</div>
              <div className="mt-1 font-bold"><time dateTime={lesson.starts_at}>{timeFormat.format(start)}</time>–<time dateTime={lesson.ends_at}>{startDate !== endDate ? `${endDate}, ` : ""}{timeFormat.format(end)}</time></div>
            </div>
            <span className={`rounded-lg px-3 py-1.5 text-xs font-bold ${status.style}`}>{status.label}</span>
          </li>;
        })}</ul> : <p className="py-4 text-sm text-ze-muted">Занятия пока не назначены.</p>}
      </section>)}</div>
      : <ParentEmptyState icon={CalendarDays} title="Пока нет подключённых профилей" text="Обратитесь к менеджеру ZagranEasy, чтобы связать профиль ребёнка с вашим кабинетом." />}
  </ParentPage>;
}
