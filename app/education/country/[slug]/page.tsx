import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Award, BedDouble, GraduationCap, Languages, MapPin } from "lucide-react";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { formatTuition, formatTuitionAmount, formatUniversityCount } from "@/lib/education-catalog";
import type { EducationCountry, University } from "@/lib/types";

type CountryPageProps = PageProps<"/education/country/[slug]">;

const SOUTH_KOREA_ALIASES = new Set([
  "korea",
  "south-korea",
  "southkorea",
  "republic-of-korea",
  "korea-republic-of",
  "korea-south",
  "kr",
  "대한민국",
  "한국",
]);

const SOUTH_KOREA_DESCRIPTION =
  "Республика Корея (кор. 대한민국 — Тэханмингук) — суверенное государство, расположенное в южной части Корейского полуострова. Это экономически развитая индустриальная держава и один из технологических, инновационных и культурных центров Азии.";

const southKoreaFallback: EducationCountry = {
  id: "south-korea",
  slug: "south-korea",
  name: "Южная Корея",
  nameEn: "South Korea",
  flag: "🇰🇷",
  continent: "Asia",
  cities: ["Сеул", "Пусан", "Тэджон", "Тэгу"],
  description: "Южная Корея — страна в Восточной Азии.",
  longDescription: "",
  badgeColor: "blue",
  imageUrl: "",
  heroImageUrl: "",
  universityCount: 0,
  features: [],
  isActive: true,
  sortOrder: 0,
};

function normalizeCountrySlug(value: string): string {
  return value.toLocaleLowerCase("en").trim().replace(/[_\s,]+/g, "-").replace(/-+/g, "-");
}

function isSouthKoreaCountry(country: EducationCountry): boolean {
  return [country.slug, country.name, country.nameEn].some((value) =>
    SOUTH_KOREA_ALIASES.has(normalizeCountrySlug(value)),
  );
}

function findCountryBySlug(countries: EducationCountry[], slug: string): EducationCountry | null {
  const normalizedSlug = normalizeCountrySlug(slug);
  const isSouthKoreaSlug = SOUTH_KOREA_ALIASES.has(normalizedSlug);
  const country = countries.find((item) =>
    isSouthKoreaSlug
      ? isSouthKoreaCountry(item)
      : [item.slug, item.name, item.nameEn].some((name) => normalizeCountrySlug(name) === normalizedSlug),
  );
  if (country) return country;
  return isSouthKoreaSlug ? southKoreaFallback : null;
}

async function getCountry(slug: string) {
  const countries = await fetchEducationCountries();
  return findCountryBySlug(countries, slug);
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountry(slug);
  if (!country) return {};
  const isSouthKorea = SOUTH_KOREA_ALIASES.has(normalizeCountrySlug(slug)) || isSouthKoreaCountry(country);

  return {
    title: `Университеты ${country.name}: поступление и каталог | ZagranEasy`,
    description: isSouthKorea
      ? SOUTH_KOREA_DESCRIPTION
      : country.longDescription || country.description || `Университеты ${country.name}: программы и информация о поступлении.`,
  };
}

function UniversityCard({ university, position }: { university: University; position: number }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_44px_rgba(15,23,42,.11)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 to-slate-100">
        <CoverPhoto src={university.imageUrl} alt={`Кампус ${university.name}`} label={`Кампус — ${university.city}`} className="transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />
        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-bold text-ze-primary shadow-sm backdrop-blur">
          {university.rankingNational ? `Рейтинг #${university.rankingNational}` : `Подборка ${position}`}
        </span>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white drop-shadow">
          <MapPin className="h-4 w-4" /> {university.city}
        </span>
      </div>
      <div className="flex min-h-[330px] flex-col p-5 sm:min-h-[360px] sm:p-6">
        <h3 className="text-lg font-extrabold leading-tight tracking-tight text-ze-ink sm:text-xl">{university.name}</h3>
        {university.nameLocal && <p className="mt-1.5 text-sm text-ze-muted">{university.nameLocal}</p>}
        {university.description && <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{university.description}</p>}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <Languages className="h-3.5 w-3.5" /> Язык обучения
            </div>
            <p className="mt-1.5 text-sm font-semibold text-slate-700">
              {university.languages.length > 0 ? university.languages.slice(0, 2).join(", ") : "Уточняется"}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <BedDouble className="h-3.5 w-3.5" /> Общежитие
            </div>
            <p className="mt-1.5 text-sm font-semibold text-slate-700">
              {university.hasDormitory ? "Есть" : "Не указано"}
              {university.hasDormitory && university.dormitoryCost > 0
                ? ` · ${formatTuitionAmount(university.dormitoryCost, university.dormitoryCurrency)}/мес`
                : ""}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">IELTS</p>
            <p className="mt-1.5 text-sm font-semibold text-slate-700">
              {university.ieltsRequired ? "Требуется" : "Не требуется"}
            </p>
          </div>
        </div>
        {university.grantDetails && (
          <div className="mt-3 flex gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
            <Award className="mt-0.5 h-4 w-4 flex-none text-emerald-700" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-800">{university.hasGrant ? "Гранты и стипендии" : "Информация о грантах"}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-emerald-900/80">{university.grantDetails}</p>
            </div>
          </div>
        )}
        {university.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {university.specialties.slice(0, 4).map((specialty) => (
              <span key={specialty} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">{specialty}</span>
            ))}
          </div>
        )}
        {university.requirements.length > 0 && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
            <span className="font-bold text-slate-600">Для поступления: </span>
            {university.requirements.slice(0, 3).join(", ")}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Обучение от</span>
            <div className="mt-1 text-sm font-extrabold text-ze-ink">{formatTuition(university.tuitionFrom, university.tuitionCurrency)}</div>
          </div>
          <Link href={`/education/${university.slug}`} className="inline-flex items-center gap-1.5 rounded-xl bg-[#EBF1FE] px-3.5 py-2.5 text-sm font-bold text-ze-primary transition group-hover:bg-ze-primary group-hover:text-white">
            Подробнее <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CountryLinks({ countries, universities, current }: { countries: EducationCountry[]; universities: University[]; current: EducationCountry }) {
  const availableCountries = countries
    .filter((country) =>
      country.id !== current.id && universities.some((university) => university.isActive && university.countryId === country.id),
    )
    .map((country) => ({
      ...country,
      count: universities.filter((university) => university.isActive && university.countryId === country.id).length,
    }));
  if (availableCountries.length === 0) return null;

  return (
    <nav aria-label="Страницы других стран" className="mt-16 border-t border-slate-200 pt-9 sm:mt-20 sm:pt-11">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Продолжите выбор</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ze-ink sm:text-3xl">Другие страны</h2>
        <p className="mt-2 text-sm leading-6 text-ze-muted">Сравните направления и найдите страну, которая подходит именно вам.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableCountries.map((country) => (
          <Link
            key={country.id}
            href={country.slug === "china" ? "/education/china" : `/education/country/${country.slug}`}
            className="group relative isolate flex min-h-48 flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200 bg-slate-900 p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,.17)] sm:min-h-52 sm:p-6"
          >
            {(country.heroImageUrl.startsWith("http") || country.imageUrl.startsWith("http")) && (
              <CoverPhoto
                src={country.heroImageUrl.startsWith("http") ? country.heroImageUrl : country.imageUrl}
                alt=""
                className="absolute inset-0 -z-20 transition duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/80 via-slate-900/55 to-blue-950/75" />
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
              <p className="mt-2 text-sm font-medium text-white/80">
                {formatUniversityCount(country.count)}
                {country.cities.length > 0 && ` · ${country.cities.slice(0, 3).join(", ")}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default async function CountryEducationPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const [countries, universities] = await Promise.all([fetchEducationCountries(), fetchAllUniversities()]);
  const country = findCountryBySlug(countries, slug);
  if (!country) notFound();

  const isSouthKorea = SOUTH_KOREA_ALIASES.has(normalizeCountrySlug(slug)) || isSouthKoreaCountry(country);
  const countryDescription = isSouthKorea
    ? SOUTH_KOREA_DESCRIPTION
    : country.longDescription || country.description;
  const matchingCountryIds = new Set(
    countries
      .filter((item) => isSouthKorea && isSouthKoreaCountry(item))
      .map((item) => item.id),
  );
  matchingCountryIds.add(country.id);
  const countryUniversities = universities
    .filter((university) => university.isActive && matchingCountryIds.has(university.countryId))
    .sort((a, b) => {
      const rankDifference = (a.rankingNational ?? Number.MAX_SAFE_INTEGER) - (b.rankingNational ?? Number.MAX_SAFE_INTEGER);
      return rankDifference || a.sortOrder - b.sortOrder;
    });
  const universitiesByCity = new Map<string, University[]>();
  for (const university of countryUniversities) {
    const cityUniversities = universitiesByCity.get(university.city) ?? [];
    cityUniversities.push(university);
    universitiesByCity.set(university.city, cityUniversities);
  }
  const cities = [...new Set([...country.cities, ...universitiesByCity.keys()])];
  const featured = countryUniversities.slice(0, 20);
  const remaining = countryUniversities.slice(20);
  const countryHeroImage = country.heroImageUrl || country.imageUrl;
  const totalPrograms = countryUniversities.reduce((total, university) => total + university.programsCount, 0);

  return (
    <main className="min-h-screen bg-[#F5F8FD] pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <div className="pt-6">
          <Link href="/education" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-ze-primary">
            <ArrowLeft className="h-4 w-4" /> Все страны
          </Link>
        </div>
        <header className="relative isolate mt-5 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#12336A] via-[#16458E] to-[#2872C8] text-white shadow-[0_24px_65px_rgba(22,59,117,.2)] sm:rounded-[36px]">
          {countryHeroImage.startsWith("http") && (
            <CoverPhoto src={countryHeroImage} alt={`Пейзаж страны ${country.name}`} loading="eager" className="absolute inset-0 -z-20 opacity-55" />
          )}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(8,29,67,.92)_0%,rgba(13,48,101,.82)_52%,rgba(20,69,137,.48)_100%)]" />
          <div className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full border border-white/10 sm:right-8 sm:top-[-14rem]" />
          <div className="absolute -right-10 -top-20 -z-10 h-72 w-72 rounded-full border border-white/10 sm:right-20 sm:top-[-10rem]" />
          <div className="relative grid gap-8 px-6 py-8 sm:px-10 sm:py-11 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-white/85 backdrop-blur">
                <GraduationCap className="h-4 w-4" /> Обучение за рубежом
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.04] tracking-tight text-balance sm:text-6xl">
                Учёба в {country.name}
              </h1>
              {countryDescription && (
                <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-7 text-blue-50/90 sm:text-lg">
                  {countryDescription}
                </p>
              )}
              {country.features.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {country.features.map((feature) => (
                    <li key={feature} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur sm:text-sm">{feature}</li>
                  ))}
                </ul>
              )}
              <Link href="#universities" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-[#153B78] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50">
                Смотреть университеты <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[330px]">
              {[
                [String(countryUniversities.length), "университетов"],
                [String(cities.length), "городов"],
                [totalPrograms.toLocaleString("ru-RU"), "программ"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4 text-center backdrop-blur-md sm:px-4 sm:py-5">
                  <div className="text-lg font-extrabold leading-tight sm:text-2xl">{value}</div>
                  <div className="mt-1.5 text-[11px] font-semibold text-blue-100/85 sm:text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {cities.length > 0 && (
          <section aria-labelledby="study-cities" className="pt-12 sm:pt-16">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Выберите город</div>
                <h2 id="study-cities" className="mt-1 text-2xl font-extrabold tracking-tight text-ze-ink sm:text-3xl">Города для учёбы</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-ze-muted">
                Сравните города по университетам и направлениям, представленным в каталоге.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => {
                const cityUniversities = universitiesByCity.get(city) ?? [];
                const specialties = [...new Set(cityUniversities.flatMap((university) => university.specialties))].slice(0, 3);
                return (
                  <article key={city} className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_32px_rgba(15,23,42,.08)] sm:p-6">
                    <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-50 transition group-hover:scale-125" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold tracking-tight text-ze-ink">{city}</h3>
                        <p className="mt-2 text-sm text-ze-muted">
                          {cityUniversities.length > 0
                            ? formatUniversityCount(cityUniversities.length)
                            : "Город в списке направлений"}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-ze-primary">
                        <MapPin className="h-5 w-5" />
                      </span>
                    </div>
                    {specialties.length > 0 && (
                      <div className="relative mt-4 flex flex-wrap gap-1.5">
                        {specialties.map((specialty) => (
                          <span key={specialty} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{specialty}</span>
                        ))}
                      </div>
                    )}
                    {cityUniversities.length > 0 && (
                      <ul className="relative mt-4 space-y-2 border-t border-slate-100 pt-3">
                        {cityUniversities.slice(0, 2).map((university) => (
                          <li key={university.id}>
                            <Link href={`/education/${university.slug}`} className="text-sm font-semibold text-ze-primary hover:underline">
                              {university.name}
                            </Link>
                          </li>
                        ))}
                        {cityUniversities.length > 2 && (
                          <li className="text-xs font-medium text-ze-muted">И ещё {formatUniversityCount(cityUniversities.length - 2)}</li>
                        )}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section id="universities" aria-labelledby="top-universities" className="pt-14 sm:pt-20">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Подборка вузов</div>
              <h2 id="top-universities" className="mt-1 text-2xl font-extrabold tracking-tight text-ze-ink sm:text-3xl">Университеты {country.name}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ze-muted">
              Сначала указаны вузы с сохранённым национальным рейтингом; остальные упорядочены по редакционному порядку каталога. Номер подборки не является рейтингом.
            </p>
          </div>
          {featured.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((university, index) => <UniversityCard key={university.id} university={university} position={index + 1} />)}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ze-muted">
              В каталоге пока нет университетов этой страны.
            </p>
          )}
        </section>

        {remaining.length > 0 && (
          <section aria-labelledby="other-universities" className="mt-14">
            <div className="mb-5">
              <h2 id="other-universities" className="text-2xl font-extrabold sm:text-3xl">Остальные университеты</h2>
              <p className="mt-2 text-sm text-ze-muted">Ещё {remaining.length} {remaining.length === 1 ? "университет" : "университетов"} из общего каталога.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {remaining.map((university, index) => <UniversityCard key={university.id} university={university} position={featured.length + index + 1} />)}
            </div>
          </section>
        )}

        <CountryLinks countries={countries} universities={universities} current={country} />
      </div>
    </main>
  );
}
