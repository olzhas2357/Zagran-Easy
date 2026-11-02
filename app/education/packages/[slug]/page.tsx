import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PackageModal } from "@/components/education/PackageModal";
import { fetchEducationCountries, fetchEducationPackages } from "@/lib/data";
import { formatTuitionAmount } from "@/lib/education-catalog";
import type { EducationCountry, EducationPackage } from "@/lib/types";

type CountryPackagesPageProps = { params: Promise<{ slug: string }> };

async function getCountryWithPackages(slug: string): Promise<{ country: EducationCountry; packages: EducationPackage[] } | null> {
  const countries = await fetchEducationCountries();
  const country = countries.find((c) => c.slug === slug);
  if (!country) return null;
  const packages = (await fetchEducationPackages()).filter((p) => p.countryId === country.id);
  if (packages.length === 0) return null;
  return { country, packages };
}

export async function generateMetadata({ params }: CountryPackagesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCountryWithPackages(slug);
  if (!data) return {};
  return {
    title: `Пакеты полного сопровождения: ${data.country.name} | ZagranEasy`,
    description: `Пакеты полного сопровождения для поступления в ${data.country.name}: этапы, сроки и стоимость.`,
  };
}

function formatPrice(pkg: EducationPackage): string {
  if (pkg.priceFrom === null || !pkg.priceCurrency) return "Уточняется";
  return ` ${formatTuitionAmount(pkg.priceFrom, pkg.priceCurrency)}`;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-base font-bold uppercase tracking-[0.18em] text-ze-primary">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ze-ink">{title}</h2>
    </div>
  );
}

export default async function CountryPackagesPage({ params }: CountryPackagesPageProps) {
  const { slug } = await params;
  const data = await getCountryWithPackages(slug);
  if (!data) notFound();
  const { country, packages } = data;

  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      <section className="relative isolate overflow-hidden bg-[#0B2A6B] text-white">
        {country.imageUrl?.startsWith("http") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={country.imageUrl} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ze-primary/95 via-[#1F5FD0]/90 to-[#0B2A6B]/95" />
        <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70">
              <Link href="/education" className="transition hover:text-white">Обучение</Link>
              <span aria-hidden="true">/</span>
              <Link href="/education/packages" className="transition hover:text-white">Пакеты</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white" aria-current="page">{country.name}</span>
            </nav>
            <Link href="/education/packages" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20">
              <ArrowLeft className="h-4 w-4" /> Все страны
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4">
            {country.flag && <span className="text-5xl leading-none sm:text-6xl" aria-hidden="true">{country.flag}</span>}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">Пакеты полного сопровождения</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-6xl">{country.name}</h1>
            </div>
          </div>

          {country.description && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">{country.description}</p>}

          <dl className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { label: "Пакетов", value: String(packages.length) },
              { label: "Формат", value: "Помогаем с полным сопровождением" },
              { label: "Сопровождение", value: "От договора до выезда" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <dt className="text-sm font-semibold text-white/70">{stat.label}</dt>
                <dd className="mt-1 text-xl font-extrabold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
        <section>
          <SectionTitle eyebrow="Программы" title="Выберите пакет" />
          <div className="grid gap-6 lg:grid-cols-2">
            {packages.map((pkg) => (
              <PackageModal
                key={pkg.id}
                pkg={pkg}
                price={formatPrice(pkg)}
                extraCostsText={pkg.extraCosts.map((cost) => `${cost.title}${cost.amount !== null && cost.currency ? ` · ${formatTuitionAmount(cost.amount, cost.currency)}` : ""}${cost.period ? ` · ${cost.period}` : ""}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
