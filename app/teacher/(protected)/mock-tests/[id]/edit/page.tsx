import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTaskBank } from "@/lib/teacher-data";
import { getManagedMockTest } from "@/lib/mock-test-manage-data";
import { MockTestForm } from "@/components/teacher/MockTestForm";

export default async function EditMockTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [test, tasks] = await Promise.all([getManagedMockTest(id), getTaskBank()]);
  if (!test) notFound();

  return (
    <div className="p-5 sm:p-8">
      <Link href="/teacher/mock-tests" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Mock tests
      </Link>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Изменить mock test</h1>
      <MockTestForm tasks={tasks} test={test} />
    </div>
  );
}
