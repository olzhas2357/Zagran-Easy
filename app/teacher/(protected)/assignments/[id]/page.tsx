import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { getCurrentTeacher, getAssignmentById } from "@/lib/teacher-data";
import { ReviewForm } from "@/components/teacher/ReviewForm";

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

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

      {/* Compact identity header instead of a full labeled-field card */}
      <div className="flex items-center gap-3.5 rounded-[20px] border border-ze-border bg-white p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ze-surface text-[13px] font-bold text-ze-ink">
          {assignment.studentName ? initials(assignment.studentName) : <User className="h-5 w-5 text-ze-muted" strokeWidth={1.75} />}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[16px] font-bold text-ze-ink">{assignment.studentName}</div>
          <div className="truncate text-[13px] text-ze-muted">
            {assignment.taskTitle}
            {assignment.taskType && ` · ${assignment.taskType}`}
          </div>
        </div>
      </div>

      {/* Grading split: content to review on the left, grading action sticky on the right */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-5">
          {assignment.taskQuestion && assignment.taskQuestion !== assignment.taskTitle && (
            <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="text-[13px] font-semibold text-ze-muted">Задание</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ze-ink">{assignment.taskQuestion}</p>
            </div>
          )}

          <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="text-[13px] font-semibold text-ze-muted">Ответ ученика</div>
            {assignment.answerText ? (
              <div className="mt-2.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ze-ink">{assignment.answerText}</div>
            ) : (
              <div className="mt-2.5 text-[13.5px] text-ze-muted">Текст ответа не найден.</div>
            )}
          </div>
        </div>

        <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6 lg:sticky lg:top-6">
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
    </div>
  );
}
