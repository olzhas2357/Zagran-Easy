import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";
import { formatTuition } from "@/lib/education-catalog";
import type { EducationCountry, University } from "@/lib/types";

type CountryPageProps = PageProps<"/education/country/[slug]">;

async function getCountry(slug: string) {
  const countries = await fetchEducationCountries();
  return countries.find((country) => country.slug === slug) ?? null;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountry(slug);
  if (!country) return {};

  return {
    title: `Университеты ${country.name}: поступление и каталог | ZagranEasy`,
    description: country.longDescription || country.description || `Университеты ${country.name}: программы и информация о поступлении.`,
  };
}

function UniversityCard({ university, position }: { university: University; position: number }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-ze-border bg-white shadow-sm">
      <div className="relative h-44 bg-slate-100">
        <CoverPhoto src={university.imageUrl} alt={`Кампус ${university.name}`} label={`Кампус — ${university.city}`} />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ze-primary shadow-sm">
          {university.rankingNational ? `Рейтинг #${university.rankingNational}` : `Подборка ${position}`}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-extrabold leading-tight text-ze-ink">{university.name}</h3>
        {university.nameLocal && <p className="mt-1 text-sm text-ze-muted">{university.nameLocal}</p>}
        <p className="mt-3 flex items-center gap-1.5 text-sm text-ze-muted"><MapPin className="h-4 w-4" />{university.city}</p>
        {university.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{university.description}</p>}
        {university.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {university.specialties.slice(0, 4).map((specialty) => (
              <span key={specialty} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{specialty}</span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-sm font-bold">{formatTuition(university.tuitionFrom, university.tuitionCurrency)}</span>
          <Link href={`/education/${university.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-ze-primary hover:underline">
            Подробнее <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CountryLinks({ countries, universities, current }: { countries: EducationCountry[]; universities: University[]; current: EducationCountry }) {
  const availableCountries = countries.filter((country) =>
    country.id !== current.id && universities.some((university) => university.isActive && university.countryId === country.id),
  );
  if (availableCountries.length === 0) return null;

  return (
    <nav aria-label="Страницы других стран" className="mt-12 border-t border-ze-border pt-7">
      <h2 className="text-lg font-extrabold">Другие страны</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {availableCountries.map((country) => (
          <Link key={country.id} href={country.slug === "china" ? "/education/china" : `/education/country/${country.slug}`} className="rounded-full border border-ze-border bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-ze-primary hover:text-ze-primary">
            {country.flag} {country.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default async function CountryEducationPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const [countries, universities] = await Promise.all([fetchEducationCountries(), fetchAllUniversities()]);
  const country = countries.find((item) => item.slug === slug);
  if (!country) notFound();

  const countryUniversities = universities
    .filter((university) => university.isActive && university.countryId === country.id)
    .sort((a, b) => {
      const rankDifference = (a.rankingNational ?? Number.MAX_SAFE_INTEGER) - (b.rankingNational ?? Number.MAX_SAFE_INTEGER);
      return rankDifference || a.sortOrder - b.sortOrder;
    });
  const featured = countryUniversities.slice(0, 20);
  const remaining = countryUniversities.slice(20);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F7FE] to-white">
      <header className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-10 sm:py-12">
          <Link href="/education" className="inline-flex items-center gap-2 text-sm font-semibold text-ze-muted hover:text-ze-primary">
            <ArrowLeft className="h-4 w-4" /> Общий каталог
          </Link>
          <div className="mt-7 flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{country.flag}</span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-ze-primary">Обучение за рубежом</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">Университеты {country.name}</h1>
            </div>
          </div>
          {(country.longDescription || country.description) && (
            <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-7 text-slate-600">
              {country.longDescription || country.description}
            </p>
          )}
          {country.features.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {country.features.map((feature) => (
                <li key={feature} className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">{feature}</li>
              ))}
            </ul>
          )}
          {country.cities.length > 0 && <p className="mt-4 text-sm text-ze-muted">Популярные города: {country.cities.join(", ")}</p>}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-12">
        <section aria-labelledby="top-universities">
          <div className="mb-5">
            <h2 id="top-universities" className="text-2xl font-extrabold sm:text-3xl">Топ-20 университетов</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ze-muted">
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
