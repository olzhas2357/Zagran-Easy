import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchEducationCountries } from "@/lib/data";
import { UniversityForm } from "@/components/staff/UniversityForm";

export default async function NewUniversityPage() {
  const countries = await fetchEducationCountries();

  return (
    <div className="p-5 sm:p-9">
      <Link href="/staff/universities" className="mb-3 flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-muted hover:text-ze-primary">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Назад к списку
      </Link>
      <h1 className="text-[24px] font-extrabold tracking-tight sm:text-[34px]">Новый университет</h1>
      <p className="mt-2 text-[14.5px] text-ze-muted">Заполните карточку вуза — она сразу появится в базе и на сайте.</p>

      <UniversityForm countries={countries} />
    </div>
  );
}
