import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TaskForm } from "@/components/teacher/TaskForm";

export default function NewTaskPage() {
  return (
    <div className="p-5 sm:p-8">
      <Link href="/teacher/tasks" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Банк заданий
      </Link>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Создать задание</h1>
      <TaskForm />
    </div>
  );
}
