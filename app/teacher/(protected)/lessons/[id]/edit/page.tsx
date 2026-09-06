import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentTeacher, getLessonById, getStudentsForSelect, getTaskBank } from "@/lib/teacher-data";
import { LessonForm } from "@/components/teacher/LessonForm";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const lesson = await getLessonById(teacher.id, id);
  if (!lesson) notFound();

  const [students, tasks] = await Promise.all([getStudentsForSelect(teacher.id), getTaskBank()]);

  return (
    <div className="p-5 sm:p-8">
      <Link
        href={`/teacher/lessons/${lesson.id}`}
        className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Урок
      </Link>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Редактировать урок</h1>
      <LessonForm
        students={students}
        tasks={tasks}
        lesson={{
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          scheduledAt: lesson.scheduledAt,
          durationMinutes: lesson.durationMinutes,
          studentIds: lesson.studentIds,
          meetingUrl: lesson.meetingUrl,
          meetingProvider: lesson.meetingProvider,
          materials: lesson.materials,
          homeworkTaskIds: lesson.homeworkTaskIds,
        }}
      />
    </div>
  );
}
