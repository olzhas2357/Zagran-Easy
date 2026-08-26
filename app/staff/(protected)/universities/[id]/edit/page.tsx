import Link from "next/link";
import { notFound } from "next/navigation";
import { getUniversityForAdmin } from "@/lib/staff-data";
import { fetchEducationCountries } from "@/lib/data";
import { UniversityForm } from "@/components/staff/UniversityForm";

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [university, countries] = await Promise.all([getUniversityForAdmin(id), fetchEducationCountries()]);
  if (!university) notFound();

  return (
    <div className="p-6 sm:p-9">
      <Link href="/staff/universities" className="mb-3 inline-block text-[13.5px] font-semibold text-ze-muted hover:text-ze-primary">
        ← Назад к списку
      </Link>
      <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">{university.name}</h1>
      <p className="mt-2 text-[14px] text-ze-muted">Изменения сразу применятся на сайте и отметят карточку как проверенную сегодня.</p>

      <UniversityForm countries={countries} university={university} />
    </div>
  );
}
