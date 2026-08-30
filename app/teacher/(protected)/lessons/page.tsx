import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentTeacher, getLessonsSplit } from "@/lib/teacher-data";
import { LessonsSchedule } from "@/components/teacher/LessonsSchedule";

export default async function TeacherLessonsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const { upcoming, past } = await getLessonsSplit(teacher.id);

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Мои уроки</h1>
          <p className="mt-1.5 text-[14.5px] text-ze-muted">Расписание и история занятий.</p>
        </div>
        <Link
          href="/teacher/lessons/new"
          className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2} />
          Создать урок
        </Link>
      </div>

      <LessonsSchedule upcoming={upcoming} past={past} />
    </div>
  );
}
