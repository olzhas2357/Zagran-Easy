import { getUniversitiesForAdmin } from "@/lib/staff-data";
import { UniversityRow } from "@/components/staff/UniversityRow";
import { isVerificationStale } from "@/lib/education-catalog";

export default async function StaffUniversitiesPage() {
  const universities = await getUniversitiesForAdmin();
  const staleCount = universities.filter((u) => isVerificationStale(u.lastVerifiedAt)).length;
  const noPresentation = universities.filter((u) => !u.presentationUrl).length;
  const active = universities.filter((u) => u.isActive).length;

  return (
    <div className="p-6 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">База университетов</h1>
          <p className="mt-2 text-[14px] text-ze-muted">Один источник правды: карточка, цены и презентация меняются здесь и сразу на сайте.</p>
        </div>
      </div>

      <div className="mt-4.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Университетов в базе" value={universities.length} color="#0F172A" />
        <Stat label="Опубликовано" value={active} color="#1A56DB" />
        <Stat label="Требуют проверки" value={staleCount} color="#B45309" />
        <Stat label="Без презентации" value={noPresentation} color="#DC2626" />
      </div>

      <div className="mt-4.5 overflow-hidden rounded-2xl border border-ze-border bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_140px] gap-3 border-b border-[#EEF1F6] px-4 py-3 text-[11.5px] font-bold uppercase tracking-wide text-ze-muted">
              <div>Университет</div>
              <div>Цена / год</div>
              <div>Дедлайн</div>
              <div>Презентация</div>
              <div>Проверено</div>
              <div />
            </div>
            {universities.map((u) => (
              <UniversityRow key={u.id} university={u} />
            ))}
          </div>
        </div>
      </div>

      {staleCount > 0 && (
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-[13.5px] text-amber-800">
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-amber-500 text-[13px] font-bold text-white">!</span>
          <div>
            У {staleCount} {staleCount === 1 ? "университета" : "университетов"} данные не проверялись больше 90 дней.
            До проверки карточка помечается «требует уточнения» и не попадает в подборки квиза.
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[14px] border border-ze-border bg-white p-4">
      <div className="text-[12px] font-semibold text-ze-muted">{label}</div>
      <div className="mt-1.5 text-[24px] font-extrabold tracking-tight" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
