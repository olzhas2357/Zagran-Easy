import type { Metadata } from "next";
import { ChinaGuide } from "@/components/education/ChinaGuide";
import { fetchAllUniversities, fetchEducationCountries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Университеты Китая: топ-20, программы и поступление | ZagranEasy",
  description:
    "Гид по 20 университетам Китая: Пекинский университет, Цинхуа и другие вузы, направления обучения, требования к поступлению и города на карте.",
  openGraph: {
    title: "Университеты Китая — программы и поступление | ZagranEasy",
    description: "Сравните направления, требования и города 20 университетов Китая.",
    url: "https://zagraneasy.kz/education/china",
  },
};

export default async function ChinaEducationPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const [universities, countries] = await Promise.all([fetchAllUniversities(), fetchEducationCountries()]);
  const chinaCountry = countries.find((country) => country.slug === "china");
  const chinaUniversities = chinaCountry
    ? universities.filter((university) => university.countryId === chinaCountry.id)
    : [];

  return <ChinaGuide universities={chinaUniversities} searchQuery={Array.isArray(q) ? q[0] ?? "" : q ?? ""} />;
}
