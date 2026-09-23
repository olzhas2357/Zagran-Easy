import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
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

        {assignment.status === "completed" && assignment.xpAwarded > 0 && (
          <div className="mt-5 flex items-center gap-3 rounded-[18px] border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-3.5 text-blue-900">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white shadow-sm">
              <Sparkles className="h-5 w-5 text-ze-primary" />
            </span>
            <div>
              <div className="text-[14px] font-bold">Домашняя работа завершена</div>
              <div className="mt-0.5 text-[13px] text-blue-700">Начислено +{assignment.xpAwarded} XP</div>
            </div>
          </div>
        )}

        <div className="mt-5">
          <AssignmentQuestions tasks={assignment.tasks} assignmentStatus={assignment.status} />
        </div>
      </div>
    </div>
  );
}
