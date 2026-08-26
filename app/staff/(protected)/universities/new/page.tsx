import Link from "next/link";
import { fetchEducationCountries } from "@/lib/data";
import { UniversityForm } from "@/components/staff/UniversityForm";

export default async function NewUniversityPage() {
  const countries = await fetchEducationCountries();

  return (
    <div className="p-6 sm:p-9">
      <Link href="/staff/universities" className="mb-3 inline-block text-[13.5px] font-semibold text-ze-muted hover:text-ze-primary">
        ← Назад к списку
      </Link>
      <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Новый университет</h1>
      <p className="mt-2 text-[14px] text-ze-muted">Заполните карточку вуза — она сразу появится в базе и на сайте.</p>

      <UniversityForm countries={countries} />
    </div>
  );
}
