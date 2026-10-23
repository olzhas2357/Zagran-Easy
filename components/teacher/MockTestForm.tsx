"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import type { TaskOption } from "@/lib/teacher-data";
import type { ManagedMockTest } from "@/lib/mock-test-manage-data";
import { createMockTest, updateMockTest } from "@/lib/mock-test-manage-actions";
import { TaskPicker } from "./TaskPicker";

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

export function MockTestForm({ tasks, test }: { tasks: TaskOption[]; test?: ManagedMockTest }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [examType, setExamType] = useState<"ielts" | "hsk">(test?.examType ?? "ielts");
  const [title, setTitle] = useState(test?.title ?? "");
  const [level, setLevel] = useState(test?.level ?? "");
  const [minutes, setMinutes] = useState(test?.timeLimitMinutes ?? 30);
  const [isActive, setIsActive] = useState(test?.isActive ?? true);
  const [taskIds, setTaskIds] = useState<string[]>(test?.taskIds ?? []);

  const taskById = new Map(tasks.map((task) => [task.id, task]));

  function toggleTask(id: string) {
    setTaskIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function move(index: number, delta: number) {
    setTaskIds((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3) return setError("Укажите название теста (минимум 3 символа)");
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 600) return setError("Время: от 1 до 600 минут");
    if (taskIds.length === 0) return setError("Выберите хотя бы одно задание");

    const input = { examType, title, level, timeLimitMinutes: minutes, taskIds, isActive };
    startTransition(async () => {
      const res = test ? await updateMockTest(test.id, input) : await createMockTest(input);
      if (!res.success) return setError(res.error);
      router.push("/teacher/mock-tests");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl flex-col gap-5 rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
      <Field label="Экзамен">
        <select value={examType} onChange={(e) => setExamType(e.target.value as "ielts" | "hsk")} className={inputClass}>
          <option value="ielts">IELTS</option>
          <option value="hsk">HSK</option>
        </select>
      </Field>
      <Field label="Название">
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="Например, IELTS Reading — пробный тест 1" className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Уровень (необязательно)">
          <input value={level} onChange={(e) => setLevel(e.target.value)} maxLength={50} placeholder="B1, HSK 2…" className={inputClass} />
        </Field>
        <Field label="Время, минут">
          <input type="number" min={1} max={600} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className={inputClass} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-[14px] text-ze-ink">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Опубликован (виден студентам и на публичной странице)
      </label>

      <div>
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Задания из базы знаний</div>
        <TaskPicker tasks={tasks} selectedIds={taskIds} onToggle={toggleTask} />
      </div>

      {taskIds.length > 0 && (
        <div>
          <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Порядок вопросов</div>
          <ol className="space-y-2">
            {taskIds.map((id, index) => (
              <li key={id} className="flex items-center gap-2 rounded-xl border border-ze-border px-3 py-2 text-sm">
                <span className="w-6 text-ze-muted">{index + 1}.</span>
                <span className="min-w-0 flex-1 truncate">{taskById.get(id)?.title ?? "Задание"}</span>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Выше" className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === taskIds.length - 1} aria-label="Ниже" className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => toggleTask(id)} aria-label="Убрать" className="rounded p-1 hover:bg-slate-100"><X className="h-4 w-4" /></button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={isPending} className="w-fit rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-bold text-white disabled:opacity-60">
        {isPending ? "Сохраняем…" : test ? "Сохранить" : "Создать тест"}
      </button>
    </form>
  );
}
