"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

const TYPES = [
  { value: "multiple_choice", label: "Один вариант ответа" },
  { value: "multiple_select", label: "Несколько вариантов" },
  { value: "fill_blanks", label: "Заполнить пропуски" },
  { value: "matching", label: "Сопоставление" },
  { value: "vocabulary", label: "Лексика" },
  { value: "grammar", label: "Грамматика" },
  { value: "reading", label: "Чтение" },
  { value: "listening", label: "Аудирование" },
  { value: "writing", label: "Письмо" },
  { value: "speaking", label: "Говорение" },
];

const EXAM_TYPES = [
  { value: "ielts", label: "IELTS" },
  { value: "hsk", label: "HSK" },
  { value: "sat", label: "SAT" },
  { value: "general", label: "General English" },
];

const DIFFICULTIES = [
  { value: "", label: "Не указана" },
  { value: "easy", label: "Лёгкая" },
  { value: "medium", label: "Средняя" },
  { value: "hard", label: "Сложная" },
];

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">{label}</div>
      {children}
      {hint && <div className="mt-1.5 text-[12.5px] text-ze-muted">{hint}</div>}
    </label>
  );
}

export function TaskForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState(TYPES[0].value);
  const [examType, setExamType] = useState(EXAM_TYPES[0].value);
  const [section, setSection] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [xpReward, setXpReward] = useState("10");
  const [autoCheck, setAutoCheck] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Укажите название задания");
    if (!question.trim()) return setError("Укажите текст задания");

    startTransition(async () => {
      const res = await createTask({
        title,
        type,
        examType,
        question,
        section,
        difficulty,
        correctAnswer,
        explanation,
        xpReward: xpReward.trim() ? Number(xpReward) : null,
        autoCheck,
      });
      if (!res.success) {
        setError(res.error || "Не удалось создать задание");
        return;
      }
      router.push("/teacher/tasks");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl flex-col gap-5">
      <Field label="Название задания">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="IELTS Reading — Passage 1"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Тип задания">
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Экзамен">
          <select value={examType} onChange={(e) => setExamType(e.target.value)} className={inputClass}>
            {EXAM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Раздел" hint="Необязательно, напр. Speaking">
          <input value={section} onChange={(e) => setSection(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Сложность">
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputClass}>
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Текст задания / вопрос">
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} className={textareaClass} />
      </Field>

      <Field label="Правильный ответ" hint="Необязательно. Если указан и включена автопроверка — ответ ученика сверяется автоматически.">
        <input value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className={inputClass} />
      </Field>

      <Field label="Пояснение к ответу" hint="Покажется ученику после проверки">
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={3} className={textareaClass} />
      </Field>

      <div className="grid grid-cols-2 items-end gap-3">
        <Field label="Награда, XP">
          <input
            type="number"
            min={0}
            value={xpReward}
            onChange={(e) => setXpReward(e.target.value)}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2.5 pb-3">
          <input
            type="checkbox"
            checked={autoCheck}
            onChange={(e) => setAutoCheck(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-ze-border accent-ze-primary"
          />
          <span className="text-[13.5px] font-medium text-ze-ink">Автопроверка ответа</span>
        </label>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Создаём…" : "Создать задание"}
      </button>
    </form>
  );
}
