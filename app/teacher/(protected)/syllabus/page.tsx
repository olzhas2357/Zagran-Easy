import { FileText } from "lucide-react";
import { getTeacherCourses, getTeacherCourseSyllabus } from "@/lib/teacher-data";
import { SyllabusManager } from "@/components/teacher/SyllabusManager";

export default async function TeacherSyllabusPage() {
  const courses = await getTeacherCourses();
  const syllabusEntries = await Promise.all(
    courses.map(async (course) => [course.id, await getTeacherCourseSyllabus(course.id)] as const),
  );

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 text-ze-primary">
          <FileText className="h-5.5 w-5.5" strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Syllabus курса</h1>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ze-muted">Загрузите программу курса один раз — ученики увидят её в своём кабинете.</p>
        </div>
      </div>
      <SyllabusManager
        courses={courses.map(({ id, title }) => ({ id, title }))}
        initialSyllabi={Object.fromEntries(syllabusEntries)}
      />
    </div>
  );
}
