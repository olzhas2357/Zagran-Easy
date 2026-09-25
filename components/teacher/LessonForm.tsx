"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";
import { TaskPicker } from "./TaskPicker";
import type { StudentOption, TaskOption } from "@/lib/teacher-data";
import { createLesson, updateLesson, uploadLessonMaterial } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

const DURATIONS = [30, 45, 60, 90, 120];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">{label}</div>
      {children}
    </label>
  );
}

export interface LessonFormInitial {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  durationMinutes: number;
  studentIds: string[];
  meetingUrl: string | null;
  meetingProvider: "zoom" | "meet" | null;
  materials: { name: string; url: string }[];
  homeworkTaskIds: string[];
}

function toLocalDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toLocalTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function LessonForm({
  students,
  tasks,
  lesson,
}: {
  students: StudentOption[];
  tasks: TaskOption[];
  lesson?: LessonFormInitial;
}) {
  const router = useRouter();
  const isEdit = Boolean(lesson);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(lesson?.title ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [date, setDate] = useState(lesson ? toLocalDate(lesson.scheduledAt) : "");
  const [time, setTime] = useState(lesson ? toLocalTime(lesson.scheduledAt) : "18:00");
  const [duration, setDuration] = useState(lesson?.durationMinutes ?? 60);
  const [studentIds, setStudentIds] = useState<string[]>(lesson?.studentIds ?? []);
  const [meetingUrl, setMeetingUrl] = useState(lesson?.meetingUrl ?? "");
  const [meetingProvider, setMeetingProvider] = useState<"zoom" | "meet">(lesson?.meetingProvider || "meet");
  const [materials, setMaterials] = useState<{ name: string; url: string }[]>(lesson?.materials ?? []);
  const [homeworkTaskIds, setHomeworkTaskIds] = useState<string[]>(lesson?.homeworkTaskIds ?? []);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadLessonMaterial(fd);
      if (res.success && res.url) {
        setMaterials((prev) => [...prev, { name: res.name || file.name, url: res.url! }]);
      } else {
        setError(res.error || "Не удалось загрузить файл");
      }
    }
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Укажите название урока");
    if (!date) return setError("Укажите дату урока");

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

    startTransition(async () => {
      if (isEdit && lesson) {
        const res = await updateLesson(lesson.id, {
          title,
          description,
          scheduledAt,
          durationMinutes: duration,
          meetingUrl,
          meetingProvider,
          materials,
          homeworkTaskIds,
        });
        if (!res.success) {
          setError(res.error || "Не удалось сохранить урок");
          return;
        }
        router.push(`/teacher/lessons/${lesson.id}`);
        return;
      }

      const res = await createLesson({
        title,
        description,
        scheduledAt,
        durationMinutes: duration,
        studentIds,
        meetingUrl,
        meetingProvider,
        materials,
        homeworkTaskIds,
      });
      if (!res.success) {
        setError(res.error || "Не удалось создать урок");
        return;
      }
      router.push(`/teacher/lessons/${res.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl flex-col gap-5">
      <Field label="Название урока">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="HSK Listening — Level 3" className={inputClass} />
      </Field>

      <Field label="Описание">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={textareaClass} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Дата">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Время">
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label="Длительность">
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={inputClass}>
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d} мин
            </option>
          ))}
        </select>
      </Field>

      <Field label="Ученики">
        {isEdit ? (
          <div className="flex flex-wrap gap-2">
            {students
              .filter((s) => studentIds.includes(s.id))
              .map((s) => (
                <span key={s.id} className="rounded-full border border-ze-border bg-ze-surface px-3.5 py-2 text-[13px] font-semibold text-ze-ink">
                  {s.fullName || "Без имени"}
                </span>
              ))}
            <span className="self-center text-[12.5px] text-ze-muted">Список учеников нельзя изменить после создания урока.</span>
          </div>
        ) : students.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {students.map((s) => {
              const active = studentIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(studentIds, setStudentIds, s.id)}
                  className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? "border-ze-primary bg-ze-primary text-white"
                      : "border-ze-border bg-white text-ze-ink hover:border-slate-300"
                  }`}
                >
                  {s.fullName || "Без имени"}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-[13px] text-ze-muted">Нет учеников</div>
        )}
      </Field>

      <div className="grid grid-cols-[140px_1fr] gap-2.5">
        <Field label="Платформа">
          <select value={meetingProvider} onChange={(e) => setMeetingProvider(e.target.value as "zoom" | "meet")} className={inputClass}>
            <option value="meet">Google Meet</option>
            <option value="zoom">Zoom</option>
          </select>
        </Field>
        <Field label="Ссылка на урок">
          <input value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://..." className={inputClass} />
        </Field>
      </div>

      <Field label="Материалы">
        <div className="flex flex-col gap-2">
          {materials.length > 0 && (
            <ul className="flex flex-col gap-1">
              {materials.map((m, i) => (
                <li key={m.url + i} className="flex items-center justify-between rounded-xl border border-ze-border px-3.5 py-2.5 text-[13px]">
                  <span className="truncate">{m.name}</span>
                  <button
                    type="button"
                    onClick={() => setMaterials(materials.filter((_, idx) => idx !== i))}
                    className="flex-none text-ze-muted hover:text-red-600"
                    aria-label="Удалить файл"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-fit items-center gap-2 rounded-xl border border-dashed border-ze-border px-3.5 py-2.5 text-[13px] font-semibold text-ze-muted transition-colors hover:border-slate-300 hover:text-ze-ink"
          >
            <Upload className="h-4 w-4" strokeWidth={1.75} />
            {uploading ? "Загружаем…" : "Загрузить файлы"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.ppt,.pptx,image/*"
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </Field>

      <div>
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Домашнее задание из базы знаний</div>
        <TaskPicker tasks={tasks} selectedIds={homeworkTaskIds} onToggle={(id) => toggle(homeworkTaskIds, setHomeworkTaskIds, id)} />
      </div>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isPending || uploading}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Сохраняем…" : isEdit ? "Сохранить изменения" : "Создать урок"}
      </button>
    </form>
  );
}
