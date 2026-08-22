import { getUniversitiesForAdmin } from "@/lib/staff-data";
import { fetchEducationCountries } from "@/lib/data";

export default async function StaffDirectoryPage() {
  const [universities, countries] = await Promise.all([getUniversitiesForAdmin(), fetchEducationCountries()]);
  const countryById = new Map(countries.map((c) => [c.id, c]));

  const grouped = new Map<string, typeof universities>();
  for (const u of universities) {
    const list = grouped.get(u.countryId) || [];
    list.push(u);
    grouped.set(u.countryId, list);
  }

  return (
    <div className="p-6 sm:p-9">
      <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Справочник</h1>
      <p className="mt-2 text-[14px] text-ze-muted">Университеты и партнёры по странам — быстрый доступ для консультаций.</p>

      <div className="mt-5 flex flex-col gap-5">
        {Array.from(grouped.entries()).map(([countryId, list]) => {
          const country = countryById.get(countryId);
          return (
            <div key={countryId} className="rounded-2xl border border-ze-border bg-white p-4.5">
              <div className="text-[15px] font-bold">
                {country?.flag} {country?.name}
              </div>
              <div className="mt-3 flex flex-col divide-y divide-[#F1F4F9]">
                {list.map((u) => (
                  <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[13.5px]">
                    <div>
                      <span className="font-semibold">{u.name}</span>
                      <span className="ml-2 text-ze-muted">{u.city}</span>
                      {u.isPartner && <span className="ml-2 rounded-md bg-emerald-50 px-2 py-0.5 text-[11.5px] font-bold text-emerald-700">Партнёр</span>}
                    </div>
                    <div className="text-ze-muted">{u.requirements.join(", ")}</div>
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
