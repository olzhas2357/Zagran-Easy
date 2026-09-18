"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BedDouble, Building2, Check, Globe2, Landmark, Search, SlidersHorizontal, X } from "lucide-react";
import type { CatalogUniversity } from "@/lib/education-catalog";
import { formatTuition, formatMonthlyInstallment } from "@/lib/education-catalog";
import { useCompareList } from "@/lib/hooks/useCompareList";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { addUniversityToClient } from "@/lib/staff-actions";

type Sort = "price" | "rating";
type Direction = "turkey" | "china" | "europe";
type RequirementFilter = "any" | "required" | "not_required";
type AvailabilityFilter = "any" | "yes" | "no";

const directions = [
  { id: "turkey", title: "Турция", subtitle: "Стамбул, Анкара и другие города", flag: "🇹🇷", icon: Landmark, tint: "from-red-50 to-white", active: "border-red-300 ring-red-100" },
  { id: "china", title: "Китай", subtitle: "Сильные программы и гранты", flag: "🇨🇳", icon: Building2, tint: "from-amber-50 to-white", active: "border-amber-300 ring-amber-100" },
  { id: "europe", title: "Европа", subtitle: "Университеты европейских стран", flag: "🇪🇺", icon: Globe2, tint: "from-blue-50 to-white", active: "border-blue-300 ring-blue-100" },
] as const;

function belongsTo(direction: Direction, country: string) {
  const normalized = country.toLowerCase();
  if (direction === "turkey") return /турц|turkey|türkiye/.test(normalized);
  if (direction === "china") return /китай|china/.test(normalized);
  return !/турц|turkey|türkiye|китай|china/.test(normalized);
}

export function Catalog({ universities, clientId }: { universities: CatalogUniversity[]; clientId?: string }) {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<Direction | null>(null);
  const [sort, setSort] = useState<Sort>("price");
  const [hsk, setHsk] = useState<RequirementFilter>("any");
  const [ielts, setIelts] = useState<RequirementFilter>("any");
  const [dormitory, setDormitory] = useState<AvailabilityFilter>("any");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const { ids: compareIds, toggle: toggleCompare } = useCompareList();

  const counts = useMemo(() => Object.fromEntries(directions.map((item) => [item.id, universities.filter((university) => belongsTo(item.id, university.country)).length])), [universities]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = universities.filter((university) => {
      if (direction && !belongsTo(direction, university.country)) return false;
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
      : (a, b) => (a.tuitionFrom || Number.MAX_SAFE_INTEGER) - (b.tuitionFrom || Number.MAX_SAFE_INTEGER));
  }, [universities, query, direction, hsk, ielts, dormitory, sort]);

  return <div>
    <section className="pt-8">
      <div className="mb-4 flex items-end justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Направления</div><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Куда хотите поступить?</h2></div>{direction && <button onClick={() => setDirection(null)} className="text-sm font-bold text-ze-primary">Показать все</button>}</div>
      <div className="grid gap-3 md:grid-cols-3">{directions.map((item) => { const Icon = item.icon; const selected = direction === item.id; return <button key={item.id} onClick={() => setDirection(selected ? null : item.id)} className={`group relative overflow-hidden rounded-[20px] border bg-gradient-to-br p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,.09)] ${item.tint} ${selected ? `${item.active} ring-4` : "border-slate-200"}`}><div className="flex items-start justify-between"><span className="text-3xl" aria-hidden>{item.flag}</span><span className={`flex h-9 w-9 items-center justify-center rounded-full transition ${selected ? "bg-ze-primary text-white" : "bg-white text-slate-500 shadow-sm group-hover:text-ze-primary"}`}><ArrowRight className="h-4 w-4" /></span></div><div className="mt-6 flex items-end justify-between gap-3"><div><div className="text-xl font-extrabold">{item.title}</div><div className="mt-1 text-sm text-slate-500">{item.subtitle}</div></div><Icon className="h-7 w-7 flex-none text-slate-300" /></div><div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{counts[item.id]} {plural(counts[item.id])}</div></button>; })}</div>
    </section>

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

    <div className="mt-8 flex flex-wrap items-center justify-between gap-3"><div><div className="text-xl font-extrabold">{filtered.length} {plural(filtered.length)}</div>{direction && <div className="mt-1 text-sm text-slate-500">Направление: {directions.find((item) => item.id === direction)?.title}</div>}</div><div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 text-xs font-semibold text-slate-400 sm:flex"><SlidersHorizontal className="h-4 w-4" /> Сортировка</span><div className="flex gap-1.5 rounded-xl border border-ze-border bg-[#F4F6FA] p-1">{([ ["price", "Сначала дешевле"], ["rating", "По рейтингу"] ] as const).map(([key, label]) => <button key={key} onClick={() => setSort(key)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${sort === key ? "bg-white text-ze-ink shadow-sm" : "text-ze-muted"}`}>{label}</button>)}</div></div></div>

    {filtered.length > 0 ? <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((university) => <UniversityCard key={university.id} u={university} clientId={clientId} added={addedIds.includes(university.id)} onAdded={() => setAddedIds((ids) => [...ids, university.id])} inCompare={compareIds.includes(university.id)} onToggleCompare={() => toggleCompare(university.id)} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><div className="text-lg font-bold">Университеты не найдены</div><p className="mt-2 text-sm text-slate-500">Попробуйте другой запрос или измените быстрые фильтры.</p><button onClick={() => { setQuery(""); setDirection(null); setHsk("any"); setIelts("any"); setDormitory("any"); }} className="mt-4 rounded-xl bg-ze-primary px-5 py-3 text-sm font-bold text-white">Показать все университеты</button></div>}
  </div>;
}

function QuickSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <label className={`flex items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 transition ${value !== "any" ? "border-blue-200 bg-blue-50/60" : "border-ze-border"}`}><span className="text-xs font-bold text-slate-600">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 bg-transparent text-right text-xs font-semibold text-ze-primary outline-none">{options.map(([key, title]) => <option key={key} value={key}>{title}</option>)}</select></label>;
}

function UniversityCard({ u, inCompare, onToggleCompare, clientId, added, onAdded }: { u: CatalogUniversity; inCompare: boolean; onToggleCompare: () => void; clientId?: string; added: boolean; onAdded: () => void }) {
  return <article className="flex flex-col overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_2px_8px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,.1)]"><div className="relative aspect-[16/10]"><CoverPhoto src={u.imageUrl} alt={u.city} label={`фото кампуса — ${u.city}`} /><div className="absolute left-3 top-3 flex gap-1.5"><span className="rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold shadow-sm">{u.flag} {u.country}</span>{u.hasGrant && <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">Грант</span>}</div><button onClick={onToggleCompare} className={`absolute bottom-3 right-3 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm ${inCompare ? "bg-ze-primary text-white" : "bg-white/95 text-slate-700"}`}>{inCompare ? "✓ В сравнении" : "Сравнить"}</button></div><div className="flex flex-1 flex-col p-4"><h3 className="text-lg font-extrabold leading-tight">{u.name}</h3><div className="mt-1.5 text-sm text-ze-muted">{u.city} · {u.programsCount} программ {u.rankingNational ? `· #${u.rankingNational} в стране` : ""}</div><div className={`mt-4 flex items-center justify-between rounded-xl px-3 py-2.5 ${u.hasDormitory ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}><span className="flex items-center gap-2 text-xs font-bold"><BedDouble className="h-4 w-4" /> Общежитие</span><span className="flex items-center gap-1 text-xs font-semibold">{u.hasDormitory && <Check className="h-3.5 w-3.5" />}{u.hasDormitory ? "Есть" : "Нет"}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{[u.languages[0], u.ieltsRequired ? "IELTS нужен" : "Без IELTS"].filter(Boolean).map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{tag}</span>)}</div><div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4"><div><div className="text-lg font-extrabold">{formatTuition(u.tuitionFrom, u.tuitionCurrency)}</div><div className="text-xs text-ze-muted">{formatMonthlyInstallment(u.tuitionFrom, u.tuitionCurrency)}</div></div><div className="text-right text-xs"><div className={u.deadlineSoon ? "font-bold text-red-600" : "font-bold text-slate-600"}>{u.deadlineLabel}</div><div className="mt-1 text-ze-muted">★ {u.ratingStars.toFixed(1)} · {u.reviewsCount} отзывов</div></div></div><Link href={`/education/${u.slug}`} className="mt-4 rounded-xl bg-[#EBF1FE] py-3 text-center text-sm font-bold text-ze-primary transition hover:bg-ze-primary hover:text-white">Подробнее</Link>{clientId && <button disabled={added} onClick={async () => { const result = await addUniversityToClient(clientId, u.id); if (result.success) onAdded(); }} className="mt-2 rounded-xl border border-ze-primary py-2.5 text-sm font-semibold text-ze-primary disabled:border-emerald-300 disabled:bg-emerald-50 disabled:text-emerald-700">{added ? "✓ Добавлен" : "Добавить клиенту"}</button>}</div></article>;
}

function plural(value: number) { const teen = value % 100; const last = value % 10; if (teen > 10 && teen < 20) return "университетов"; if (last === 1) return "университет"; if (last > 1 && last < 5) return "университета"; return "университетов"; }
