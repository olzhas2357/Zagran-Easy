"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, FileText, Info, LoaderCircle, Trash2, UploadCloud, X } from "lucide-react";
import { deleteCourseSyllabus, uploadCourseSyllabus } from "@/lib/teacher-actions";
import type { CourseSyllabus } from "@/lib/course-syllabus";

type CourseOption = { id: string; title: string };

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} КБ` : `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
}

function formatDate(value: string) {
  return value ? new Date(value).toLocaleString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
}

export function SyllabusManager({ courses, initialSyllabi }: { courses: CourseOption[]; initialSyllabi: Record<string, CourseSyllabus | null> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [syllabi, setSyllabi] = useState(initialSyllabi);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const current = syllabi[courseId] ?? null;

  function changeCourse(nextCourseId: string) {
    setCourseId(nextCourseId);
    setFile(null);
    setComment("");
    setError(null);
    setSuccess(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function publish() {
    if (!file) return setError("Выберите файл syllabus");
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("courseId", courseId);
    formData.set("file", file);
    formData.set("comment", comment);
    startTransition(async () => {
      const result = await uploadCourseSyllabus(formData);
      if (!result.success || !result.syllabus) return setError(result.error || "Не удалось загрузить syllabus");
      setSyllabi((value) => ({ ...value, [courseId]: result.syllabus! }));
      setFile(null);
      setComment("");
      if (inputRef.current) inputRef.current.value = "";
      setSuccess("Syllabus опубликован и уже доступен ученикам курса");
    });
  }

  function remove() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteCourseSyllabus(courseId);
      if (!result.success) return setError(result.error || "Не удалось удалить syllabus");
      setSyllabi((value) => ({ ...value, [courseId]: null }));
      setSuccess("Syllabus удалён из кабинетов учеников");
    });
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-ze-border bg-white px-6 py-14 text-center">
        <FileText className="mx-auto h-8 w-8 text-ze-muted" strokeWidth={1.5} />
        <h2 className="mt-3 text-[16px] font-bold text-ze-ink">Сначала создайте курс</h2>
        <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-ze-muted">Syllabus прикрепляется к конкретному языковому курсу и показывается его ученикам.</p>
        <Link href="/teacher/courses/new" className="mt-5 inline-flex rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white hover:bg-ze-primary-dark">Создать курс</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
      <section className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-ze-primary"><UploadCloud className="h-5 w-5" strokeWidth={1.8} /></span>
          <div><h2 className="text-[16px] font-bold text-ze-ink">Загрузить syllabus</h2><p className="mt-1 text-[13px] leading-relaxed text-ze-muted">Выберите курс и добавьте актуальную программу обучения.</p></div>
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-[12.5px] font-semibold text-ze-muted">Курс</span>
          <select value={courseId} onChange={(event) => changeCourse(event.target.value)} disabled={isPending} className="w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] font-medium text-ze-ink outline-none focus:border-ze-primary disabled:opacity-60">
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
        </label>

        {current && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"><FileText className="h-5 w-5" strokeWidth={1.8} /></span>
              <div className="min-w-0 flex-1"><div className="truncate text-[13.5px] font-bold text-ze-ink">{current.fileName}</div><div className="mt-1 text-[11.5px] text-ze-muted">Версия {current.version} · {formatSize(current.sizeBytes)} · {formatDate(current.updatedAt)}</div>{current.comment && <p className="mt-2 text-[12px] leading-relaxed text-ze-muted">{current.comment}</p>}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-emerald-100 pt-3">
              <a href={current.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-ze-primary shadow-sm hover:bg-blue-50"><ExternalLink className="h-3.5 w-3.5" /> Открыть</a>
              <button type="button" onClick={remove} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Удалить</button>
            </div>
          </div>
        )}

        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(null); setSuccess(null); }} />
        {file ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white text-ze-primary shadow-sm"><FileText className="h-5 w-5" strokeWidth={1.8} /></span>
            <div className="min-w-0 flex-1"><div className="truncate text-[13.5px] font-bold text-ze-ink">{file.name}</div><div className="mt-0.5 text-[12px] text-ze-muted">{formatSize(file.size)} · {current ? "заменит текущую версию" : "готов к загрузке"}</div></div>
            <button type="button" onClick={() => setFile(null)} aria-label="Убрать выбранный файл" className="rounded-lg p-2 text-ze-muted hover:bg-white"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={isPending} className="mt-4 flex w-full flex-col items-center rounded-2xl border border-dashed border-[#B8C7E5] bg-[#F8FAFE] px-5 py-9 text-center transition-colors hover:border-ze-primary hover:bg-blue-50/50 disabled:opacity-60">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ze-primary shadow-[0_4px_14px_rgba(15,23,42,0.08)]"><UploadCloud className="h-6 w-6" strokeWidth={1.7} /></span>
            <span className="mt-3 text-[14px] font-bold text-ze-ink">{current ? "Загрузить новую версию" : "Выберите файл"}</span><span className="mt-1 text-[12.5px] text-ze-muted">PDF, DOC или DOCX · до 20 МБ</span><span className="mt-1 text-[11.5px] text-ze-primary">PDF и DOCX откроются у ученика прямо в кабинете</span>
          </button>
        )}

        <label className="mt-4 block"><span className="mb-2 block text-[12.5px] font-semibold text-ze-muted">Комментарий для учеников <span className="font-normal text-slate-400">(необязательно)</span></span><textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} maxLength={1000} placeholder="Например: программа обновлена на осенний семестр" className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none placeholder:text-slate-400 focus:border-ze-primary" /></label>
        {error && <div className="mt-4 rounded-xl bg-red-50 px-3.5 py-3 text-[13px] font-medium text-red-700">{error}</div>}
        {success && <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[13px] font-medium text-emerald-800"><CheckCircle2 className="h-4 w-4 flex-none" />{success}</div>}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={publish} disabled={!file || isPending} className="inline-flex items-center gap-2 rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white hover:bg-ze-primary-dark disabled:cursor-not-allowed disabled:opacity-50">{isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}{current ? "Опубликовать новую версию" : "Опубликовать для учеников"}</button>
          <span className="text-[12px] text-ze-muted">После публикации файл сразу появится у учеников курса.</span>
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <div className="rounded-[20px] border border-ze-border bg-white p-5"><div className="flex items-center gap-2 text-[14px] font-bold text-ze-ink"><Info className="h-4.5 w-4.5 text-ze-primary" strokeWidth={1.9} /> Что увидит ученик</div><div className="mt-4 rounded-2xl border border-ze-border bg-ze-surface p-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"><FileText className="h-5 w-5" /></span><div><div className="text-[13.5px] font-bold text-ze-ink">Syllabus курса</div><div className="mt-0.5 text-[11.5px] text-ze-muted">Актуальная программа · защищённый файл</div></div></div><div className="mt-3 rounded-xl bg-ze-primary px-4 py-2.5 text-center text-[12.5px] font-semibold text-white">Открыть syllabus</div></div></div>
        <div className="rounded-[20px] border border-emerald-100 bg-emerald-50/70 p-5"><div className="flex items-center gap-2 text-[13.5px] font-bold text-emerald-900"><CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2} /> Простая логика</div><ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-emerald-900/75"><li>• один актуальный файл на курс;</li><li>• новая загрузка заменяет предыдущую;</li><li>• ссылка приватная и действует ограниченное время.</li></ul></div>
      </aside>
    </div>
  );
}
