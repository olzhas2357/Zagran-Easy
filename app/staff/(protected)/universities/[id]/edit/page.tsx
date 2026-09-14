import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getUniversityCatalog, getUniversityForAdmin } from "@/lib/staff-data";
import { fetchEducationCountries } from "@/lib/data";
import { UniversityForm } from "@/components/staff/UniversityForm";
import { UniversityCatalogEditor } from "@/components/admin/UniversityCatalogEditor";

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [university, countries, catalog] = await Promise.all([getUniversityForAdmin(id), fetchEducationCountries(), getUniversityCatalog(id)]);
  if (!university) notFound();

  return (
    <div className="p-5 sm:p-9">
      <Link href="/admin/universities" className="mb-3 flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-muted hover:text-ze-primary">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Назад к списку
      </Link>
      <h1 className="text-[24px] font-extrabold tracking-tight sm:text-[34px]">{university.name}</h1>
      <p className="mt-2 text-[14.5px] text-ze-muted">Изменения сразу применятся на сайте и отметят карточку как проверенную сегодня.</p>

      <UniversityForm countries={countries} university={university} />
      <UniversityCatalogEditor universityId={id} initialCatalog={catalog} />
    </div>
  );
}
