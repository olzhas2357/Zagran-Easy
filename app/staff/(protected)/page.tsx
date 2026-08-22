import Link from "next/link";
import { getCurrentProfile, getLeadsForAdmin, getUniversitiesForAdmin } from "@/lib/staff-data";
import { isVerificationStale } from "@/lib/education-catalog";

export default async function StaffDashboardPage() {
  const [profile, leads, universities] = await Promise.all([getCurrentProfile(), getLeadsForAdmin(), getUniversitiesForAdmin()]);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const inProgress = leads.filter((l) => l.status === "in_progress").length;
  const staleUniversities = universities.filter((u) => isVerificationStale(u.lastVerifiedAt)).length;

  return (
    <div className="p-6 sm:p-9">
      <h1 className="text-[25px] font-extrabold tracking-tight">Здравствуйте, {profile?.fullName || "коллега"}</h1>
      <p className="mt-2 text-[14px] text-ze-muted">Сводка по заявкам и базе университетов.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Новые заявки" value={newLeads} color="#1A56DB" />
        <StatCard label="В работе" value={inProgress} color="#0F172A" />
        <StatCard label="Вузов в базе" value={universities.length} color="#0F172A" />
        <StatCard label="Требуют проверки" value={staleUniversities} color="#B45309" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ShortcutCard href="/staff/leads" title="Заявки студентов" desc="Новые лиды из квиза и форм, статусы, заметки" />
        <ShortcutCard href="/staff/universities" title="База университетов" desc="Цены, дедлайны, презентации, актуальность" />
        <ShortcutCard href="/staff/calculator" title="Калькулятор" desc="Расчёт стоимости услуг для клиента" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[14px] border border-ze-border bg-white p-4">
      <div className="text-[12px] font-semibold text-ze-muted">{label}</div>
      <div className="mt-1.5 text-[24px] font-extrabold tracking-tight" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function ShortcutCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="rounded-[14px] border border-ze-border bg-white p-4.5 transition-colors hover:border-ze-primary">
      <div className="text-[15px] font-bold">{title}</div>
      <div className="mt-1.5 text-[13px] leading-snug text-ze-muted">{desc}</div>
    </Link>
  );
}
