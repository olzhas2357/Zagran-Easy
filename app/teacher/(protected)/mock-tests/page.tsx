import Link from "next/link";
import { Plus } from "lucide-react";
import { getManagedMockTests } from "@/lib/mock-test-manage-data";
import { MockTestsTable } from "@/components/teacher/MockTestsTable";

export default async function TeacherMockTestsPage() {
  const tests = await getManagedMockTests();

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Mock tests</h1>
          <p className="mt-1 text-sm text-ze-muted">Пробные экзамены IELTS и HSK из заданий базы знаний. Тесты общие для всех преподавателей.</p>
        </div>
        <Link href="/teacher/mock-tests/new" className="flex items-center gap-1.5 rounded-xl bg-ze-primary px-4 py-2.5 text-[14px] font-bold text-white">
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Создать тест
        </Link>
      </div>
      <MockTestsTable tests={tests} />
    </div>
  );
}
