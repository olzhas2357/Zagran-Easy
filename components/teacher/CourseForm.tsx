"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCourse, createCourseSection, deleteCourseSection, updateCourse, updateCourseSection } from "@/lib/teacher-actions";
import type { CourseModule } from "@/lib/language-data";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

const EXAM_TYPES = [
  { value: "ielts", label: "IELTS" },
  { value: "hsk", label: "HSK" },
  { value: "sat", label: "SAT" },
  { value: "general", label: "General English" },
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">{label}</div>
      {children}
      {hint && <div className="mt-1.5 text-[12.5px] text-ze-muted">{hint}</div>}
    </label>
  );
}

type CourseFormInitial = {
  id: string;
  slug: string;
  title: string;
  exam_type: string;
  description: string;
  level_from: string;
  level_to: string;
  total_lessons: number;
  total_tasks: number;
  estimated_hours: number;
  is_active: boolean;
  image_url: string | null;
  sections: CourseModule[];
};

export function CourseForm({ initial }: { initial?: CourseFormInitial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial));
  const [examType, setExamType] = useState(initial?.exam_type ?? EXAM_TYPES[0].value);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [levelFrom, setLevelFrom] = useState(initial?.level_from ?? "A1");
  const [levelTo, setLevelTo] = useState(initial?.level_to ?? "B2");
  const [totalLessons, setTotalLessons] = useState(String(initial?.total_lessons ?? 0));
  const [totalTasks, setTotalTasks] = useState(String(initial?.total_tasks ?? 0));
  const [estimatedHours, setEstimatedHours] = useState(String(initial?.estimated_hours ?? 0));
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [sections, setSections] = useState<CourseModule[]>(initial?.sections ?? []);
  const [newSection, setNewSection] = useState({ slug: "", title: "", icon: "📘" });

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const input = {
        slug, title, examType, description, levelFrom, levelTo,
        totalLessons: Number(totalLessons) || 0,
        totalTasks: Number(totalTasks) || 0,
        estimatedHours: Number(estimatedHours) || 0,
        isActive,
        imageUrl,
      };
      const result = initial ? await updateCourse(initial.id, input) : await createCourse(input);
      if (!result.success || !result.slug) {
        setError(result.error || "Не удалось создать курс");
        return;
      }
      router.push("/teacher/courses");
    });
  }

  async function addSection() {
    if (!initial || !newSection.title.trim() || !newSection.slug.trim()) return;
    const result = await createCourseSection(initial.id, { ...newSection, sortOrder: sections.length });
    if (!result.success) return setError(result.error || "Не удалось добавить раздел");
    setSections([...sections, { id: `new-${Date.now()}`, course_id: initial.id, slug: newSection.slug, title: newSection.title, icon: newSection.icon, sort_order: sections.length, lessons: [] }]);
    setNewSection({ slug: "", title: "", icon: "📘" });
  }

  async function removeSection(sectionId: string) {
    if (!initial) return;
    const result = await deleteCourseSection(initial.id, sectionId);
    if (!result.success) return setError(result.error || "Не удалось удалить раздел");
    setSections(sections.filter((section) => section.id !== sectionId));
  }

  async function saveSection(section: CourseModule) {
    if (!initial) return;
    const result = await updateCourseSection(initial.id, section.id, {
      slug: section.slug,
      title: section.title,
      icon: section.icon,
      sortOrder: section.sort_order,
    });
    if (!result.success) setError(result.error || "Не удалось сохранить раздел");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl flex-col gap-5">
      <Field label="Название курса" hint="Например: IELTS Foundation">
        <input value={title} onChange={(event) => handleTitleChange(event.target.value)} className={inputClass} autoFocus />
      </Field>

      <Field label="Адрес курса" hint="Используется в ссылке /courses/slug">
        <div className="flex items-center overflow-hidden rounded-xl border border-ze-border bg-white focus-within:border-ze-primary">
          <span className="px-3.5 text-[14px] text-ze-muted">/courses/</span>
          <input
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(slugify(event.target.value));
            }}
            className="min-w-0 flex-1 border-0 px-0 py-3 pr-3.5 text-[14px] text-ze-ink outline-none"
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Направление">
          <select value={examType} onChange={(event) => setExamType(event.target.value)} className={inputClass}>
            {EXAM_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Уровень от">
          <select value={levelFrom} onChange={(event) => setLevelFrom(event.target.value)} className={inputClass}>
            {LEVELS.map((level) => <option key={level}>{level}</option>)}
          </select>
        </Field>
        <Field label="Уровень до">
          <select value={levelTo} onChange={(event) => setLevelTo(event.target.value)} className={inputClass}>
            {LEVELS.map((level) => <option key={level}>{level}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Описание" hint="Кратко объясните, кому подойдёт курс и какой результат он даёт">
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={6} className={textareaClass} />
      </Field>

      <Field label="Изображение курса" hint="Вставьте публичную ссылку на JPG, PNG или WebP">
        <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." className={inputClass} />
      </Field>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition hover:bg-ze-primary-dark disabled:opacity-60"
        >
          {isPending ? "Сохраняем…" : initial ? "Сохранить курс" : "Создать курс"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-xl border border-ze-border bg-white px-5 py-3 text-[14px] font-semibold text-ze-ink hover:border-slate-300">
          Отмена
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Количество уроков"><input type="number" min={0} value={totalLessons} onChange={(event) => setTotalLessons(event.target.value)} className={inputClass} /></Field>
        <Field label="Количество заданий"><input type="number" min={0} value={totalTasks} onChange={(event) => setTotalTasks(event.target.value)} className={inputClass} /></Field>
        <Field label="Часов в неделю"><input type="number" min={0} step="0.5" value={estimatedHours} onChange={(event) => setEstimatedHours(event.target.value)} className={inputClass} /></Field>
      </div>

      <label className="flex items-center gap-2.5 text-[13.5px] font-medium text-ze-ink">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4 accent-ze-primary" />
        Курс активен и виден в публичном каталоге
      </label>

      {initial && (
        <div className="rounded-[18px] border border-ze-border bg-white p-4 sm:p-5">
          <div className="text-[15px] font-bold text-ze-ink">Разделы курса</div>
          <div className="mt-3 flex flex-col gap-2">
            {sections.map((section) => (
              <div key={section.id} className="grid grid-cols-[48px_1fr_1fr_auto_auto] items-center gap-2 rounded-xl border border-ze-border px-3 py-2">
                <input value={section.icon} onChange={(event) => setSections(sections.map((item) => item.id === section.id ? { ...item, icon: event.target.value } : item))} className={inputClass} aria-label="Иконка раздела" />
                <input value={section.title} onChange={(event) => setSections(sections.map((item) => item.id === section.id ? { ...item, title: event.target.value } : item))} className={inputClass} aria-label="Название раздела" />
                <input value={section.slug} onChange={(event) => setSections(sections.map((item) => item.id === section.id ? { ...item, slug: slugify(event.target.value) } : item))} className={inputClass} aria-label="Slug раздела" />
                <button type="button" onClick={() => saveSection(section)} className="text-[12.5px] font-semibold text-ze-primary hover:underline">Сохранить</button>
                <button type="button" onClick={() => removeSection(section.id)} className="text-[12.5px] font-semibold text-red-600 hover:underline">Удалить</button>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[72px_1fr_1fr_auto] gap-2">
            <input value={newSection.icon} onChange={(event) => setNewSection({ ...newSection, icon: event.target.value })} className={inputClass} aria-label="Иконка раздела" />
            <input value={newSection.title} onChange={(event) => setNewSection({ ...newSection, title: event.target.value })} placeholder="Название раздела" className={inputClass} />
            <input value={newSection.slug} onChange={(event) => setNewSection({ ...newSection, slug: slugify(event.target.value) })} placeholder="slug-раздела" className={inputClass} />
            <button type="button" onClick={addSection} className="rounded-xl border border-ze-border px-3 text-[13px] font-semibold text-ze-primary hover:border-ze-primary">Добавить</button>
          </div>
        </div>
      )}
    </form>
  );
}
