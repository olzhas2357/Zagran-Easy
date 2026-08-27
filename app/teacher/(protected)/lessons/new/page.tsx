import Link from "next/link";
import { getCurrentTeacher, getStudentsForSelect, getTaskBank } from "@/lib/teacher-data";
import { LessonForm } from "@/components/teacher/LessonForm";

export default async function NewLessonPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const [students, tasks] = await Promise.all([getStudentsForSelect(teacher.id), getTaskBank()]);

  return (
    <div className="p-6">
      <Link href="/teacher/lessons" className="text-[13.5px] font-semibold text-ze-primary hover:underline">
        ← Мои уроки
      </Link>
      <h1 className="mt-3 text-[22px] font-extrabold tracking-tight text-ze-ink">Создать урок</h1>
      <LessonForm students={students} tasks={tasks} />
    </div>
  );
}
