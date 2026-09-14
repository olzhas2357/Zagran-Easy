import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UniversityImport } from "@/components/admin/UniversityImport";
import { getUniversityImportHistory } from "@/lib/staff-data";

export default async function UniversityImportPage() {
  const history = await getUniversityImportHistory();
  return <div className="p-5 sm:p-9"><Link href="/admin/universities" className="flex w-fit items-center gap-1.5 text-[13px] font-semibold text-ze-muted"><ArrowLeft className="h-4 w-4" />Назад к университетам</Link><h1 className="mt-3 text-[24px] font-extrabold sm:text-[34px]">Импорт университетов</h1><p className="mt-2 text-[14px] text-ze-muted">Проверьте предпросмотр и сопоставление колонок до записи в базу.</p><UniversityImport initialHistory={history} /></div>;
}
