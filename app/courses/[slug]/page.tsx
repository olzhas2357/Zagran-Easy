import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, Clock, ListChecks } from "lucide-react";
import { fetchPublicCourses, getCourseModules } from "@/lib/data";

export async function generateStaticParams() {
  const courses = await fetchPublicCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const courses = await fetchPublicCourses();
  const course = courses.find((c) => c.slug === slug);
  if (!course) return {};

  return {
    title: `${course.title} — ZagranEasy`,
    description: course.description,
  };
}

export default async function CoursePage(props: PageProps<"/courses/[slug]">) {
  const { slug } = await props.params;

  const courses = await fetchPublicCourses();
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  const modules = await getCourseModules(course.id);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-10 sm:py-12">
        <Link
          href="/language#finder"
          className="mb-5 inline-block text-[13.5px] font-semibold text-slate-500 hover:text-[#2880DE]"
        >
          ← Все курсы
        </Link>

        {course.image_url && (
          <div className="mb-6 aspect-[16/7] w-full overflow-hidden rounded-[24px] bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {course.exam_type && (
            <span className="rounded-lg bg-[#EBF1FE] px-2.5 py-1.5 text-[12px] font-bold text-[#2880DE]">
              {course.exam_type.toUpperCase()}
            </span>
          )}
          {(course.level_from || course.level_to) && (
            <span className="rounded-lg border border-[#E7ECF6] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-600">
              {course.level_from} → {course.level_to}
            </span>
          )}
        </div>

        <h1 className="mt-3.5 text-[26px] font-extrabold leading-[1.1] tracking-tight text-[#0F1B3D] sm:text-[38px]">
          {course.title}
        </h1>

        <p className="mt-3.5 text-[15px] leading-relaxed text-slate-500 sm:text-[16px]">{course.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-semibold text-slate-600">
            <Layers className="h-3.5 w-3.5" strokeWidth={2} />
            {course.total_lessons} уроков
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-semibold text-slate-600">
            <ListChecks className="h-3.5 w-3.5" strokeWidth={2} />
            {course.total_tasks} заданий
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-semibold text-slate-600">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            {course.estimated_hours} ч.
          </span>
        </div>

        {modules.length > 0 && (
          <div className="mt-10">
            <h2 className="text-[18px] font-bold text-[#0F1B3D]">Программа курса</h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center gap-3 rounded-[18px] border border-[#E7ECF6] bg-white p-4"
                >
                  <span className="text-[22px] leading-none">{module.icon}</span>
                  <div>
                    <div className="text-[14.5px] font-bold text-[#0F1B3D]">{module.title}</div>
                    <div className="text-[12.5px] text-slate-500">
                      {module.lessons.length > 0 ? `${module.lessons.length} уроков` : "Уроки скоро появятся"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
