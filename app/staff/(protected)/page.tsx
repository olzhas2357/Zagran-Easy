import Link from "next/link";
import { ClipboardList, Loader2, Landmark, AlertTriangle, ArrowRight, Calculator, CalendarDays, BookOpen, ListTodo } from "lucide-react";
import { getCurrentProfile, getLeadsForAdmin } from "@/lib/staff-data";
import { fetchAllUniversities } from "@/lib/data";
import { isVerificationStale } from "@/lib/education-catalog";

export default async function StaffDashboardPage() {
  const [profile, leads, universities] = await Promise.all([getCurrentProfile(), getLeadsForAdmin(), fetchAllUniversities()]);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const inProgress = leads.filter((l) => l.status === "in_progress").length;
  const staleUniversities = universities.filter((u) => isVerificationStale(u.lastVerifiedAt)).length;

  return (
    <div className="p-5 sm:p-9">
      <h1 className="text-[24px] font-extrabold tracking-tight sm:text-[28px]">Здравствуйте, {profile?.fullName || "коллега"}</h1>
      <p className="mt-1.5 text-[14.5px] text-ze-muted">Сводка по заявкам и базе университетов.</p>

      <div className="mt-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <StatCard label="Новые заявки" value={newLeads} Icon={ClipboardList} color="blue" />
        <StatCard label="В работе" value={inProgress} Icon={Loader2} color="violet" />
        <StatCard label="Вузов в базе" value={universities.length} Icon={Landmark} color="emerald" />
        <StatCard label="Требуют проверки" value={staleUniversities} Icon={AlertTriangle} color="amber" />
      </div>

      <h2 className="mt-9 mb-3 text-[17px] font-bold text-ze-ink">Быстрые действия</h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <ShortcutCard href="/staff/leads" Icon={ClipboardList} title="Заявки студентов" desc="Новые лиды из квиза и форм, статусы, заметки" color="blue" />
        <ShortcutCard href="/staff/directory" Icon={Landmark} title="Справочник университетов" desc="Цены, требования и дедлайны для консультаций" color="emerald" />
        <ShortcutCard href="/staff/schedule" Icon={CalendarDays} title="Расписание" desc="Слоты занятий, места и запись студентов" color="amber" />
      </div>
      <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <ShortcutCard href="/staff/tasks" Icon={ListTodo} title="Задачи менеджера" desc="Список задач и уведомления" color="violet" />
        <ShortcutCard href="/staff/knowledge" Icon={BookOpen} title="База знаний" desc="Статьи и инструкции для менеджеров" color="blue" />
      </div>

    </div>
  );
}

const STAT_COLORS: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
};

function StatCard({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: number;
  Icon: typeof ClipboardList;
  color: string;
}) {
  const colors = STAT_COLORS[color];
  return (
    <div className="rounded-[20px] border border-ze-border bg-white p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors.bg}`}>
        <Icon className={`h-5 w-5 ${colors.text}`} strokeWidth={1.75} />
      </div>
      <div className="mt-3 text-[24px] font-extrabold tracking-tight text-ze-ink">{value}</div>
      <div className="text-[12.5px] text-ze-muted">{label}</div>
    </div>
  );
}

function ShortcutCard({
  href,
  Icon,
  title,
  desc,
  color,
}: {
  href: string;
  Icon: typeof BookOpen;
  title: string;
  desc: string;
  color: string;
}) {
  const colors = STAT_COLORS[color];
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors.bg}`}>
          <Icon className={`h-5.5 w-5.5 ${colors.text}`} strokeWidth={1.75} />
        </div>
        <ArrowRight className="h-4 w-4 text-ze-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ze-primary" strokeWidth={2} />
      </div>
      <div>
        <div className="text-[16px] font-bold text-ze-ink">{title}</div>
        <div className="mt-1 text-[13px] leading-relaxed text-ze-muted">{desc}</div>
      </div>
    </Link>
  );
}
