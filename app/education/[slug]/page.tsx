import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchEducationCountries, fetchEducationCountry, fetchUniversities } from "@/lib/data";
import { CountryHero } from "@/components/education/CountryHero";
import { UniversityList } from "@/components/education/UniversityList";
import { RequirementsGrid } from "@/components/education/RequirementsGrid";
import { FadeIn } from "@/components/ui/FadeIn";
import { waUrl } from "@/lib/utils";
import { EDUCATION_PHONE } from "@/lib/constants";
import { getRequirementsBySlug, getCountryNameInCase } from "@/data/education-requirements";

export async function generateStaticParams() {
  const countries = await fetchEducationCountries();
  return countries.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/education/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const country = await fetchEducationCountry(slug);
  if (!country) return {};

  return {
    title: `Обучение в ${getCountryNameInCase(slug, country.name)} — ZagranEasy`,
    description: country.description,
  };
}

export default async function CountryPage(props: PageProps<"/education/[slug]">) {
  const { slug } = await props.params;
  const country = await fetchEducationCountry(slug);
  if (!country) notFound();

  const universities = await fetchUniversities(country);
  const cities = Array.from(new Set(universities.map((u) => u.city))).sort();
  const nameIn = getCountryNameInCase(slug, country.name);

  return (
    <main>
      <CountryHero country={country} />
      <UniversityList universities={universities} cities={cities} countryName={country.name} />
      <RequirementsGrid countryName={nameIn} items={getRequirementsBySlug(slug)} />

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <FadeIn>
          <div className="rounded-3xl bg-slate-900 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-semibold text-white">
              Хотите учиться в {nameIn}? Начните с бесплатной консультации
            </h2>
            <a
              href={waUrl(
                `Здравствуйте! Хочу бесплатную консультацию по обучению в ${nameIn}.`,
                EDUCATION_PHONE
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Получить консультацию →
            </a>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
