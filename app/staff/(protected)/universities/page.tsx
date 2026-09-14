import Link from "next/link";
import { Plus, Landmark, CheckCircle2, AlertTriangle, FileWarning, FileUp } from "lucide-react";
import { getUniversitiesForAdmin } from "@/lib/staff-data";
import { UniversitiesBoard } from "@/components/staff/UniversitiesBoard";
import { isVerificationStale } from "@/lib/education-catalog";
import { fetchEducationCountries } from "@/lib/data";

export default async function StaffUniversitiesPage() {
  const [universities, countries] = await Promise.all([getUniversitiesForAdmin(), fetchEducationCountries()]);
  const staleCount = universities.filter((u) => isVerificationStale(u.lastVerifiedAt)).length;
  const noPresentation = universities.filter((u) => !u.presentationUrl).length;
  const active = universities.filter((u) => u.isActive).length;

  return (
    <div className="p-5 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight sm:text-[34px]">База университетов</h1>
          <p className="mt-2 text-[14.5px] text-ze-muted">Один источник правды: карточка, цены и презентация меняются здесь и сразу на сайте.</p>
        </div>
        <div className="flex flex-wrap gap-2"><Link href="/admin/universities/import" className="flex items-center gap-2 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[14px] font-semibold text-ze-ink"><FileUp className="h-4 w-4" />Импорт CSV/XLSX</Link><Link
          href="/admin/universities/new"
          className="flex items-center gap-2 rounded-xl bg-ze-accent px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-accent-dark"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2} />
          Добавить университет
        </Link></div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Stat label="Университетов в базе" Icon={Landmark} value={universities.length} color="blue" />
        <Stat label="Опубликовано" Icon={CheckCircle2} value={active} color="emerald" />
        <Stat label="Требуют проверки" Icon={AlertTriangle} value={staleCount} color="amber" />
        <Stat label="Без презентации" Icon={FileWarning} value={noPresentation} color="red" />
      </div>

      <UniversitiesBoard universities={universities} countries={countries} />

      {staleCount > 0 && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4.5 py-3.5 text-[13.5px] text-amber-800">
          <AlertTriangle className="h-5 w-5 flex-none text-amber-600" strokeWidth={1.75} />
          <div>
            У {staleCount} {staleCount === 1 ? "университета" : "университетов"} данные не проверялись больше 90 дней.
            До проверки карточка помечается «требует уточнения» и не попадает в подборки квиза.
          </div>
        </div>
      )}
    </div>
  );
}

const STAT_COLORS: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
  red: { bg: "bg-red-50", text: "text-red-700" },
};

function Stat({ label, value, Icon, color }: { label: string; value: number; Icon: typeof Landmark; color: string }) {
  const colors = STAT_COLORS[color];
  return (
    <div className="rounded-[20px] border border-ze-border bg-white p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors.bg}`}>
        <Icon className={`h-5 w-5 ${colors.text}`} strokeWidth={1.75} />
      </div>
      <div className="mt-3 text-[24px] font-extrabold tracking-tight text-ze-ink">{value}</div>
      <div className="text-[12.5px] text-ze-muted">{label}</div>
    </div>
  );
}
