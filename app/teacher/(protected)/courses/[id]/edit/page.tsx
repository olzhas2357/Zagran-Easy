import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTeacherCourse } from "@/lib/teacher-data";
import { CourseForm } from "@/components/teacher/CourseForm";

export default async function EditTeacherCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getTeacherCourse(id);
  if (!course) notFound();

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-8">
      <Link href="/teacher/courses" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Мои курсы
      </Link>
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Редактирование курса</h1>
        <p className="mt-1.5 text-[14px] text-ze-muted">Обновите программу, метаданные и разделы курса.</p>
      </div>
      <CourseForm initial={course} />
    </div>
  );
}