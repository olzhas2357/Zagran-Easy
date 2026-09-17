import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UniversityExperience } from "@/components/education/UniversityExperience";
import { fetchAllUniversities, fetchEducationCountries, fetchUniversityBySlug, fetchUniversityCatalogBySlug } from "@/lib/data";

export async function generateStaticParams() {
  const universities = await fetchAllUniversities();
  return universities.map((university) => ({ slug: university.slug }));
}

export async function generateMetadata(props: PageProps<"/education/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const university = await fetchUniversityBySlug(slug);
  if (!university) return {};

  const description = `Информация о ${university.name}: программы обучения, стоимость, требования, гранты и условия поступления.`;
  return {
    title: `${university.name} — программы, стоимость и поступление | ZagranEasy`,
    description,
    openGraph: {
      title: `${university.name} | ZagranEasy`,
      description,
      images: university.imageUrl ? [{ url: university.imageUrl, alt: university.name }] : undefined,
    },
  };
}

export default async function UniversityPage(props: PageProps<"/education/[slug]">) {
  const { slug } = await props.params;
  const [university, countries, catalog, allUniversities] = await Promise.all([
    fetchUniversityBySlug(slug),
    fetchEducationCountries(),
    fetchUniversityCatalogBySlug(slug),
    fetchAllUniversities(),
  ]);
  if (!university) notFound();

  const country = countries.find((item) => item.id === university.countryId);
  const related = allUniversities
    .filter((item) => item.id !== university.id && item.countryId === university.countryId)
    .sort((a, b) => Math.abs(a.tuitionFrom - university.tuitionFrom) - Math.abs(b.tuitionFrom - university.tuitionFrom))
    .slice(0, 3);

  return <UniversityExperience university={university} catalog={catalog} country={country ?? null} related={related} />;
}
