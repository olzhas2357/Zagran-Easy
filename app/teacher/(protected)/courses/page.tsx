import Link from "next/link";
import { Plus, GraduationCap, ArrowUpRight, Pencil } from "lucide-react";
import { getTeacherCourses } from "@/lib/teacher-data";

export default async function TeacherCoursesPage() {
  const courses = await getTeacherCourses();

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Мои курсы</h1>
          <p className="mt-1.5 text-[14px] text-ze-muted">Создавайте программы и открывайте их студентам по ссылке.</p>
        </div>
        <Link href="/teacher/courses/new" className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] hover:bg-ze-primary-dark">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Создать курс
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-col rounded-[18px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-ze-primary">
                  <GraduationCap className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${course.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{course.is_active ? "Активен" : "Скрыт"}</span>
              </div>
              <h2 className="mt-4 text-[16px] font-bold text-ze-ink">{course.title}</h2>
              <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ze-muted">{course.description || "Описание курса пока не добавлено."}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link href={`/teacher/courses/${course.id}/edit`} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
                  <Pencil className="h-3.5 w-3.5" /> Редактировать
                </Link>
                <Link href={`/courses/${course.slug}`} target="_blank" className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ze-muted hover:text-ze-primary hover:underline">
                  Открыть страницу <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[18px] border border-dashed border-ze-border bg-white px-5 py-12 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-ze-muted" strokeWidth={1.5} />
          <div className="mt-3 text-[15px] font-semibold text-ze-ink">Курсов пока нет</div>
          <p className="mt-1.5 text-[13.5px] text-ze-muted">Создайте первый курс для студентов.</p>
        </div>
      )}
    </div>
  );
}
