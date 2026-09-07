"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createTask, uploadListeningAudio } from "@/lib/teacher-actions";
import {
  MANUAL_ONLY_TYPES,
  STRUCTURED_TYPES,
  TASK_TYPES,
  type ChoiceOption,
  type MatchingPair,
  type TaskType,
} from "@/lib/task-types";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

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
function newId() {
  return Math.random().toString(36).slice(2, 10);
}
// --- Редактор вариантов ответа (multiple_choice / multiple_select) ---
function ChoicesEditor({
  choices,
  setChoices,
  correctIds,
  setCorrectIds,
  multi,
}: {
  choices: ChoiceOption[];
  setChoices: (c: ChoiceOption[]) => void;
  correctIds: string[];
  setCorrectIds: (ids: string[]) => void;
  multi: boolean;
}) {
  const name = useId();

  function updateText(id: string, text: string) {
    setChoices(choices.map((c) => (c.id === id ? { ...c, text } : c)));
  }
  function addChoice() {
    setChoices([...choices, { id: newId(), text: "" }]);
  }
  function removeChoice(id: string) {
    setChoices(choices.filter((c) => c.id !== id));
    setCorrectIds(correctIds.filter((cid) => cid !== id));
  }
  function toggleCorrect(id: string) {
    if (multi) {
      setCorrectIds(correctIds.includes(id) ? correctIds.filter((c) => c !== id) : [...correctIds, id]);
    } else {
      setCorrectIds([id]);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[13px] font-semibold text-ze-muted">
        Варианты ответа <span className="font-normal">(отметьте правильный{multi ? "ые" : "ый"})</span>
      </div>
      {choices.map((c) => (
        <div key={c.id} className="flex items-center gap-2.5">
          <input
            type={multi ? "checkbox" : "radio"}
            name={name}
            checked={correctIds.includes(c.id)}
            onChange={() => toggleCorrect(c.id)}
            className="h-4.5 w-4.5 flex-none accent-ze-primary"
          />
          <input
            value={c.text}
            onChange={(e) => updateText(c.id, e.target.value)}
            placeholder="Текст варианта"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => removeChoice(c.id)}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-ze-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addChoice}
        className="flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-ze-primary hover:bg-blue-50"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Добавить вариант
      </button>
    </div>
  );
}

// --- Редактор пар (matching) ---
function MatchingEditor({ pairs, setPairs }: { pairs: MatchingPair[]; setPairs: (p: MatchingPair[]) => void }) {
  function update(id: string, field: "left" | "right", value: string) {
    setPairs(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }
  function add() {
    setPairs([...pairs, { id: newId(), left: "", right: "" }]);
  }
  function remove(id: string) {
    setPairs(pairs.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[13px] font-semibold text-ze-muted">Пары для сопоставления</div>
      {pairs.map((p) => (
        <div key={p.id} className="flex items-center gap-2.5">
          <input
            value={p.left}
            onChange={(e) => update(p.id, "left", e.target.value)}
            placeholder="Левый элемент"
            className={inputClass}
          />
          <span className="flex-none text-ze-muted">→</span>
          <input
            value={p.right}
            onChange={(e) => update(p.id, "right", e.target.value)}
            placeholder="Правый элемент"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => remove(p.id)}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-ze-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-ze-primary hover:bg-blue-50"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Добавить пару
      </button>
    </div>
  );
}

// --- Редактор пропусков (fill_blanks) ---
function BlanksEditor({ blanks, setBlanks }: { blanks: string[]; setBlanks: (b: string[]) => void }) {
  function update(i: number, value: string) {
    setBlanks(blanks.map((b, idx) => (idx === i ? value : b)));
  }
  function add() {
    setBlanks([...blanks, ""]);
  }
  function remove(i: number) {
    setBlanks(blanks.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[13px] font-semibold text-ze-muted">
        Правильные ответы для пропусков{" "}
        <span className="font-normal">
          (по одному на каждый ___ в тексте задания; несколько допустимых вариантов — через &quot;|&quot;)
        </span>
      </div>
      {blanks.map((b, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-ze-surface text-[13px] font-semibold text-ze-muted">
            {i + 1}
          </span>
          <input value={b} onChange={(e) => update(i, e.target.value)} placeholder="напр. go|goes" className={inputClass} />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-ze-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-ze-primary hover:bg-blue-50"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Добавить пропуск
      </button>
    </div>
  );
}

export function TaskForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>(TASK_TYPES[0].value);
  const [examType, setExamType] = useState(EXAM_TYPES[0].value);
  const [section, setSection] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [xpReward, setXpReward] = useState("10");
  const [autoCheck, setAutoCheck] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioUploading, setAudioUploading] = useState(false);

  // Структурированные данные под каждый тип задания.
  const [choices, setChoices] = useState<ChoiceOption[]>([
    { id: newId(), text: "" },
    { id: newId(), text: "" },
  ]);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [pairs, setPairs] = useState<MatchingPair[]>([{ id: newId(), left: "", right: "" }]);
  const [blanks, setBlanks] = useState<string[]>([""]);

  const isManualOnly = MANUAL_ONLY_TYPES.includes(type);
  const isStructured = STRUCTURED_TYPES.includes(type);
  const isMultiSelect = type === "multiple_select";
  const isChoiceType = type === "multiple_choice" || type === "multiple_select";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Укажите название задания");
    if (!question.trim()) return setError("Укажите текст задания");

    let options: Record<string, unknown> | undefined;
    if (isChoiceType) {
      const filled = choices.filter((c) => c.text.trim());
      if (filled.length < 2) return setError("Добавьте минимум 2 варианта ответа");
      if (correctIds.length === 0) return setError("Отметьте правильный вариант");
      options = isMultiSelect ? { choices: filled, correctIds } : { choices: filled, correctId: correctIds[0] };
    } else if (type === "matching") {
      const filled = pairs.filter((p) => p.left.trim() && p.right.trim());
      if (filled.length < 2) return setError("Добавьте минимум 2 пары для сопоставления");
      options = { pairs: filled };
    } else if (type === "fill_blanks") {
      const filled = blanks.filter((b) => b.trim());
      if (filled.length === 0) return setError("Укажите правильные ответы для пропусков");
      options = { blanks: filled };
    }

    startTransition(async () => {
      const res = await createTask({
        title,
        type,
        examType,
        question,
        section,
        difficulty,
        correctAnswer: isStructured || isManualOnly ? "" : correctAnswer,
        explanation,
        xpReward: xpReward.trim() ? Number(xpReward) : null,
        autoCheck: isManualOnly ? false : isStructured ? true : autoCheck,
        options,
        audioUrl,
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
          <select value={type} onChange={(e) => setType(e.target.value as TaskType)} className={inputClass}>
            {TASK_TYPES.map((t) => (
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

      <Field
        label="Текст задания / вопрос"
        hint={type === "fill_blanks" ? "Отметьте пропуски как ___ (три подчёркивания)" : undefined}
      >
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} className={textareaClass} />
      </Field>

      {type === "listening" && (
        <Field label="Аудио для аудирования" hint="Загрузите MP3, WAV или MP4. Студент услышит файл перед ответом.">
          <input
            type="file"
            accept="audio/*,video/mp4"
            disabled={audioUploading}
            className="block w-full rounded-xl border border-dashed border-ze-border bg-white px-3.5 py-3 text-[13px] text-ze-muted"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setAudioUploading(true);
              const formData = new FormData();
              formData.set("file", file);
              const result = await uploadListeningAudio(formData);
              setAudioUploading(false);
              if (result.success && result.url) setAudioUrl(result.url);
              else setError(result.error || "Не удалось загрузить аудио");
            }}
          />
          {audioUploading && <div className="mt-1.5 text-[12.5px] text-ze-muted">Загружаем аудио…</div>}
          {audioUrl && <audio controls src={audioUrl} className="mt-3 w-full" />}
        </Field>
      )}

      {isChoiceType && (
        <ChoicesEditor
          choices={choices}
          setChoices={setChoices}
          correctIds={correctIds}
          setCorrectIds={setCorrectIds}
          multi={isMultiSelect}
        />
      )}
      {type === "matching" && <MatchingEditor pairs={pairs} setPairs={setPairs} />}
      {type === "fill_blanks" && <BlanksEditor blanks={blanks} setBlanks={setBlanks} />}

      {!isStructured && !isManualOnly && (
        <Field
          label="Правильный ответ"
          hint="Необязательно. Если указан и включена автопроверка — ответ ученика сверяется автоматически."
        >
          <input value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className={inputClass} />
        </Field>
      )}

      {isManualOnly && (
        <div className="rounded-xl bg-amber-50 px-3.5 py-3 text-[13px] font-medium text-amber-700">
          Задания типа «{TASK_TYPES.find((t) => t.value === type)?.label}» проверяются только вручную преподавателем —
          автопроверка для них недоступна.
        </div>
      )}

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
        {!isStructured && !isManualOnly && (
          <label className="flex items-center gap-2.5 pb-3">
            <input
              type="checkbox"
              checked={autoCheck}
              onChange={(e) => setAutoCheck(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-ze-border accent-ze-primary"
            />
            <span className="text-[13.5px] font-medium text-ze-ink">Автопроверка ответа</span>
          </label>
        )}
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
