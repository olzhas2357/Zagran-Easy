import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentStudent, getMyAssignmentById } from "@/lib/student-data";
import { AssignmentQuestions } from "@/components/account/AssignmentQuestions";

export default async function StudentHomeworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getCurrentStudent();
  if (!student) redirect("/account/login");

  const assignment = await getMyAssignmentById(id);
  if (!assignment) notFound();

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-3xl px-4 py-9 sm:px-10 sm:py-11">
        <Link href="/account/homework" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Домашние задания
        </Link>

        <div className="mt-4">
          <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink sm:text-[24px]">{assignment.taskTitle}</h1>
          {assignment.dueDate && (
            <p className="mt-1.5 text-[13.5px] text-ze-muted">
              Срок: {new Date(assignment.dueDate).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>

        <div className="mt-5">
          <AssignmentQuestions tasks={assignment.tasks} assignmentStatus={assignment.status} />
        </div>
      </div>
    </div>
  );
}
