"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BedDouble, Check, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import type { CatalogUniversity } from "@/lib/education-catalog";
import { formatTuition, formatMonthlyInstallment, formatUniversityCount } from "@/lib/education-catalog";
import { useCompareList } from "@/lib/hooks/useCompareList";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { addUniversityToClient } from "@/lib/staff-actions";
import type { EducationCountry } from "@/lib/types";

type Sort = "price" | "rating";
type RequirementFilter = "any" | "required" | "not_required";
type AvailabilityFilter = "any" | "yes" | "no";

type CatalogCountry = EducationCountry & { count: number };

export function Catalog({ universities, countries, clientId }: { universities: CatalogUniversity[]; countries: CatalogCountry[]; clientId?: string }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("price");
  const [hsk, setHsk] = useState<RequirementFilter>("any");
  const [ielts, setIelts] = useState<RequirementFilter>("any");
  const [dormitory, setDormitory] = useState<AvailabilityFilter>("any");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const { ids: compareIds, toggle: toggleCompare } = useCompareList();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = universities.filter((university) => {
      const hskRequired = university.source.requirements.some((requirement) => /\bhsk\b/i.test(requirement));
      if (hsk === "required" && !hskRequired) return false;
      if (hsk === "not_required" && hskRequired) return false;
      if (ielts === "required" && !university.ieltsRequired) return false;
      if (ielts === "not_required" && university.ieltsRequired) return false;
      if (dormitory === "yes" && !university.hasDormitory) return false;
      if (dormitory === "no" && university.hasDormitory) return false;
      return !needle || `${university.name} ${university.city} ${university.country} ${university.specialties.join(" ")}`.toLowerCase().includes(needle);
    });
    return [...list].sort(sort === "rating"
      ? (a, b) => (a.rankingNational ?? 999) - (b.rankingNational ?? 999)
      : (a, b) => (a.tuitionFrom ?? Number.MAX_SAFE_INTEGER) - (b.tuitionFrom ?? Number.MAX_SAFE_INTEGER));
  }, [universities, query, hsk, ielts, dormitory, sort]);

  return <div>
    {countries.length > 0 && <section className="pt-8" aria-labelledby="catalog-countries">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Страны</div>
          <h2 id="catalog-countries" className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Выберите направление</h2>
          <p className="mt-2 text-sm leading-6 text-ze-muted">Информация об обучении, городах и университетах каждой страны.</p>
        </div>
        <span className="text-sm font-medium text-slate-500">{countries.length} стран для поступления</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Link
            key={country.id}
            href={country.slug === "china" ? "/education/china" : `/education/country/${country.slug}`}
            aria-label={`Узнать об обучении в стране: ${country.name}`}
            className="group relative isolate flex min-h-52 flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200 bg-slate-900 p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,.18)] sm:min-h-56 sm:p-6"
          >
            {(country.heroImageUrl.startsWith("http") || country.imageUrl.startsWith("http")) && (
              <CoverPhoto src={country.heroImageUrl.startsWith("http") ? country.heroImageUrl : country.imageUrl} alt="" className="absolute inset-0 -z-20 transition duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/75 via-slate-900/45 to-blue-950/75" />
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-3xl shadow-lg backdrop-blur-sm" aria-hidden>
                {country.flag}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 transition group-hover:bg-white group-hover:text-ze-primary">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold tracking-tight">{country.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-white/80">
                <span>{formatUniversityCount(country.count)}</span>
                {country.cities.length > 0 && <>
                  <span aria-hidden className="text-white/50">·</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{country.cities.slice(0, 3).join(", ")}</span>
                </>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>}

    <div className="mt-7 flex flex-col gap-3 rounded-[18px] border border-ze-border bg-white p-2.5 shadow-[0_8px_26px_rgba(15,23,42,.07)] sm:flex-row sm:items-center sm:p-2">
      <label className="flex min-w-0 flex-1 items-center gap-3 px-2"><Search className="h-5 w-5 flex-none text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Университет, город или специальность" className="min-w-0 flex-1 bg-transparent py-3 text-[15px] font-medium outline-none" /></label>
      {query && <button onClick={() => setQuery("")} aria-label="Очистить поиск" className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:flex"><X className="h-4 w-4" /></button>}
      <Link href="/education/quiz" className="rounded-xl bg-ze-primary px-5 py-3.5 text-center text-sm font-bold text-white hover:bg-ze-primary-dark">Подобрать за меня</Link>
    </div>

    <div className="mt-3 grid gap-2 sm:grid-cols-3">
      <QuickSelect label="HSK" value={hsk} onChange={(value) => setHsk(value as RequirementFilter)} options={[["any", "Любой"], ["required", "Требуется"], ["not_required", "Не требуется"]]} />
      <QuickSelect label="IELTS" value={ielts} onChange={(value) => setIelts(value as RequirementFilter)} options={[["any", "Любой"], ["required", "Требуется"], ["not_required", "Не требуется"]]} />
      <QuickSelect label="Общежитие" value={dormitory} onChange={(value) => setDormitory(value as AvailabilityFilter)} options={[["any", "Любое"], ["yes", "Есть"], ["no", "Нет"]]} />
    </div>

    <div className="mt-8 flex flex-wrap items-center justify-between gap-3"><div><div className="text-xl font-extrabold">{filtered.length} {plural(filtered.length)}</div></div><div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 text-xs font-semibold text-slate-400 sm:flex"><SlidersHorizontal className="h-4 w-4" /> Сортировка</span><div className="flex gap-1.5 rounded-xl border border-ze-border bg-[#F4F6FA] p-1">{([ ["price", "Сначала дешевле"], ["rating", "По рейтингу"] ] as const).map(([key, label]) => <button key={key} onClick={() => setSort(key)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${sort === key ? "bg-white text-ze-ink shadow-sm" : "text-ze-muted"}`}>{label}</button>)}</div></div></div>

    {filtered.length > 0 ? <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((university) => <UniversityCard key={university.id} u={university} clientId={clientId} added={addedIds.includes(university.id)} onAdded={() => setAddedIds((ids) => [...ids, university.id])} inCompare={compareIds.includes(university.id)} onToggleCompare={() => toggleCompare(university.id)} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><div className="text-lg font-bold">Университеты не найдены</div><p className="mt-2 text-sm text-slate-500">Попробуйте другой запрос или измените быстрые фильтры.</p><button onClick={() => { setQuery(""); setHsk("any"); setIelts("any"); setDormitory("any"); }} className="mt-4 rounded-xl bg-ze-primary px-5 py-3 text-sm font-bold text-white">Показать все университеты</button></div>}
  </div>;
}

function QuickSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <label className={`flex items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 transition ${value !== "any" ? "border-blue-200 bg-blue-50/60" : "border-ze-border"}`}><span className="text-xs font-bold text-slate-600">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 bg-transparent text-right text-xs font-semibold text-ze-primary outline-none">{options.map(([key, title]) => <option key={key} value={key}>{title}</option>)}</select></label>;
}

function UniversityCard({ u, inCompare, onToggleCompare, clientId, added, onAdded }: { u: CatalogUniversity; inCompare: boolean; onToggleCompare: () => void; clientId?: string; added: boolean; onAdded: () => void }) {
  return <article className="flex flex-col overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_2px_8px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,.1)]"><div className="relative aspect-[16/10]"><CoverPhoto src={u.imageUrl} alt={u.city} label={`фото кампуса — ${u.city}`} /><div className="absolute left-3 top-3 flex gap-1.5"><span className="rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold shadow-sm">{u.flag} {u.country}</span>{u.hasGrant && <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">Грант</span>}</div><button onClick={onToggleCompare} className={`absolute bottom-3 right-3 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm ${inCompare ? "bg-ze-primary text-white" : "bg-white/95 text-slate-700"}`}>{inCompare ? "✓ В сравнении" : "Сравнить"}</button></div><div className="flex flex-1 flex-col p-4"><h3 className="text-lg font-extrabold leading-tight">{u.name}</h3><div className="mt-1.5 text-sm text-ze-muted">{u.city} · {u.programsCount} программ {u.rankingNational ? `· #${u.rankingNational} в стране` : ""}</div><div className={`mt-4 flex items-center justify-between rounded-xl px-3 py-2.5 ${u.hasDormitory ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}><span className="flex items-center gap-2 text-xs font-bold"><BedDouble className="h-4 w-4" /> Общежитие</span><span className="flex items-center gap-1 text-xs font-semibold">{u.hasDormitory && <Check className="h-3.5 w-3.5" />}{u.hasDormitory ? "Есть" : "Нет"}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{[u.languages[0], u.ieltsRequired ? "IELTS нужен" : "Без IELTS"].filter(Boolean).map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{tag}</span>)}</div><div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4"><div><div className="text-lg font-extrabold">{formatTuition(u.tuitionFrom, u.tuitionCurrency)}</div><div className="text-xs text-ze-muted">{formatMonthlyInstallment(u.tuitionFrom, u.tuitionCurrency)}</div></div><div className="text-right text-xs"><div className={u.deadlineSoon ? "font-bold text-red-600" : "font-bold text-slate-600"}>{u.deadlineLabel}</div><div className="mt-1 text-ze-muted">{u.ratingStars > 0 ? `★ ${u.ratingStars.toFixed(1)}` : "Рейтинг не указан"} · {u.reviewsCount} отзывов</div></div></div><Link href={`/education/${u.slug}`} className="mt-4 rounded-xl bg-[#EBF1FE] py-3 text-center text-sm font-bold text-ze-primary transition hover:bg-ze-primary hover:text-white">Подробнее</Link>{clientId && <button disabled={added} onClick={async () => { const result = await addUniversityToClient(clientId, u.id); if (result.success) onAdded(); }} className="mt-2 rounded-xl border border-ze-primary py-2.5 text-sm font-semibold text-ze-primary disabled:border-emerald-300 disabled:bg-emerald-50 disabled:text-emerald-700">{added ? "✓ Добавлен" : "Добавить клиенту"}</button>}</div></article>;
}

function plural(value: number) { const teen = value % 100; const last = value % 10; if (teen > 10 && teen < 20) return "университетов"; if (last === 1) return "университет"; if (last > 1 && last < 5) return "университета"; return "университетов"; }
