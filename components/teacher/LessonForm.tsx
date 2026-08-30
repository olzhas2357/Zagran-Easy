"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";
import type { StudentOption, TaskOption } from "@/lib/teacher-data";
import { createLesson, uploadLessonMaterial } from "@/lib/teacher-actions";

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

export function LessonForm({ students, tasks }: { students: StudentOption[]; tasks: TaskOption[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(60);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [materials, setMaterials] = useState<{ name: string; url: string }[]>([]);
  const [homeworkTaskIds, setHomeworkTaskIds] = useState<string[]>([]);

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
      const res = await createLesson({
        title,
        description,
        scheduledAt,
        durationMinutes: duration,
        studentIds,
        meetingUrl,
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
        {students.length > 0 ? (
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

      <Field label="Ссылка Zoom/Meet">
        <input value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://..." className={inputClass} />
      </Field>

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

      {tasks.length > 0 && (
        <Field label="Домашнее задание">
          <div className="flex flex-wrap gap-2">
            {tasks.map((t) => {
              const active = homeworkTaskIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggle(homeworkTaskIds, setHomeworkTaskIds, t.id)}
                  className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? "border-ze-primary bg-ze-primary text-white"
                      : "border-ze-border bg-white text-ze-ink hover:border-slate-300"
                  }`}
                >
                  {t.title}
                </button>
              );
            })}
          </div>
        </Field>
      )}

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isPending || uploading}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Создаём…" : "Создать урок"}
      </button>
    </form>
  );
}
