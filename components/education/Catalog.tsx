"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CatalogUniversity } from "@/lib/education-catalog";
import { formatTuition, formatMonthlyInstallment } from "@/lib/education-catalog";
import { useCompareList } from "@/lib/hooks/useCompareList";
import { CoverPhoto } from "@/components/ui/CoverPhoto";

type Sort = "price" | "rating";

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "ru"));
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export function Catalog({ universities }: { universities: CatalogUniversity[] }) {
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState(9000);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [noIelts, setNoIelts] = useState(false);
  const [grantOnly, setGrantOnly] = useState(false);
  const [dormOnly, setDormOnly] = useState(false);
  const [partnerOnly, setPartnerOnly] = useState(false);
  const [deadlineSoonOnly, setDeadlineSoonOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("price");

  const { ids: compareIds, toggle: toggleCompare } = useCompareList();

  const countryOptions = useMemo(() => uniqueSorted(universities.map((u) => u.country)), [universities]);
  const cityOptions = useMemo(() => uniqueSorted(universities.map((u) => u.city)), [universities]);
  const specialtyOptions = useMemo(() => uniqueSorted(universities.flatMap((u) => u.specialties)), [universities]);
  const languageOptions = useMemo(() => uniqueSorted(universities.flatMap((u) => u.languages)), [universities]);

  function toggleFrom(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearAll() {
    setQuery("");
    setPrice(9000);
    setCountries([]);
    setCities([]);
    setSpecialties([]);
    setLanguages([]);
    setNoIelts(false);
    setGrantOnly(false);
    setDormOnly(false);
    setPartnerOnly(false);
    setDeadlineSoonOnly(false);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = universities.filter((u) => {
      if (q && !(u.name + " " + u.city + " " + u.specialties.join(" ")).toLowerCase().includes(q)) return false;
      if (countries.length && !countries.includes(u.country)) return false;
      if (cities.length && !cities.includes(u.city)) return false;
      if (specialties.length && !u.specialties.some((f) => specialties.includes(f))) return false;
      if (languages.length && !u.languages.some((l) => languages.includes(l))) return false;
      if (u.tuitionFrom > price) return false;
      if (noIelts && u.ieltsRequired) return false;
      if (grantOnly && !u.hasGrant) return false;
      if (dormOnly && !u.hasDormitory) return false;
      if (partnerOnly && !u.isPartner) return false;
      if (deadlineSoonOnly && !u.deadlineSoon) return false;
      return true;
    });
    if (sort === "rating") list = [...list].sort((a, b) => (a.rankingNational ?? 999) - (b.rankingNational ?? 999));
    else list = [...list].sort((a, b) => a.tuitionFrom - b.tuitionFrom);
    return list;
  }, [universities, query, countries, cities, specialties, languages, price, noIelts, grantOnly, dormOnly, partnerOnly, deadlineSoonOnly, sort]);

  const resultLabel = `${filtered.length} ${plural(filtered.length)}`;

  return (
    <div>
      {/* Поиск */}
      <div className="mt-6.5 flex flex-col gap-2.5 rounded-[18px] border border-ze-border bg-white p-2.5 shadow-[0_8px_26px_rgba(15,23,42,0.07)] sm:flex-row sm:items-center sm:p-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 px-1">
          <span className="text-[16px] opacity-50">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Университет, город или специальность"
            className="min-w-0 flex-1 bg-transparent py-3 text-[15px] font-medium text-ze-ink outline-none"
          />
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={clearAll}
            className="flex-1 rounded-xl border border-ze-border bg-[#F4F6FA] px-4 py-3.5 text-[14px] font-semibold text-slate-600 hover:text-ze-ink sm:flex-none"
          >
            Сбросить
          </button>
          <Link
            href="/education/quiz"
            className="flex-1 rounded-xl bg-ze-accent px-5 py-3.5 text-center text-[14.5px] font-semibold text-white hover:bg-ze-accent-dark sm:flex-none"
          >
            Подобрать за меня
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <Chip label="Без IELTS" active={noIelts} onClick={() => setNoIelts((v) => !v)} />
        <Chip label="С грантом" active={grantOnly} onClick={() => setGrantOnly((v) => !v)} />
        <Chip label="До $3 000" active={price <= 3000} onClick={() => setPrice((p) => (p <= 3000 ? 9000 : 3000))} />
        <Chip label="Дедлайн скоро" active={deadlineSoonOnly} onClick={() => setDeadlineSoonOnly((v) => !v)} />
        <Chip label="Общежитие" active={dormOnly} onClick={() => setDormOnly((v) => !v)} />
      </div>

      <div className="mt-7 flex flex-col items-start gap-6 sm:flex-row">
        {/* Фильтры */}
        <aside className="w-full flex-none sm:sticky sm:top-[90px] sm:w-[272px]">
          <div className="overflow-hidden rounded-2xl border border-ze-border bg-white">
            <div className="flex items-center justify-between border-b border-ze-border px-4 py-3.5">
              <div className="text-[14.5px] font-bold">Фильтры</div>
              <button onClick={clearAll} className="text-[12.5px] font-semibold text-ze-primary">
                Очистить
              </button>
            </div>
            <div className="flex flex-col gap-5 p-4">
              <FilterGroup label="Страна">
                {countryOptions.map((c) => (
                  <Chip key={c} label={c} active={countries.includes(c)} onClick={() => toggleFrom(countries, setCountries, c)} />
                ))}
              </FilterGroup>
              <FilterGroup label="Город">
                {cityOptions.map((c) => (
                  <Chip key={c} label={c} active={cities.includes(c)} onClick={() => toggleFrom(cities, setCities, c)} />
                ))}
              </FilterGroup>
              <FilterGroup label="Специальность">
                {specialtyOptions.map((f) => (
                  <Chip key={f} label={f} active={specialties.includes(f)} onClick={() => toggleFrom(specialties, setSpecialties, f)} />
                ))}
              </FilterGroup>
              <div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[12px] font-bold uppercase tracking-wide text-ze-muted">Цена за год</div>
                  <div className="text-[13px] font-bold text-ze-primary">до {price >= 9000 ? "$9 000+" : `$${price.toLocaleString("ru-RU")}`}</div>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={9000}
                  step={500}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-3 w-full accent-[#1A56DB]"
                />
                <div className="mt-0.5 flex justify-between text-[11.5px] text-slate-400">
                  <span>$1 000</span>
                  <span>$9 000+</span>
                </div>
              </div>
              <FilterGroup label="Язык обучения">
                {languageOptions.map((l) => (
                  <Chip key={l} label={l} active={languages.includes(l)} onClick={() => toggleFrom(languages, setLanguages, l)} />
                ))}
              </FilterGroup>
              <div className="flex flex-col gap-0.5 border-t border-ze-border pt-3.5">
                <ToggleRow label="Есть грант" checked={grantOnly} onChange={() => setGrantOnly((v) => !v)} />
                <ToggleRow label="Есть общежитие" checked={dormOnly} onChange={() => setDormOnly((v) => !v)} />
                <ToggleRow label="Официальный партнёр" checked={partnerOnly} onChange={() => setPartnerOnly((v) => !v)} />
              </div>
            </div>
          </div>

          <div className="mt-3.5 rounded-2xl border border-[#DFE8FA] bg-[#F5F8FE] p-4">
            <div className="text-[14px] font-bold">Не уверены в выборе?</div>
            <div className="mt-1.5 text-[13px] leading-snug text-ze-muted">
              Менеджер разберёт ваш аттестат и подберёт 3 варианта с реальным шансом.
            </div>
            <Link
              href="/education/quiz"
              className="mt-3 block w-full rounded-[11px] bg-ze-primary py-3 text-center text-[14px] font-semibold text-white hover:bg-ze-primary-dark"
            >
              Пройти подбор
            </Link>
          </div>
        </aside>

        {/* Результаты */}
        <div className="min-w-0 w-full flex-1">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[16px] font-bold tracking-tight sm:text-[20px]">{resultLabel}</div>
            <div className="flex gap-1.5 rounded-[11px] border border-ze-border bg-[#F4F6FA] p-0.5">
              {(
                [
                  ["price", "По цене"],
                  ["rating", "По рейтингу"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    sort === key ? "bg-white text-ze-ink shadow-[0_1px_2px_rgba(15,23,42,0.12)]" : "text-ze-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((u) => (
                <UniversityCard key={u.id} u={u} inCompare={compareIds.includes(u.id)} onToggleCompare={() => toggleCompare(u.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D6DEEA] px-5 py-11 text-center">
              <div className="text-[17px] font-bold">Под эти фильтры ничего нет</div>
              <div className="mt-2 text-[14px] text-ze-muted">Снимите часть условий или оставьте заявку — подберём вручную.</div>
              <button onClick={clearAll} className="mt-4 rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white">
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-wide text-ze-muted">{label}</div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center justify-between gap-2.5 py-2.5 text-left text-[14px] font-medium text-ze-ink">
      <span>{label}</span>
      <span className={`flex h-[23px] w-10 flex-none items-center rounded-full p-0.5 transition-colors ${checked ? "bg-ze-primary" : "bg-[#DDE3EC]"}`}>
        <span className={`h-[19px] w-[19px] rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[17px]" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

function UniversityCard({
  u,
  inCompare,
  onToggleCompare,
}: {
  u: CatalogUniversity;
  inCompare: boolean;
  onToggleCompare: () => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_30px_rgba(15,23,42,0.1)]">
      <div className="relative aspect-16/10">
        <CoverPhoto src={u.imageUrl} alt={u.city} label={`фото кампуса — ${u.city}`} />
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          <span className="rounded-lg bg-white/94 px-2 py-1 text-[11.5px] font-semibold text-ze-ink">
            {u.flag} {u.country}
          </span>
          {u.hasGrant && (
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[11.5px] font-bold text-emerald-700">Грант</span>
          )}
        </div>
        <button
          onClick={onToggleCompare}
          className={`absolute bottom-2.5 right-2.5 rounded-[9px] px-2.5 py-1.5 text-[11.5px] font-semibold ${
            inCompare ? "bg-ze-primary text-white" : "bg-white/94 text-slate-700"
          }`}
        >
          {inCompare ? "✓ В сравнении" : "Сравнить"}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div>
          <div className="text-[16px] font-bold leading-tight tracking-tight">{u.name}</div>
          <div className="mt-1 text-[12.5px] text-ze-muted">
            {u.city} · {u.programsCount} программ {u.rankingNational ? `· #${u.rankingNational} в стране` : ""}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[u.languages[0], u.hasDormitory ? "Общежитие" : "Без общежития", u.ieltsRequired ? "IELTS нужен" : "Без IELTS"]
            .filter(Boolean)
            .map((tag) => (
              <span key={tag} className="rounded-md bg-[#F4F6FA] px-2 py-1 text-[11.5px] font-medium text-slate-600">
                {tag}
              </span>
            ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2.5 border-t border-[#F1F4F9] pt-2.5">
          <div>
            <div className="text-[17px] font-extrabold tracking-tight">{formatTuition(u.tuitionFrom)}</div>
            <div className="mt-0.5 text-[11.5px] text-ze-muted">{formatMonthlyInstallment(u.tuitionFrom)}</div>
          </div>
          <div className="text-right">
            <div className={`text-[12.5px] font-bold ${u.deadlineSoon ? "text-red-600" : "text-slate-600"}`}>{u.deadlineLabel}</div>
            <div className="mt-1 text-[11.5px] text-ze-muted">
              ★ {u.ratingStars.toFixed(1)} · {u.reviewsCount} отзывов
            </div>
          </div>
        </div>
        <Link
          href={`/education/${u.slug}`}
          className="rounded-[11px] bg-[#EBF1FE] py-2.5 text-center text-[14px] font-semibold text-ze-primary hover:bg-ze-primary hover:text-white"
        >
          Смотреть программу
        </Link>
      </div>
    </div>
  );
}

function plural(n: number): string {
  const t = n % 100;
  const o = n % 10;
  if (t > 10 && t < 20) return "университетов";
  if (o === 1) return "университет";
  if (o > 1 && o < 5) return "университета";
  return "университетов";
}
