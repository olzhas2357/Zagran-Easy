import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentTeacher, getLessonById } from "@/lib/teacher-data";
import { getLessonBoard } from "@/lib/lesson-board";
import { LessonBoardPage } from "@/components/lesson/LessonBoardPage";

export default async function TeacherLessonBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;
  const lesson = await getLessonById(teacher.id, id);
  if (!lesson) notFound();
  const board = await getLessonBoard(id);
  if (!board) notFound();

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-8">
      <Link href={`/teacher/lessons/${id}`} className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Урок
      </Link>
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink">Доска: {lesson.title}</h1>
        <p className="mt-1.5 text-[13.5px] text-ze-muted">Записывать и рисовать могут только учителя.</p>
      </div>
      <LessonBoardPage lessonId={id} initialBoard={board} canEdit />
    </div>
  );
}
