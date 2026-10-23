import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentStudent } from "@/lib/student-data";
import { getMockTest } from "@/lib/mock-test-data";
import { MockTestRunner } from "@/components/account/MockTestRunner";

export default async function StudentMockTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getCurrentStudent();
  if (!student) redirect("/account/login");

  const test = await getMockTest(id);
  if (!test) notFound();

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-3xl px-4 py-9 sm:px-10 sm:py-11">
        <Link href="/account/mock-test" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Mock test
        </Link>
        <h1 className="mb-5 mt-4 text-[22px] font-extrabold tracking-tight text-ze-ink sm:text-[24px]">{test.title}</h1>
        <MockTestRunner test={test} />
      </div>
    </div>
  );
}
