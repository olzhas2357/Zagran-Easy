import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentTeacher, getAssignmentById } from "@/lib/teacher-data";
import { ReviewForm } from "@/components/teacher/ReviewForm";

export default async function TeacherAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const assignment = await getAssignmentById(teacher.id, id);
  if (!assignment) notFound();

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <Link href="/teacher/assignments" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Задания на проверку
      </Link>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="text-[13px] font-semibold text-ze-muted">Ученик</div>
        <div className="mt-1 text-[18px] font-bold text-ze-ink">{assignment.studentName}</div>

        <div className="mt-4 text-[13px] font-semibold text-ze-muted">Задание</div>
        <div className="mt-1 text-[16px] font-semibold text-ze-ink">
          {assignment.taskTitle}
          {assignment.taskType && <span className="ml-2 text-[13px] font-normal text-ze-muted">{assignment.taskType}</span>}
        </div>

        {assignment.taskQuestion && assignment.taskQuestion !== assignment.taskTitle && (
          <p className="mt-2 text-[14.5px] leading-relaxed text-ze-ink">{assignment.taskQuestion}</p>
        )}
      </div>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="text-[13px] font-semibold text-ze-muted">Ответ ученика</div>
        {assignment.answerText ? (
          <div className="mt-2.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ze-ink">{assignment.answerText}</div>
        ) : (
          <div className="mt-2.5 text-[13.5px] text-ze-muted">Текст ответа не найден.</div>
        )}
      </div>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="mb-3.5 text-[13px] font-semibold text-ze-muted">Оценка</div>
        <ReviewForm
          attemptId={assignment.id}
          initialScore={assignment.reviewScore}
          initialComment={assignment.reviewComment}
          initialErrors={assignment.reviewErrors}
          alreadyReviewed={assignment.status === "completed"}
        />
      </div>
    </div>
  );
}
