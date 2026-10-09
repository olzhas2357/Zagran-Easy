"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, BedDouble, BookOpen, Building2, CalendarDays, Check,
  ChevronDown, CircleDollarSign, Clock3, ExternalLink, FileText, GraduationCap, Heart,
  Languages, MapPin, Maximize2, Play, Search, ShieldCheck, Star, Trophy, X,
} from "lucide-react";
import type { EducationCountry, University, UniversityCatalog, UniversityCatalogItem } from "@/lib/types";
import { useCompareList } from "@/lib/hooks/useCompareList";
import { createLead } from "@/lib/actions";
import { formatKazakhstanPhone, isValidPhone, KAZAKHSTAN_PHONE_START, waUrl } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

type Props = { university: University; catalog: UniversityCatalog; country: EducationCountry | null; related: University[] };

const navItems = [
  ["overview", "Обзор"], ["offer", "Грант 1 + 4"], ["programs", "Программы"], ["admission", "Поступление"],
  ["cost", "Стоимость"], ["scholarships", "Гранты"], ["campus", "Кампус"],
] as const;

function text(value: unknown) { return typeof value === "string" && value.trim() ? value.trim() : ""; }
function positive(value: unknown) { const number = Number(value); return Number.isFinite(number) && number > 0 ? number : null; }
function money(value: unknown, currency = "USD") {
  const amount = positive(value); if (!amount) return "";
  return formatCurrency(amount, currency);
}
function dateLabel(value: unknown) {
  const raw = text(value); if (!raw) return "";
  const date = new Date(raw); return Number.isNaN(date.valueOf()) ? raw : date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function normalizedCatalogValue(value: unknown) {
  return text(value).toLocaleLowerCase("ru-RU").replaceAll("ё", "е");
}

function isRectorGrant(item: UniversityCatalogItem) {
  const value = `${normalizedCatalogValue(item.coverage_type)} ${normalizedCatalogValue(item.name)} ${normalizedCatalogValue(item.description)}`;
  return /rector_4_plus_1|rector|ректор|4\s*\+\s*1/.test(value);
}

function isRectorOfferCost(item: UniversityCatalogItem) {
  return /rector_grant|grant_package|scholarship_package|4\s*\+\s*1|ректор/.test(`${normalizedCatalogValue(item.category)} ${normalizedCatalogValue(item.title)}`);
}

function isZagranEasyServiceCost(item: UniversityCatalogItem) {
  return /zagraneasy_service|zagraneasy|услуг/.test(`${normalizedCatalogValue(item.category)} ${normalizedCatalogValue(item.title)}`);
}

function getRectorGrantOffer(catalog: UniversityCatalog) {
  const scholarship = catalog.scholarships.find(isRectorGrant);
  if (!scholarship) return null;
  return {
    scholarship,
    tuition: catalog.costs.filter(isRectorOfferCost),
    services: catalog.costs.filter(isZagranEasyServiceCost),
  };
}

export function UniversityExperience({ university, catalog, country, related }: Props) {
  const [active, setActive] = useState("overview");
  const rectorGrantOffer = useMemo(() => getRectorGrantOffer(catalog), [catalog]);
  const otherScholarships = useMemo(() => catalog.scholarships.filter((item) => !isRectorGrant(item)), [catalog.scholarships]);
  const sections = useMemo(() => navItems.filter(([id]) => {
    if (id === "offer") return Boolean(rectorGrantOffer);
    if (id === "scholarships") return otherScholarships.length > 0;
    return true;
  }), [otherScholarships.length, rectorGrantOffer]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.35] });
    sections.forEach(([id]) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <main className="min-h-screen bg-[#f6f8fc] pb-24 text-ze-ink sm:pb-16">
      <div className="mx-auto max-w-[1240px] px-4 pb-14 pt-5 sm:px-8 lg:px-10">
        <Breadcrumb university={university} country={country} />
        <UniversityHero university={university} country={country} />
        <UniversityIdentity university={university} country={country} />
        <QuickFacts university={university} />
      </div>

      <nav className="sticky top-0 z-30 border-y border-slate-200/80 bg-white/95 shadow-[0_6px_18px_rgba(15,23,42,.04)] backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 sm:px-8 lg:px-10">
          {sections.map(([id, label]) => <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} className={`relative flex-none px-3 py-4 text-sm font-semibold transition ${active === id ? "text-ze-primary" : "text-slate-500 hover:text-slate-900"}`}>{label}{active === id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-ze-primary" />}</button>)}
        </div>
      </nav>

      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10">
        <div className="min-w-0 space-y-16">
          <Overview university={university} />
          {rectorGrantOffer && <RectorGrantOffer university={university} offer={rectorGrantOffer} />}
          <Programs university={university} catalog={catalog} />
          <Admission university={university} catalog={catalog} />
          {(university.youtubeUrl || university.virtualTourUrl || university.presentationUrl) && <UniversityMedia university={university} />}
          <Tuition university={university} catalog={catalog} />
          {otherScholarships.length > 0 && <Scholarships items={otherScholarships} />}
          <Campus university={university} />
          {(university.address || university.googleMapsUrl || university.city) && <Location university={university} country={country} />}
        </div>
        <aside className="hidden lg:block"><div className="sticky top-24"><ApplicationCard university={university} catalog={catalog} /></div></aside>
      </div>
      {related.length > 0 && <Related universities={related} country={country} />}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden"><ApplyButton university={university} className="w-full" /></div>
    </main>
  );
}

function RectorGrantOffer({ university, offer }: { university: University; offer: NonNullable<ReturnType<typeof getRectorGrantOffer>> }) {
  const { scholarship, tuition, services } = offer;
  const description = text(scholarship.description) || "1 год языковой подготовки + 4 года бакалавриата";
  return <Section id="offer">
    <div className="relative overflow-hidden rounded-[28px] border-2 border-[#ef4d3d] bg-gradient-to-br from-[#fff3f0] via-white to-[#fff8f7] p-6 shadow-[0_20px_50px_rgba(239,77,61,.12)] sm:p-9">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[34px] border-[#ffd9d3]/70" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ef4d3d] px-4 py-2 text-xs font-extrabold uppercase tracking-[.10em] text-white shadow-sm">
            <ShieldCheck className="h-4 w-4" /> Ректорский грант · 1 + 4
          </div>
          <span className="rounded-full border border-[#ef4d3d] bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#ef4d3d]">Специальное предложение ZagranEasy</span>
        </div>
        <h2 className="mt-5 max-w-3xl text-2xl font-extrabold tracking-[-.025em] sm:text-4xl">Обучение в {university.name} по ректорскому гранту</h2>
        <p className="mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-6 text-slate-600">{description}</p>

        {tuition.length > 0 && <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {tuition.map((item) => <div key={item.id} className="rounded-2xl border border-[#ffd8d2] bg-white/95 p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-600">{text(item.title) || "Бакалавриат"}</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#ef4d3d]">{money(item.amount, text(item.currency) || "USD")}</div>
            <div className="mt-1 text-sm font-bold text-slate-500">{text(item.period) || "за весь период обучения"}</div>
          </div>)}
        </div>}

        <div className="mt-7 rounded-2xl border border-[#ffe0db] bg-white/70 p-5">
          <div className="text-xs font-extrabold uppercase tracking-[.14em] text-[#ef4d3d]">Что входит в программу</div>
          <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            {["1 год языковой подготовки", "4 года бакалавриата", "Ректорский грант на весь период"].map((label) => <div key={label} className="flex items-start gap-2.5"><span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-[#ef4d3d] text-[#ef4d3d]"><Check className="h-3.5 w-3.5" /></span><span className="font-semibold">{label}</span></div>)}
          </div>
        </div>

        {services.map((item) => <div key={item.id} className="mt-5 flex flex-col justify-between gap-4 rounded-2xl bg-[#ef4d3d] p-5 text-white shadow-[0_12px_28px_rgba(239,77,61,.22)] sm:flex-row sm:items-center sm:px-6">
          <div><div className="text-sm font-extrabold">{text(item.title) || "Услуги ZagranEasy"}</div><div className="mt-1 text-xs text-white/80">Консультация и сопровождение.</div></div>
          <div className="text-3xl font-extrabold tracking-tight">{money(item.amount, text(item.currency) || "KZT")}</div>
        </div>)}
        <p className="mt-5 text-xs leading-5 text-slate-500">Стоимость университета и услуги ZagranEasy указаны раздельно. Проживание, перелёт и личные расходы не включены.</p>
      </div>
    </div>
  </Section>;
}

function Breadcrumb({ university, country }: { university: University; country: EducationCountry | null }) {
  return <div className="mb-5 flex items-center gap-2 overflow-hidden text-sm text-slate-500"><Link href="/education" className="flex items-center gap-1.5 hover:text-ze-primary"><ArrowLeft className="h-4 w-4" /> Университеты</Link><span>/</span>{country && <><Link href={`/education?country=${encodeURIComponent(country.name)}`} className="hover:text-ze-primary">{country.name}</Link><span>/</span></>}<span className="truncate text-slate-700">{university.name}</span></div>;
}

function UniversityHero({ university, country }: { university: University; country: EducationCountry | null }) {
  const photos = Array.from(new Set([university.imageUrl, ...(university.galleryImages ?? []), ...(university.dormitoryImages ?? [])].filter(Boolean)));
  const [gallery, setGallery] = useState<number | null>(null);
  return <>
    <div className="relative overflow-hidden rounded-[26px] bg-slate-200 shadow-[0_22px_60px_rgba(15,23,42,.13)] aspect-[4/3] sm:aspect-[16/7]">
      <SafeImage src={photos[0]} alt={`Кампус ${university.name}`} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/55 via-blue-300/5 to-white/10" />
      <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-7 sm:left-7">
        {country && <Badge>{country.flag} {country.name}</Badge>}<Badge>{university.type === "public" ? "Государственный" : "Частный"}</Badge>{university.isPartner && <Badge><BadgeCheck className="h-3.5 w-3.5" /> Партнёр ZagranEasy</Badge>}
      </div>
      {photos.length > 1 && <button onClick={() => setGallery(0)} className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg sm:bottom-7 sm:right-7"><Maximize2 className="h-4 w-4" /> Все фото · {photos.length}</button>}
    </div>
    {gallery !== null && <ImageLightbox images={photos} index={gallery} onIndex={setGallery} onClose={() => setGallery(null)} alt={`Фото ${university.name}`} />}
  </>;
}

function UniversityIdentity({ university, country }: { university: University; country: EducationCountry | null }) {
  const { ids, toggle } = useCompareList(); const compared = ids.includes(university.id);
  return <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
    <div className="relative flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {university.logoUrl ? <SafeImage src={university.logoUrl} alt={`Логотип ${university.name}`} contain /> : <span className="text-2xl font-extrabold text-ze-primary">{university.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("")}</span>}
    </div>
    <div className="min-w-0 flex-1"><h1 className="text-3xl font-extrabold leading-tight tracking-[-.03em] sm:text-5xl">{university.name}</h1>{university.nameLocal && <p className="mt-1 text-lg text-slate-500">{university.nameLocal}</p>}<div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600"><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-ze-primary" /> {university.city}{country?.name ? `, ${country.name}` : ""}</span>{positive(university.ratingStars) && <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {university.ratingStars.toFixed(1)}</span>}{positive(university.rankingWorld) && <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-ze-primary" /> #{university.rankingWorld} в мире</span>}</div></div>
    <div className="flex gap-2"><ApplyButton university={university} className="hidden sm:flex" /><button onClick={() => toggle(university.id)} aria-label="Добавить к сравнению" className={`flex h-12 w-12 items-center justify-center rounded-xl border ${compared ? "border-ze-primary bg-blue-50 text-ze-primary" : "border-slate-200 bg-white text-slate-600"}`}><Heart className={`h-5 w-5 ${compared ? "fill-current" : ""}`} /></button></div>
  </div>;
}

function QuickFacts({ university }: { university: University }) {
  const facts = [
    [Building2, "Тип", university.type === "public" ? "Государственный" : "Частный"],
    [Languages, "Язык", university.languages.filter(Boolean).join(" / ")],
    [BedDouble, "Общежитие", university.hasDormitory ? "Есть" : "Не указано"],
    [BookOpen, "Программы", positive(university.programsCount) ? String(university.programsCount) : university.programs.filter(Boolean).join(", ")],
  ].filter(([, , value]) => value);
  return <div className="mt-8 flex snap-x gap-0 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid sm:grid-cols-4">{facts.map(([Icon, label, value], index) => { const FactIcon = Icon as typeof Building2; return <div key={String(label)} className={`min-w-[180px] snap-start px-5 py-5 ${index ? "border-l border-slate-100" : ""}`}><FactIcon className="mb-3 h-5 w-5 text-ze-primary" /><div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{String(label)}</div><div className="mt-1 font-bold text-slate-800">{String(value)}</div></div>;})}</div>;
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) { return <div className="mb-7"><div className="text-xs font-bold uppercase tracking-[.18em] text-ze-primary">{eyebrow}</div><h2 className="mt-2 text-2xl font-extrabold tracking-[-.025em] sm:text-3xl">{title}</h2>{description && <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">{description}</p>}</div>; }
function Section({ id, children }: { id: string; children: React.ReactNode }) { return <section id={id} className="scroll-mt-24">{children}</section>; }

function Overview({ university }: { university: University }) {
  const [expanded, setExpanded] = useState(false); const long = university.description.length > 460;
  const [advantagesExpanded, setAdvantagesExpanded] = useState(false);
  const visibleAdvantages = advantagesExpanded ? university.advantages : university.advantages.slice(0, 2);
  return <Section id="overview"><SectionTitle eyebrow="Знакомство" title="Об университете" /><div className="grid gap-8 md:grid-cols-[1.25fr_.95fr]"><div><p className={`whitespace-pre-line text-[16px] leading-7 text-slate-600 ${!expanded && long ? "line-clamp-6" : ""}`}>{university.description}</p>{long && <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-sm font-bold text-ze-primary">{expanded ? "Свернуть" : "Читать полностью"}<ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} /></button>}</div>{university.advantages.length > 0 && <div className="relative overflow-hidden rounded-[22px] border border-blue-100 bg-gradient-to-br from-[#f4f7ff] to-white p-6 shadow-[0_14px_36px_rgba(50,85,173,.08)]"><div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-100/60" /><div className="relative"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ze-primary text-white shadow-[0_8px_18px_rgba(26,86,219,.22)]"><Star className="h-5 w-5" /></span><div><div className="text-xs font-bold uppercase tracking-[.14em] text-ze-primary">Преимущества</div><h3 className="mt-0.5 text-lg font-extrabold">Почему стоит рассмотреть</h3></div></div><ul className="mt-5 space-y-3">{visibleAdvantages.map((item) => <li key={item} className={`flex gap-3 text-sm leading-5 text-slate-700 ${advantagesExpanded ? "" : "last:[&>span+*]:line-clamp-2"}`}><span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}</ul><button onClick={() => setAdvantagesExpanded(!advantagesExpanded)} className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-ze-primary transition hover:border-blue-200 hover:bg-blue-50">{advantagesExpanded ? "Свернуть" : "Читать полностью"}<ChevronDown className={`h-4 w-4 transition-transform ${advantagesExpanded ? "rotate-180" : ""}`} /></button></div></div>}</div></Section>;
}

function Programs({ university, catalog }: { university: University; catalog: UniversityCatalog }) {
  const programs = catalog.programs.length ? catalog.programs : university.programList.map((item, index) => ({ id: `legacy-${index}`, name: item.name, degree_level: item.meta, legacy_price: item.price }));
  const [query, setQuery] = useState(""); const [level, setLevel] = useState("Все"); const [showAll, setShowAll] = useState(false); const [selected, setSelected] = useState<UniversityCatalogItem | null>(null);
  const levels = ["Все", ...Array.from(new Set(programs.map((item) => text(item.degree_level)).filter(Boolean)))];
  const filtered = programs.filter((item) => (!query || text(item.name).toLowerCase().includes(query.toLowerCase())) && (level === "Все" || text(item.degree_level) === level));
  return <Section id="programs"><div className="mb-6"><div className="text-xs font-bold uppercase tracking-[.18em] text-ze-primary">Образование</div><h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">Программы обучения</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Найдите программу, подходящую вашему направлению и уровню образования.</p></div>
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{levels.map((item) => <button key={item} onClick={() => setLevel(item)} className={`flex-none rounded-full px-4 py-2 text-sm font-semibold ${level === item ? "bg-ze-primary text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{item}</button>)}</div>
    <label className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-ze-primary"><Search className="h-5 w-5 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти специальность" className="w-full bg-transparent text-sm outline-none" /></label>
    <div className="grid gap-4 md:grid-cols-2">{filtered.slice(0, showAll ? undefined : 6).map((program) => <ProgramCard key={program.id} program={program} catalog={catalog} onOpen={() => setSelected(program)} />)}</div>
    {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">По вашему запросу программ не найдено.</div>}
    {filtered.length > 6 && <button onClick={() => setShowAll(!showAll)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-ze-primary">{showAll ? "Скрыть" : `Показать все программы (${filtered.length})`}<ChevronDown className={`h-4 w-4 ${showAll ? "rotate-180" : ""}`} /></button>}
    {selected && <ProgramModal program={selected} catalog={catalog} university={university} onClose={() => setSelected(null)} />}
  </Section>;
}

function ProgramCard({ program, catalog, onOpen }: { program: UniversityCatalogItem; catalog: UniversityCatalog; onOpen: () => void }) {
  const costs = catalog.costs.filter((item) => item.program_id === program.id && positive(item.amount) && !isRectorOfferCost(item) && !isZagranEasyServiceCost(item)); const requirements = catalog.requirements.filter((item) => item.program_id === program.id).slice(0, 2); const intake = catalog.intakes.find((item) => item.program_id === program.id);
  return <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(15,23,42,.08)]"><h3 className="text-lg font-extrabold">{text(program.name)}</h3><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">{text(program.degree_level) && <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" />{text(program.degree_level)}</span>}{positive(program.duration_months) && <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{program.duration_months} мес.</span>}{text(program.language) && <span className="flex items-center gap-1.5"><Languages className="h-4 w-4" />{text(program.language)}</span>}</div><div className="mt-5 text-xl font-extrabold text-ze-primary">{costs[0] ? `${money(costs[0].amount, text(costs[0].currency) || "USD")}${text(costs[0].period) ? ` / ${costs[0].period}` : ""}` : text(program.legacy_price) || "Стоимость уточняется"}</div>{requirements.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{requirements.map((item) => <span key={item.id} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{text(item.title)}{positive(item.minimum_value) ? ` ${item.minimum_value}${text(item.unit)}` : ""}</span>)}</div>}{intake && text(intake.application_deadline) && <div className="mt-4 flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" /> Дедлайн: {dateLabel(intake.application_deadline)}</div>}<button onClick={onOpen} className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-ze-primary">Подробнее о программе <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></button></article>;
}

function ProgramModal({ program, catalog, university, onClose }: { program: UniversityCatalogItem; catalog: UniversityCatalog; university: University; onClose: () => void }) {
  const requirements = catalog.requirements.filter((item) => !item.program_id || item.program_id === program.id); const costs = catalog.costs.filter((item) => item.program_id === program.id && positive(item.amount) && !isRectorOfferCost(item) && !isZagranEasyServiceCost(item)); const intake = catalog.intakes.find((item) => item.program_id === program.id);
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-sm" onMouseDown={onClose}><div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-9" onMouseDown={(event) => event.stopPropagation()}><button onClick={onClose} className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100" aria-label="Закрыть"><X className="h-5 w-5" /></button><div className="mt-4 text-xs font-bold uppercase tracking-widest text-ze-primary">{university.name}</div><h2 className="mt-2 text-3xl font-extrabold">{text(program.name)}</h2><div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200 px-5">{[["Уровень", program.degree_level], ["Продолжительность", positive(program.duration_months) ? `${program.duration_months} мес.` : ""], ["Язык", program.language], ["Дедлайн", intake?.application_deadline ? dateLabel(intake.application_deadline) : ""]].filter(([, value]) => value).map(([label, value]) => <div key={String(label)} className="flex justify-between gap-4 py-4 text-sm"><span className="text-slate-500">{String(label)}</span><b className="text-right">{String(value)}</b></div>)}</div>{text(program.description) && <p className="mt-6 text-[15px] leading-7 text-slate-600">{text(program.description)}</p>}{costs.length > 0 && <div className="mt-7"><h3 className="font-bold">Стоимость</h3><div className="mt-3 space-y-2">{costs.map((item) => <div key={item.id} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span>{text(item.title)}</span><b>{money(item.amount, text(item.currency) || "USD")}</b></div>)}</div></div>}{requirements.length > 0 && <div className="mt-7"><h3 className="font-bold">Требования</h3><ul className="mt-3 space-y-2">{requirements.map((item) => <li key={item.id} className="flex gap-2 text-sm text-slate-600"><Check className="h-4 w-4 flex-none text-emerald-600" />{text(item.title)}{text(item.description) ? ` — ${item.description}` : ""}</li>)}</ul></div>}<a href={waUrl(`Здравствуйте! Хочу узнать о программе ${text(program.name)} в ${university.name}.`)} target="_blank" rel="noreferrer" className="mt-8 block rounded-xl bg-ze-primary px-5 py-3.5 text-center text-sm font-bold text-white">Хочу поступить на программу</a></div></div>;
}

function Admission({ university, catalog }: { university: University; catalog: UniversityCatalog }) {
  const items: UniversityCatalogItem[] = catalog.requirements.length ? catalog.requirements : university.requirements.map((title, index) => ({ id: `legacy-${index}`, title }));
  const [open, setOpen] = useState(true);
  if (!items.length) return null;
  return <Section id="admission"><div className="flex items-start justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.18em] text-ze-primary">Поступление</div><h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Требования к поступлению</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Точные требования могут отличаться в зависимости от выбранной программы.</p></div><button onClick={() => setOpen(!open)} className="mt-5 flex flex-none items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-ze-primary">{open ? "Скрыть" : "Показать"}<ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} /></button></div>{open && <div className="mt-7 grid gap-3 sm:grid-cols-2">{items.map((item) => <div key={item.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-ze-primary"><FileText className="h-4 w-4" /></div><div><div className="font-bold">{text(item.title)}</div>{text(item.description) && <p className="mt-1 text-sm leading-5 text-slate-500">{text(item.description)}</p>}{positive(item.minimum_value) && <div className="mt-1 text-sm font-semibold text-ze-primary">Минимум: {item.minimum_value} {text(item.unit)}</div>}</div></div>)}</div>}</Section>;
}

function Tuition({ university, catalog }: { university: University; catalog: UniversityCatalog }) {
  const costs = catalog.costs.filter((item) => positive(item.amount) && !isRectorOfferCost(item) && !isZagranEasyServiceCost(item)); const tuitionCosts = costs.filter((item) => /tuition|обуч/i.test(`${item.category} ${item.title}`)); const extra = costs.filter((item) => !tuitionCosts.includes(item));
  const tuitionFallback = positive(university.tuitionFrom); const extras = [...extra];
  if (positive(university.dormitoryCost) && !extras.some((item) => /dorm|общеж/i.test(text(item.title)))) extras.push({ id: "dorm", title: "Общежитие", amount: university.dormitoryCost, currency: university.dormitoryCurrency });
  if (positive(university.applicationFee)) extras.push({ id: "application", title: "Application fee", amount: university.applicationFee, currency: university.applicationFeeCurrency });
  if (positive(university.medicalInsuranceCost)) extras.push({ id: "insurance", title: "Медицинская страховка", amount: university.medicalInsuranceCost, currency: university.medicalInsuranceCurrency });
  return <Section id="cost"><div className="overflow-hidden rounded-[24px] border border-blue-100 bg-gradient-to-br from-[#eaf2ff] via-[#f4f8ff] to-white text-ze-ink shadow-[0_16px_40px_rgba(50,85,173,.08)]"><div className="p-6 sm:p-9"><SectionTitle eyebrow="Финансы" title="Стоимость обучения" description="Актуальные платежи из каталога университета." /><div className="grid gap-3 sm:grid-cols-2">{tuitionCosts.length ? tuitionCosts.map((item) => <CostRow key={item.id} item={item} />) : <div className="rounded-2xl border border-blue-100 bg-white/80 p-5"><div className="text-sm text-slate-500">Обучение</div><div className="mt-2 text-2xl font-extrabold text-ze-primary">{tuitionFallback ? `от ${money(tuitionFallback, university.tuitionCurrency)}` : "Стоимость уточняется"}<span className="text-sm font-medium text-slate-500"> / год</span></div></div>}</div>{extras.length > 0 && <><div className="my-7 h-px bg-blue-100" /><h3 className="mb-4 font-bold">Дополнительные расходы</h3><div className="grid gap-3 sm:grid-cols-2">{extras.map((item) => <CostRow key={item.id} item={item} compact />)}</div></>}</div></div></Section>;
}
function CostRow({ item, compact = false }: { item: UniversityCatalogItem; compact?: boolean }) { return <div className="rounded-2xl border border-blue-100 bg-white/80 p-5"><div className="text-sm text-slate-500">{text(item.title) || text(item.category)}</div><div className={`mt-2 font-extrabold text-ze-primary ${compact ? "text-lg" : "text-2xl"}`}>{money(item.amount, text(item.currency) || "USD")}{text(item.period) && <span className="text-sm font-medium text-slate-500"> / {text(item.period)}</span>}</div></div>; }

function Scholarships({ items }: { items: UniversityCatalogItem[] }) { return <Section id="scholarships"><SectionTitle eyebrow="Поддержка" title="Гранты и стипендии" /><div className="grid gap-4 sm:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5"><ShieldCheck className="h-7 w-7 text-emerald-600" /><h3 className="mt-4 text-lg font-extrabold">{text(item.name)}</h3>{text(item.description) && <p className="mt-2 text-sm leading-6 text-slate-600">{text(item.description)}</p>}<div className="mt-4 space-y-2 text-sm">{text(item.coverage_type) && <div><span className="text-slate-500">Покрытие: </span><b>{text(item.coverage_type)}{positive(item.coverage_value) ? ` — ${money(item.coverage_value, text(item.currency) || "USD")}` : ""}</b></div>}{text(item.eligibility) && <div><span className="text-slate-500">Кому доступно: </span><b>{text(item.eligibility)}</b></div>}{text(item.application_deadline) && <div><span className="text-slate-500">Дедлайн: </span><b>{dateLabel(item.application_deadline)}</b></div>}</div></article>)}</div></Section>; }

function Campus({ university }: { university: University }) {
  const campus = Array.from(new Set([university.imageUrl, ...(university.galleryImages ?? [])].filter(Boolean))); const dorms = (university.dormitoryImages ?? []).filter(Boolean); const images = [...campus, ...dorms]; const [open, setOpen] = useState<number | null>(null);
  return <Section id="campus"><SectionTitle eyebrow="Среда" title="Кампус и проживание" description={university.hasDormitory ? "Учебные пространства и варианты проживания студентов." : undefined} />{images.length > 0 ? <><div className="grid h-[420px] grid-cols-2 gap-2 overflow-hidden rounded-[24px] sm:grid-cols-3"><button onClick={() => setOpen(0)} className="relative col-span-2 row-span-2 overflow-hidden sm:col-span-2"><SafeImage src={images[0]} alt={`Кампус ${university.name}`} /><span className="absolute bottom-4 left-4 rounded-full bg-slate-950/65 px-3 py-1.5 text-xs font-bold text-white">Кампус</span></button>{images.slice(1, 3).map((src, index) => <button key={src} onClick={() => setOpen(index + 1)} className="relative hidden overflow-hidden sm:block"><SafeImage src={src} alt={`${university.name}, фото ${index + 2}`} /><span className="absolute bottom-3 left-3 rounded-full bg-slate-950/65 px-3 py-1.5 text-xs font-bold text-white">{index + 1 < campus.length ? "Кампус" : "Общежитие"}</span>{index === 1 && images.length > 3 && <span className="absolute inset-0 flex items-center justify-center bg-slate-950/35 text-lg font-bold text-white">+{images.length - 3} фото</span>}</button>)}</div>{open !== null && <ImageLightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} alt={`Кампус ${university.name}`} />}</> : <div className="rounded-2xl bg-slate-100 p-10 text-center text-slate-500">Фотографии скоро появятся.</div>}<div className="mt-5 flex flex-wrap gap-3">{university.hasDormitory && <InfoPill icon={BedDouble} text="Общежитие доступно" />}{positive(university.dormitoryCost) && <InfoPill icon={CircleDollarSign} text={`от ${money(university.dormitoryCost, university.dormitoryCurrency)} / мес.`} />}</div></Section>;
}

function UniversityMedia({ university }: { university: University }) { const videos = [university.youtubeUrl, university.virtualTourUrl].filter(Boolean); return <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Материалы</div><h2 className="mt-1 text-xl font-extrabold">Видео и документы</h2></div></div><div className={`grid gap-4 ${videos.length && university.presentationUrl ? "lg:grid-cols-[1.4fr_.6fr]" : ""}`}>{videos.length > 0 && <VideoCard url={videos[0]} title={`Обзор ${university.name}`} imageUrl={university.imageUrl} />}{university.presentationUrl && <div className="flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5"><div className="relative mx-auto w-[118px] rounded-lg border border-blue-100 bg-white p-3 shadow-[0_5px_14px_rgba(50,85,173,.08)]"><div className="flex items-center justify-between"><FileText className="h-5 w-5 text-ze-primary" /><span className="rounded bg-red-50 px-1.5 py-0.5 text-[8px] font-extrabold text-red-600">PDF</span></div><div className="mt-4 h-2 w-3/4 rounded bg-blue-100" /><div className="mt-2 h-1.5 rounded bg-slate-100" /><div className="mt-1.5 h-1.5 w-5/6 rounded bg-slate-100" /><div className="mt-4 h-10 rounded bg-gradient-to-br from-blue-50 to-blue-100" /></div><div className="mt-5 text-center"><span className="block text-xs font-bold uppercase tracking-wider text-ze-primary">Связанный документ · PDF</span><span className="mt-2 block text-lg font-extrabold text-ze-ink">Презентация университета</span>{university.presentationPages && <span className="mt-1 block text-sm text-ze-muted">{university.presentationPages} страниц</span>}<a href={university.presentationUrl} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ze-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-ze-primary-dark">Посмотреть документ <ExternalLink className="h-4 w-4" /></a></div></div>}</div>{videos.length > 1 && <div className="mt-3"><VideoCard url={videos[1]} title="Виртуальный тур" imageUrl={university.imageUrl} /></div>}</section>; }
function VideoCard({ url, title, imageUrl }: { url: string; title: string; imageUrl?: string }) { const [playing, setPlaying] = useState(false); const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/); const id = match?.[1]; if (playing && id) return <div className="aspect-video overflow-hidden rounded-2xl bg-blue-100"><iframe src={`https://www.youtube.com/embed/${id}?autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" /></div>; return <button onClick={() => id ? setPlaying(true) : window.open(url, "_blank", "noopener,noreferrer")} className="group relative aspect-video overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">{imageUrl && <SafeImage src={imageUrl} alt={`Видео — ${title}`} />}<span className="absolute inset-0 bg-gradient-to-t from-blue-950/55 via-blue-700/10 to-transparent" /><span className="absolute inset-0 flex items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-ze-primary text-white transition group-hover:scale-105"><Play className="ml-1 h-6 w-6 fill-current" /></span></span><span className="absolute bottom-5 left-5 right-5 text-left font-extrabold text-white">{title}</span></button>; }

function Location({ university, country }: { university: University; country: EducationCountry | null }) { return <section className="scroll-mt-24"><SectionTitle eyebrow="Локация" title="Город и расположение" /><div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-xl font-extrabold"><MapPin className="h-5 w-5 text-ze-primary" />{university.city}{country?.name ? `, ${country.name}` : ""}</div>{university.address && <p className="mt-2 text-sm text-slate-500">{university.address}</p>}</div>{university.googleMapsUrl && <a href={university.googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-ze-primary">Открыть на карте <ExternalLink className="h-4 w-4" /></a>}</div></section>; }

function ApplicationCard({ university, catalog }: { university: University; catalog: UniversityCatalog }) {
  const offer = getRectorGrantOffer(catalog);
  const firstOfferPrice = offer?.tuition[0];
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,.08)]"><div className="text-sm font-bold">{university.name}</div>{offer ? <><div className="mt-5 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Ректорский грант 4+1</div><div className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">За весь период</div><div className="mt-1 text-2xl font-extrabold">{firstOfferPrice ? money(firstOfferPrice.amount, text(firstOfferPrice.currency) || "USD") : "Уточняется"}</div><div className="mt-1 text-xs font-semibold text-slate-500">1 год языка + 4 года бакалавриата</div>{offer.services[0] && <div className="mt-4 rounded-xl bg-blue-50 px-3 py-2.5 text-xs text-slate-600"><b className="block text-ze-primary">Услуги ZagranEasy</b>{money(offer.services[0].amount, text(offer.services[0].currency) || "KZT")} отдельно</div>}</> : <><div className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">Обучение</div><div className="mt-1 text-2xl font-extrabold">{positive(university.tuitionFrom) ? `от ${money(university.tuitionFrom, university.tuitionCurrency)}` : "Уточняется"}<span className="text-sm font-medium text-slate-400"> / год</span></div></>}<div className="mt-5 space-y-2.5 text-sm text-slate-600">{university.deadlineLabel && <div className="flex gap-2"><CalendarDays className="h-4 w-4 text-ze-primary" />{university.deadlineLabel}</div>}{university.hasGrant && <div className="flex gap-2"><Check className="h-4 w-4 text-emerald-600" />Доступны гранты</div>}{university.hasDormitory && <div className="flex gap-2"><Check className="h-4 w-4 text-emerald-600" />Есть общежитие</div>}</div><ApplyButton university={university} className="mt-6 w-full" /><a href={waUrl(`Здравствуйте! Хочу узнать про поступление в ${university.name}.`)} target="_blank" rel="noreferrer" className="mt-3 block text-center text-sm font-bold text-emerald-700">Спросить менеджера</a></div>;
}

function ApplyButton({ university, className = "" }: { university: University; className?: string }) { const [open, setOpen] = useState(false); return <><button onClick={() => setOpen(true)} className={`items-center justify-center rounded-xl bg-ze-primary px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(26,86,219,.2)] transition hover:bg-ze-primary-dark ${className}`}>Хочу поступить</button>{open && <ApplicationModal university={university} onClose={() => setOpen(false)} />}</>; }
function ApplicationModal({ university, onClose }: { university: University; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(KAZAKHSTAN_PHONE_START);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidPhone(phone)) {
      setError("Укажите корректный мобильный номер Казахстана");
      return;
    }
    startTransition(async () => {
      const result = await createLead({
        source: "form",
        service: "education",
        name,
        phone,
        message: `Заявка на поступление: ${university.name}`,
      });
      if (!result.success) setError(result.error || "Не удалось отправить заявку");
      else setDone(true);
    });
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Поступить в ${university.name}`}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 pt-4 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={onClose}
    >
      <div
        className="relative max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-[28px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-2 h-1.5 w-11 rounded-full bg-slate-200 sm:hidden" />
        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold">Заявка принята</h2>
            <p className="mt-2 text-sm text-slate-500">Менеджер ZagranEasy свяжется с вами.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-2xl font-extrabold leading-tight">Поступить в {university.name}</h2>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              Оставьте контакты — расскажем об условиях и оценим шансы.
            </p>
            <div className="mt-5 space-y-3 sm:mt-6">
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ваше имя"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-ze-primary"
              />
              <input
                required
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(formatKazakhstanPhone(event.target.value))}
                placeholder="+7 (___) ___ __ __"
                autoComplete="tel"
                maxLength={18}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-ze-primary"
              />
              <button
                type="submit"
                disabled={pending || !isValidPhone(phone)}
                className="w-full rounded-xl bg-ze-primary py-3.5 font-bold text-white disabled:opacity-60"
              >
                {pending ? "Отправляем…" : "Отправить заявку"}
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Related({ universities, country }: { universities: University[]; country: EducationCountry | null }) { return <section className="border-t border-slate-200 bg-white py-14"><div className="mx-auto max-w-[1240px] px-4 sm:px-8 lg:px-10"><SectionTitle eyebrow="Другие варианты" title="Похожие университеты" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{universities.map((item) => <Link href={`/education/${item.slug}`} key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="relative aspect-[16/9] overflow-hidden bg-slate-100"><SafeImage src={item.imageUrl} alt={item.name} /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">{country?.flag} {item.city}</span></div><div className="p-5"><h3 className="text-lg font-extrabold group-hover:text-ze-primary">{item.name}</h3><div className="mt-3 flex items-center justify-between text-sm text-slate-500"><span>{positive(item.tuitionFrom) ? `от ${money(item.tuitionFrom, item.tuitionCurrency)} / год` : "Стоимость уточняется"}</span><ArrowRight className="h-4 w-4" /></div></div></Link>)}</div></div></section>; }

function SafeImage({ src, alt, priority = false, contain = false }: { src?: string | null; alt: string; priority?: boolean; contain?: boolean }) { const [failed, setFailed] = useState(false); if (!src || failed) return <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#e8eefc,#dbe7ff)] text-ze-primary"><Building2 className="h-12 w-12 opacity-30" /></div>; return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 1200px" priority={priority} className={contain ? "object-contain p-3" : "object-cover"} onError={() => setFailed(true)} unoptimized />; }
function Badge({ children }: { children: React.ReactNode }) { return <span className="flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">{children}</span>; }
function InfoPill({ icon: Icon, text: value }: { icon: typeof BedDouble; text: string }) { return <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"><Icon className="h-4 w-4 text-ze-primary" />{value}</span>; }
