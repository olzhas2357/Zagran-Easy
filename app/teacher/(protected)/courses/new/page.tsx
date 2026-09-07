import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { CourseForm } from "@/components/teacher/CourseForm";

export default function NewTeacherCoursePage() {
  return (
    <div className="flex flex-col gap-5 p-5 sm:p-8">
      <Link href="/teacher/courses" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Мои курсы
      </Link>
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-blue-50 text-ze-primary">
          <GraduationCap className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Создать курс</h1>
          <p className="mt-1.5 text-[14px] text-ze-muted">После создания курс будет доступен по адресу `/courses/slug`.</p>
        </div>
      </div>
      <CourseForm />
    </div>
  );
}
