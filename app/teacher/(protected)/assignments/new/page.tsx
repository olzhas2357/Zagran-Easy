import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentTeacher, getStudentsForSelect, getTasks } from "@/lib/teacher-data";
import { AssignmentForm } from "@/components/teacher/AssignmentForm";

export default async function NewAssignmentPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const [students, tasks] = await Promise.all([getStudentsForSelect(teacher.id), getTasks()]);

  return (
    <div className="p-5 sm:p-8">
      <Link href="/teacher/assignments" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Задания на проверку
      </Link>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Назначить задание</h1>
      <AssignmentForm students={students} tasks={tasks} />
    </div>
  );
}
