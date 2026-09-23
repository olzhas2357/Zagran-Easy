"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { StudentOption, TaskListItem } from "@/lib/teacher-data";
import { createAssignment } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">{label}</div>
      {children}
    </label>
  );
}

export function AssignmentForm({ students, tasks }: { students: StudentOption[]; tasks: TaskListItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskIds, setTaskIds] = useState<string[]>([]);

  function toggleTask(id: string) {
    setTaskIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!studentId) return setError("Выберите ученика");
    if (!title.trim()) return setError("Укажите название задания");
    if (!dueDate) return setError("Укажите дедлайн");
    if (taskIds.length === 0) return setError("Выберите хотя бы одно задание из банка");

    const due = new Date(dueDate).toISOString();

    startTransition(async () => {
      const res = await createAssignment({ studentId, taskIds, title, dueDate: due });
      if (!res.success) {
        setError(res.error || "Не удалось назначить задание");
        return;
      }
      router.push("/teacher/assignments");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl flex-col gap-5">
      <Field label="Ученик">
        {students.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {students.map((s) => {
              const active = studentId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStudentId(s.id)}
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

      <Field label="Название">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Домашнее задание: IELTS Reading"
          className={inputClass}
        />
      </Field>

      <Field label="Дедлайн">
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`${inputClass} max-w-[260px]`}
        />
      </Field>

      <Field label="Задания из банка">
        {tasks.length > 0 ? (
          <div className="flex flex-col gap-2">
            {tasks.map((t) => {
              const active = taskIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTask(t.id)}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
                    active ? "border-ze-primary bg-blue-50 text-ze-ink" : "border-ze-border bg-white text-ze-ink hover:border-slate-300"
                  }`}
                >
                  <span className="truncate">{t.title}</span>
                  {t.examType && <span className="flex-none text-[11.5px] font-bold uppercase text-ze-muted">{t.examType}</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-[13px] text-ze-muted">
            В банке пока нет заданий. Сначала создайте задание в разделе «Банк заданий».
          </div>
        )}
      </Field>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Назначаем…" : "Назначить задание"}
      </button>
    </form>
  );
}
