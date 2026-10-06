"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Send, Sparkles, WandSparkles } from "lucide-react";
import type { StudentOption, TaskListItem } from "@/lib/teacher-data";
import { TaskPicker } from "./TaskPicker";
import { createAssignment, createQuickAssignment } from "@/lib/teacher-actions";

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

function defaultDeadline() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(20, 0, 0, 0);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function AssignmentForm({ students, tasks, initialStudentId = "" }: { students: StudentOption[]; tasks: TaskListItem[]; initialStudentId?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [studentId, setStudentId] = useState(initialStudentId);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [xpReward, setXpReward] = useState(20);
  const [dueDate, setDueDate] = useState(defaultDeadline);
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [mode, setMode] = useState<"quick" | "library">("quick");

  function toggleTask(id: string) {
    setTaskIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!studentId) return setError("Выберите ученика");
    if (!title.trim()) return setError("Укажите название задания");
    if (!dueDate) return setError("Укажите дедлайн");
    if (mode === "quick" && !instructions.trim()) return setError("Напишите, что нужно сделать");
    if (mode === "library" && taskIds.length === 0) return setError("Выберите хотя бы одно задание из базы");

    const due = new Date(dueDate).toISOString();

    startTransition(async () => {
      const res = mode === "quick"
        ? await createQuickAssignment({ studentId, title, instructions, xpReward, dueDate: due })
        : await createAssignment({ studentId, taskIds, title, dueDate: due });
      if (!res.success) {
        setError(res.error || "Не удалось назначить задание");
        return;
      }
      router.push("/teacher/assignments");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl flex-col gap-5 rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
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

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-ze-surface p-1">
        <button type="button" onClick={() => setMode("quick")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-semibold ${mode === "quick" ? "bg-white text-ze-primary shadow-sm" : "text-ze-muted"}`}><WandSparkles className="h-4 w-4" />Новое</button>
        <button type="button" onClick={() => setMode("library")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-semibold ${mode === "library" ? "bg-white text-ze-primary shadow-sm" : "text-ze-muted"}`}><BookOpen className="h-4 w-4" />Из базы</button>
      </div>

      <Field label="Название">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Страница 24, упражнение 5"
          className={inputClass}
        />
      </Field>


      {mode === "quick" ? (
        <>
          <Field label="Что нужно сделать">
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} placeholder="Коротко опишите задание. Ученик сможет отправить текст или фотографии." className={`${inputClass} resize-none`} />
          </Field>
          <Field label="Награда">
            <div className="flex flex-wrap gap-2">
              {[10, 20, 30, 50].map((value) => <button key={value} type="button" onClick={() => setXpReward(value)} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold ${xpReward === value ? "border-blue-200 bg-blue-50 text-ze-primary" : "border-ze-border text-ze-muted"}`}><Sparkles className="h-3.5 w-3.5" />+{value} XP</button>)}
            </div>
          </Field>
        </>
      ) : (
        <div>
          <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Задания из базы</div>
          <TaskPicker tasks={tasks} selectedIds={taskIds} onToggle={toggleTask} />
        </div>
      )}

      <Field label="Дедлайн">
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`${inputClass} max-w-[260px]`}
        />
      </Field>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ze-primary px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-colors hover:bg-ze-primary-dark disabled:opacity-60 sm:w-fit"
      >
        <Send className="h-4 w-4" />
        {isPending ? "Отправляем…" : "Отправить ученику"}
      </button>
    </form>
  );
}
