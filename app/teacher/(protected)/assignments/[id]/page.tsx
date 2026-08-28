import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentTeacher, getAssignmentById } from "@/lib/teacher-data";
import { ReviewForm } from "@/components/teacher/ReviewForm";

export default async function TeacherAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const assignment = await getAssignmentById(teacher.id, id);
  if (!assignment) notFound();

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link href="/teacher/assignments" className="text-[13.5px] font-semibold text-ze-primary hover:underline">
        ← Задания на проверку
      </Link>

      <div className="rounded-xl border border-ze-border bg-white p-5">
        <div className="text-[13px] text-ze-muted">Ученик</div>
        <div className="text-[16px] font-bold text-ze-ink">{assignment.studentName}</div>

        <div className="mt-3 text-[13px] text-ze-muted">Задание</div>
        <div className="text-[15px] font-semibold text-ze-ink">
          {assignment.taskTitle}
          {assignment.taskType && <span className="ml-2 text-[12.5px] font-normal text-ze-muted">{assignment.taskType}</span>}
        </div>

        {assignment.taskQuestion && assignment.taskQuestion !== assignment.taskTitle && (
          <p className="mt-2 text-[13.5px] text-ze-ink">{assignment.taskQuestion}</p>
        )}
      </div>

      <div className="rounded-xl border border-ze-border bg-white p-5">
        <div className="text-[13px] font-semibold text-ze-muted">Ответ ученика</div>
        {assignment.answerText ? (
          <div className="mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ze-ink">{assignment.answerText}</div>
        ) : (
          <div className="mt-2 text-[13px] text-ze-muted">Текст ответа не найден.</div>
        )}
      </div>

      <div className="rounded-xl border border-ze-border bg-white p-5">
        <div className="mb-3 text-[13px] font-semibold text-ze-muted">Оценка</div>
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
