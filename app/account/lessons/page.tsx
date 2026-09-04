import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentStudent, getMyLessonsSplit } from "@/lib/student-data";
import { StudentLessonsSchedule } from "@/components/account/StudentLessonsSchedule";

export const metadata: Metadata = { title: "Мои уроки — ZagranEasy" };

export default async function StudentLessonsPage() {
  const student = await getCurrentStudent();
  if (!student) redirect("/account/login");

  const { upcoming, past } = await getMyLessonsSplit();

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-4xl px-4 py-9 sm:px-10 sm:py-11">
        <Link href="/account" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Кабинет
        </Link>

        <div className="mt-4">
          <h1 className="text-[23px] font-extrabold tracking-tight sm:text-[30px]">Мои уроки</h1>
          <p className="mt-2 text-[14.5px] text-ze-muted">Расписание онлайн-занятий и ссылки на подключение.</p>
        </div>

        <div className="mt-6">
          <StudentLessonsSchedule upcoming={upcoming} past={past} />
        </div>
      </div>
    </div>
  );
}
