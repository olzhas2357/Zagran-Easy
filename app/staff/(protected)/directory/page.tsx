import Link from "next/link";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";

export default async function StaffDirectoryPage() {
  const [universities, countries] = await Promise.all([fetchAllUniversities(), fetchEducationCountries()]);
  const countryById = new Map(countries.map((c) => [c.id, c]));

  const grouped = new Map<string, typeof universities>();
  for (const u of universities) {
    const list = grouped.get(u.countryId) || [];
    list.push(u);
    grouped.set(u.countryId, list);
  }

  return (
    <div className="p-5 sm:p-9">
      <h1 className="text-[24px] font-extrabold tracking-tight sm:text-[34px]">Справочник</h1>
      <p className="mt-2 text-[14.5px] text-ze-muted">Университеты и партнёры по странам — быстрый доступ для консультаций.</p>

      <div className="mt-6 flex flex-col gap-5">
        {Array.from(grouped.entries()).map(([countryId, list]) => {
          const country = countryById.get(countryId);
          return (
            <div key={countryId} className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="text-[16px] font-bold">
                {country?.flag} {country?.name}
              </div>
              <div className="mt-3.5 flex flex-col divide-y divide-[#F1F4F9]">
                {list.map((u) => (
                  <div key={u.id} className="grid gap-2 py-3 text-[14px] sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-center">
                    <div className="min-w-0">
                      <Link href={`/education/${u.slug}`} className="font-semibold text-ze-primary hover:underline">{u.name}</Link>
                      <span className="ml-2 text-ze-muted">{u.city}</span>
                      {u.isPartner && <span className="ml-2 rounded-md bg-emerald-50 px-2 py-0.5 text-[12px] font-bold text-emerald-700">Партнёр</span>}
                      {u.address && <div className="mt-1 truncate text-[12px] text-ze-muted">{u.address}</div>}
                    </div>
                    <div><div className="font-semibold">${u.tuitionFrom.toLocaleString()}–${u.tuitionTo.toLocaleString()}</div><div className="text-[12px] text-ze-muted">за год обучения</div></div>
                    <div className="text-[12.5px] text-ze-muted"><div>{u.languages.join(", ") || "Язык не указан"}</div><div>{u.deadlineLabel || "Дедлайн не указан"}</div></div>
                    <div className="flex gap-2">{u.websiteUrl && <a href={u.websiteUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-ze-border px-2.5 py-1.5 text-[12px] font-semibold">Сайт</a>}<Link href={`/education/${u.slug}`} className="rounded-lg bg-[#EBF1FE] px-2.5 py-1.5 text-[12px] font-semibold text-ze-primary">Подробнее</Link></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
