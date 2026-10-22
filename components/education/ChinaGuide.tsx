import Link from "next/link";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ClipboardList, Compass, FileCheck2, GraduationCap, MapPin, MessageCircle, Plane, Sparkles } from "lucide-react";

import { CHINA_UNIVERSITY_TIERS } from "@/lib/china-universities";

import type { University } from "@/lib/types";

import { waUrl } from "@/lib/utils";

import { CoverPhoto } from "@/components/ui/CoverPhoto";

const documents = [

  "Паспорт, действительный на период оформления",

  "Аттестат или диплом и академическая выписка с оценками",

  "Перевод документов на язык, который принимает университет",

  "Подтверждение языка обучения: китайского или английского — если требует программа",

  "Мотивационное письмо, рекомендации и портфолио — по требованиям факультета",

  "Медицинская форма и финансовые документы — если указаны в правилах набора",

];

const supportSteps = [

  {

    icon: Compass,

    number: "01",

    title: "Подбор вуза и программы",

    description: "Сопоставляем специальность, уровень образования, город, язык обучения и бюджет.",

  },

  {

    icon: FileCheck2,

    number: "02",

    title: "Подготовка документов",

    description: "Составляем персональный список документов, помогаем с переводом и проверяем комплектность.",

  },

  {

    icon: GraduationCap,

    number: "03",

    title: "Подача и сопровождение",

    description: "Помогаем пройти этапы подачи, следим за дедлайнами и подсказываем, что делать после ответа вуза.",

  },

  {

    icon: Plane,

    number: "04",

    title: "Подготовка к поездке",

    description: "Консультируем по визовым вопросам и организационным шагам перед выездом и после приезда.",

  },

];

function normalizeName(value: string) {

  return value.toLocaleLowerCase("ru-RU").replace(/[^\p{L}\p{N}]/gu, "");

}

function findCatalogUniversity(chinaNames: string[], universities: University[]) {

  const names = new Set(

    chinaNames

      .flatMap((name) => [name, name.replace(/\s\s*\([^)]*\)/g, "")])

      .map(normalizeName)

      .filter(Boolean),

  );

  return universities.find((university) =>

    [university.name, university.nameLocal].some((name) => names.has(normalizeName(name))),

  );

}

export function ChinaGuide({ universities, embedded = false }: { universities: University[]; embedded?: boolean }) {

  const curatedUniversities = CHINA_UNIVERSITY_TIERS.flatMap((tier) => tier.universities);

  const curatedIds = new Set(
    curatedUniversities
      .map((university) => findCatalogUniversity([university.name, ...university.chineseName.split("·").map((name) => name.trim())], universities)?.id)
      .filter((id): id is string => Boolean(id)),
  );

  const otherUniversities = universities
    .filter((university) => university.isActive && !curatedIds.has(university.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const totalUniversities = Math.max(curatedUniversities.length, universities.filter((university) => university.isActive).length);

  const totalCities = new Set([
    ...curatedUniversities.map((university) => university.city),
    ...universities.filter((university) => university.isActive).map((university) => university.city),
  ]).size;

  const featuredUniversity = CHINA_UNIVERSITY_TIERS[0].universities[0];

  return (

    <div className={embedded ? "text-[#163B75]" : "min-h-screen bg-[#EFF6FF] text-[#163B75]"}>

     {!embedded && <section className="relative overflow-hidden bg-[#EFF6FF]">

        <div className="mx-auto max-w-6xl px-4 pb-10 pt-7 sm:px-10 sm:pb-16 sm:pt-10">

        <Link href="/education" className="inline-flex items-center gap-2 rounded-full border border-[#D7E3F5] bg-white px-4 py-2 text-sm font-semibold text-[#526681] shadow-sm transition hover:border-[#A9C5EE] hover:text-[#163B75]">

            <ArrowLeft className="h-4 w-4" /> Все направления обучения

          </Link>

          <div className="relative isolate mt-6 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#12336A] via-[#16458E] to-[#2872C8] px-5 py-6 shadow-[0_24px_65px_rgba(22,59,117,.2)] sm:rounded-[36px] sm:px-9 sm:py-9">

            <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-72 w-72 rounded-full border border-white/10" />

          <div className="mt-8 grid gap-9 lg:grid-cols-[1.04fr\_.96fr] lg:items-center">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-white/90 backdrop-blur">

                <span aria-hidden>🇨🇳</span> Обучение в Китае · гид 2026

              </div>

              <h1 className="mt-5 max-w-2xl text-[40px] font-semibold leading-[1.04] tracking-[-.045em] text-white sm:text-[62px]">

                Ваш путь к учёбе в Китае начинается здесь

              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-blue-50/90 sm:text-lg">

                Сравните университеты, города и направления. Разберитесь, какие шаги нужны для поступления, и получите помощь на каждом этапе.

              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <a href="#top-5" className="inline-flex items-center gap-2 rounded-xl bg-[#163B75] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(22,59,117,.18)] transition hover:bg-[#102D59]">

                  Выбрать университет <ArrowDown className="h-4 w-4" />

                </a>

                <Link href="/education/quiz" className="rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/20">

                  Подобрать по параметрам

                </Link>

              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">

                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#2563EB]" /> Выбор программы</span>

                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#2563EB]" /> Документы и подача</span>

                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#2563EB]" /> Подготовка к поездке</span>

              </div>

            </div>

            <div className="relative min-h-[310px] overflow-hidden rounded-[28px] bg-[#DBEAFE] shadow-[0_24px_60px_rgba(22,59,117,.15)] sm:min-h-[430px]">

              <CoverPhoto src={featuredUniversity.imageUrl} alt={`Кампус: ${featuredUniversity.name}`} className="object-cover" loading="eager" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#102D59]/80 via-[#102D59]/5 to-transparent" />

              <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/85 px-3 py-1.5 text-xs font-bold text-[#102D59] backdrop-blur">

                Университеты · программы · поступление

              </div>

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">

                <div className="text-white">

                  <div className="text-xs font-semibold uppercase tracking-[.15em] text-white/75">В фокусе</div>

                  <div className="mt-1 text-2xl font-semibold sm:text-3xl">{featuredUniversity.name}</div>

                  <div className="mt-1 text-sm text-white/75">{featuredUniversity.city} · {featuredUniversity.chineseName.split("·")[0].trim()}</div>

                  {featuredUniversity.photoAttributionUrl && (

                    <a href={featuredUniversity.photoAttributionUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[10px] text-white/75 underline underline-offset-2">

                      Фото: {featuredUniversity.photoAttribution} · Wikimedia Commons

                    </a>

                  )}

                </div>

                <a href="#top-5" aria-label="Перейти к университетам" className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white text-[#163B75] transition hover:scale-105">

                  <ArrowDown className="h-5 w-5" />

                </a>

              </div>

            </div>

          </div>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">

            {[

              [String(totalUniversities), "университетов"],

              [String(CHINA_UNIVERSITY_TIERS.length), "уровня выбора"],

              [String(totalCities), "городов"],

            ].map(([value, label]) => (

              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur sm:px-5">

                <div className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{value}</div>

                <div className="mt-1 text-xs font-medium text-blue-100/85 sm:text-sm">{label}</div>

              </div>

            ))}

          </div>

          <nav aria-label="Разделы университетов Китая" className="mt-6 flex flex-wrap gap-2">

            {CHINA_UNIVERSITY_TIERS.map((tier) => (

              <a key={tier.id} href={`#${tier.id}`} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 transition hover:border-white/50 hover:bg-white/20">

                {tier.title}

              </a>

            ))}

            <a href="#support" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 transition hover:border-white/50 hover:bg-white/20">

              Услуги сопровождения

            </a>

            <a href="#requirements" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 transition hover:border-white/50 hover:bg-white/20">

              Требования и документы

            </a>

          </nav>

          </div>

        </div>

      </section>}

      <div className={embedded ? "pb-4" : "mx-auto max-w-6xl px-4 pb-16 sm:px-10"}>

        <section className="mt-7 rounded-2xl border border-[#D7E3F5] bg-white/75 px-5 py-4 shadow-[0_6px_22px_rgba(22,59,117,.04)] sm:px-6">

          <div className="flex gap-3">

            <Sparkles className="mt-0.5 h-5 w-5 flex-none text-[#2563EB]" />

            <p className="text-sm leading-6 text-[#526681]">

              Это редакционная подборка для знакомства с вузами, а не официальный рейтинг мест с 1-го по 20-е: позиции университетов меняются в зависимости от рейтинга, года и предметной области. Стоимость, набор и точные требования проверяются по выбранной программе перед подачей.

            </p>

          </div>

        </section>

        <section className="pt-14" aria-label="Подборка университетов">

          {CHINA_UNIVERSITY_TIERS.map((tier) => (

            <div key={tier.id} id={tier.id} className="scroll-mt-28 pt-2 [&+div]:mt-16">

              <div className="mb-7 flex flex-col gap-4 border-b border-[#D7E3F5] pb-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="text-xs font-bold uppercase tracking-[.18em] text-[#647894]">Подборка {tier.eyebrow}</div>

                  <h2 className="mt-2 text-3xl font-semibold tracking-[-.035em] text-[#163B75] sm:text-4xl">{tier.title}</h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647894]">{tier.description}</p>

                </div>

                <span className="w-fit rounded-full border border-[#D7E3F5] bg-white/70 px-3 py-1.5 text-xs font-bold text-[#526681]">

                  {tier.universities.length} вузов

                </span>

              </div>

              <div className="grid gap-5 lg:grid-cols-2">

                {tier.universities.map((university, index) => {

                  const catalogUniversity = findCatalogUniversity(

                    [university.name, ...university.chineseName.split("·").map((name) => name.trim())],

                    universities,

                  );

                  return (

                    <article key={university.name} className="group overflow-hidden rounded-[24px] border border-[#D7E3F5] bg-[#FFFFFF] shadow-[0_8px_28px_rgba(22,59,117,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#A9C5EE] hover:shadow-[0_20px_46px_rgba(22,59,117,.12)]">

                    {university.imageUrl ? (

                      <div className="relative aspect-[16/8] overflow-hidden bg-[#EAF2FF]">

                        <CoverPhoto src={university.imageUrl} alt={`Кампус ${university.name}`} />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#102D59]/65 via-transparent to-transparent" />

                        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-[#102D59]/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">

                          <MapPin className="h-3 w-3" /> {university.city}

                        </div>

                        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[#163B75] shadow-sm">

                          {String(index + 1).padStart(2, "0")}

                        </span>

                      </div>

                    ) : (

                      <div className="relative flex aspect-[16/8] items-end overflow-hidden bg-[#EAF2FF] p-5">

                        <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full border border-[#A9C5EE]/70" />

                        <div className="absolute -right-1 -top-5 h-36 w-36 rounded-full border border-[#A9C5EE]/50" />

                        <div className="absolute inset-0 bg-gradient-to-br from-[#EAF2FF] via-[#EAF2FF]/55 to-[#C7DBFA]" />

                        <div className="relative flex w-full items-end justify-between gap-4">

                          <div>

                            <div className="text-[11px] font-bold uppercase tracking-[.16em] text-[#647894]">Университетский город</div>

                            <div className="mt-1 text-xl font-semibold text-[#163B75]">{university.city}</div>

                          </div>

                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-xs font-bold text-[#163B75]">{String(index + 1).padStart(2, "0")}</span>

                        </div>

                      </div>

                    )}

                    <div className="p-5 sm:p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                          <h3 className="text-xl font-semibold leading-tight tracking-[-.02em] text-[#163B75]">

                            {catalogUniversity ? (

                              <Link href={`/education/${catalogUniversity.slug}`} className="transition hover:text-[#2563EB]">

                                {university.name}

                              </Link>

                            ) : university.name}

                          </h3>

                          <p className="mt-1 text-xs font-medium leading-5 text-[#647894]">{university.chineseName}</p>

                      </div>

                      <a

                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${university.name} ${university.city} China`)}`}

                        target="_blank"

                        rel="noopener noreferrer"

                        aria-label={`Открыть ${university.name} на карте`}

                        className="flex flex-none items-center gap-1.5 rounded-lg bg-[#EFF6FF] px-2.5 py-2 text-xs font-bold text-[#365783] transition hover:bg-[#DBEAFE] hover:text-[#163B75]"

                      >

                        <MapPin className="h-3.5 w-3.5" /> Карта <ArrowUpRight className="h-3 w-3" />

                      </a>

                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#526681]">

                      <MapPin className="h-4 w-4 text-[#2563EB]" /> {university.city}, Китай

                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#526681]">{university.focus}</p>

                    <div className="mt-5 grid gap-4 border-t border-[#E6EEFA] pt-4 sm:grid-cols-2">

                      <div>

                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#647894]">

                          <BookOpen className="h-4 w-4 text-[#2563EB]" /> Направления

                        </div>

                        <ul className="mt-2 space-y-1.5">

                          {university.programs.map((program) => (

                            <li key={program} className="flex gap-2 text-[13px] leading-5 text-[#526681]">

                              <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-[#2563EB]" /> {program}

                            </li>

                          ))}

                        </ul>

                      </div>

                      <div className="rounded-xl bg-[#F5F8FF] p-3.5">

                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#647894]">

                          <ClipboardList className="h-4 w-4 text-[#2563EB]" /> Важно при поступлении

                        </div>

                        <p className="mt-2 text-[13px] leading-5 text-[#526681]">{university.admissionNote}</p>

                      </div>

                    </div>

                    <div className="mt-4 border-t border-[#E6EEFA] pt-4">

                      {catalogUniversity ? (

                        <Link

                          href={`/education/${catalogUniversity.slug}`}

                          className="inline-flex w-full items-center justify-between gap-2 rounded-xl bg-[#163B75] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#102D59]"

                        >

                          Подробнее о поступлении <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />

                        </Link>

                      ) : (

                        <p className="text-xs leading-5 text-[#647894]">

                          Подробная карточка с фото, видео и актуальными требованиями готовится.

                        </p>

                      )}

                    </div>

                    {university.photoAttribution && university.photoAttributionUrl && (

                      <div className="px-5 pb-4 text-[10px] text-[#647894] sm:px-6">

                        <a href={university.photoAttributionUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">

                          {university.photoAttribution} · Wikimedia Commons

                        </a>

                      </div>

                    )}

                    </div>

                    </article>

                  );

                })}

              </div>

            </div>

          ))}

        </section>

        {otherUniversities.length > 0 && (
          <section id="other-universities" className="mt-16 scroll-mt-28">
            <div className="mb-7 border-b border-[#D7E3F5] pb-5">
              <div className="text-xs font-bold uppercase tracking-[.18em] text-[#647894]">Полный каталог</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-.035em] text-[#163B75] sm:text-4xl">Остальные университеты Китая</h2>
              <p className="mt-2 text-sm leading-6 text-[#647894]">Вузы из базы ZagranEasy, которые не вошли в редакционную подборку выше.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherUniversities.map((university) => (
                <article key={university.id} className="overflow-hidden rounded-2xl border border-[#D7E3F5] bg-white">
                  <div className="h-40 bg-[#EAF2FF]">
                    <CoverPhoto src={university.imageUrl} alt={`Кампус ${university.name}`} label={`Кампус — ${university.city}`} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold leading-tight text-[#163B75]">{university.name}</h3>
                    {university.nameLocal && <p className="mt-1 text-xs text-[#647894]">{university.nameLocal}</p>}
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-[#647894]"><MapPin className="h-4 w-4" />{university.city}</p>
                    {university.description && <p className="mt-2 line-clamp-3 text-sm leading-5 text-[#526681]">{university.description}</p>}
                    {university.specialties.length > 0 && <p className="mt-3 text-xs text-[#647894]">{university.specialties.slice(0, 3).join(" · ")}</p>}
                    <Link href={`/education/${university.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#2563EB] hover:underline">
                      Подробнее <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section id="support" className="mt-20 scroll-mt-28">

          <div className="mb-7 max-w-2xl">

            <div className="text-xs font-bold uppercase tracking-[.18em] text-[#647894]">Сопровождение ZagranEasy</div>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-.035em] text-[#163B75] sm:text-4xl">Чем мы помогаем на пути к поступлению</h2>

            <p className="mt-3 text-sm leading-6 text-[#647894]">Планируем шаги вместе с вами. Состав и стоимость сопровождения зависят от выбранного вуза и необходимых услуг.</p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {supportSteps.map(({ icon: Icon, number, title, description }) => (

              <article key={number} className="rounded-[22px] border border-[#D7E3F5] bg-[#FFFFFF] p-5 shadow-[0_8px_24px_rgba(22,59,117,.045)]">

                <div className="flex items-center justify-between">

                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]"><Icon className="h-5 w-5" /></span>

                  <span className="text-xs font-bold tracking-[.12em] text-[#8AA2C4]">{number}</span>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#163B75]">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-[#526681]">{description}</p>

              </article>

            ))}

          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-[22px] bg-[#163B75] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div>

              <div className="text-xs font-semibold uppercase tracking-[.15em] text-white/65">Первый шаг — консультация</div>

              <p className="mt-1 text-lg font-semibold">Обсудим вашу специальность и подходящий вуз</p>

            </div>

            <a

              href={waUrl("Здравствуйте! Хочу узнать об услугах ZagranEasy для поступления в Китай.")}

              target="_blank"

              rel="noopener noreferrer"

              className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#163B75] transition hover:bg-[#EFF6FF]"

            >

              <MessageCircle className="h-4 w-4" /> Задать вопрос

            </a>

          </div>

        </section>

        <section id="requirements" className="mt-16 scroll-mt-28 overflow-hidden rounded-[26px] bg-[#FFFFFF] shadow-[0_8px_35px_rgba(22,59,117,.06)] ring-1 ring-[#D7E3F5]">

          <div className="grid lg:grid-cols-[.8fr_1.2fr]">

            <div className="bg-[#DBEAFE] p-6 text-[#163B75] sm:p-8">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-[#2563EB]"><ClipboardList className="h-5 w-5" /></div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight">Что обычно нужно для подачи</h2>

              <p className="mt-3 text-sm leading-6 text-[#526681]">

                Это базовый список для подготовки. Университет и факультет могут запросить дополнительные документы, переводы, заверение или вступительные испытания.

              </p>

              <p className="mt-5 rounded-xl border border-[#C9D9F2] bg-white/50 p-3.5 text-xs leading-5 text-[#526681]">

                Сертификат HSK, IELTS или TOEFL не является универсальным требованием для всех вузов: он зависит от языка и условий конкретной программы.

              </p>

            </div>

            <div className="p-6 sm:p-8">

              <ul className="grid gap-3 sm:grid-cols-2">

                {documents.map((document) => (

                  <li key={document} className="flex gap-3 rounded-xl border border-[#E6EEFA] bg-[#F5F8FF] p-3.5 text-sm leading-5 text-[#526681]">

                    <Check className="mt-0.5 h-4 w-4 flex-none text-[#2563EB]" /> {document}

                  </li>

                ))}

              </ul>

              <p className="mt-5 text-xs leading-5 text-[#647894]">

                Перед подачей сверьте дедлайн, список документов, язык программы и стоимость на официальной странице университета. Условия могут обновляться каждый набор.

              </p>

            </div>

          </div>

        </section>

      </div>

    </div>

  );

}
