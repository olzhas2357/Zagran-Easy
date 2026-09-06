import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentStudent, getMyLessonById } from "@/lib/student-data";
import { getLessonBoard } from "@/lib/lesson-board";
import { LessonBoardPage } from "@/components/lesson/LessonBoardPage";

export default async function StudentLessonBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getCurrentStudent();
  if (!student) redirect("/account/login");
  const lesson = await getMyLessonById(id);
  if (!lesson) notFound();
  const board = await getLessonBoard(id);
  if (!board) notFound();

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-9 sm:px-10 sm:py-11">
        <Link href={`/account/lessons/${id}`} className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Урок
        </Link>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink">Доска: {lesson.title}</h1>
          <p className="mt-1.5 text-[13.5px] text-ze-muted">Доска доступна только для просмотра.</p>
        </div>
        <LessonBoardPage lessonId={id} initialBoard={board} canEdit={false} />
      </div>
    </div>
  );
}
