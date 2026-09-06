// ============================================================
// ZagranEasy — единый источник правды для типов заданий (TaskType).
// Раньше список типов дублировался в TaskForm.tsx (10 значений) и в
// TYPE_LABEL на странице банка заданий (6 других значений) — они не
// совпадали, из-за чего часть типов отображалась "как есть" (сырым
// значением enum). Теперь оба места импортируют TASK_TYPES отсюда.
// ============================================================

export type TaskType =
  | "multiple_choice"
  | "multiple_select"
  | "fill_blanks"
  | "matching"
  | "vocabulary"
  | "grammar"
  | "reading"
  | "listening"
  | "writing"
  | "speaking";

export const TASK_TYPES: { value: TaskType; label: string }[] = [
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

export const TASK_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  TASK_TYPES.map((t) => [t.value, t.label])
);

// Письмо и говорение — всегда ручная проверка преподавателем (см. backend
// tasks.service.ts submit(): для этих типов is_correct всегда null,
// независимо от флага auto_check).
export const MANUAL_ONLY_TYPES: TaskType[] = ["writing", "speaking"];

// Типы с собственной структурой данных в поле `options` (см. ниже),
// а не просто question + correctAnswer.
export const STRUCTURED_TYPES: TaskType[] = ["multiple_choice", "multiple_select", "matching", "fill_blanks"];

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceOptions {
  choices: ChoiceOption[];
  correctId: string;
}

export interface MultipleSelectOptions {
  choices: ChoiceOption[];
  correctIds: string[];
}

// Пара хранится под одним id — так и в задании (эталон), и в ответе ученика
// не нужно различать "левый"/"правый" идентификатор: правильный ответ для
// пары с id=p — это выбор правого варианта с тем же id=p.
export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingOptions {
  pairs: MatchingPair[];
}

// Текст с пропусками — в `question` пропуски отмечены как ___.
// blanks[i] — допустимые варианты ответа для i-го пропуска (через "|").
export interface FillBlanksOptions {
  blanks: string[];
}

/** Человекочитаемое представление ответа ученика (вместо сырого JSON) для карточек учителя/ученика. */
export function formatAnswerForDisplay(
  type: string | null,
  options: Record<string, unknown> | null | undefined,
  rawAnswer: string | null
): string {
  if (!rawAnswer) return "";

  if (type === "multiple_choice") {
    const opts = options as unknown as MultipleChoiceOptions | null;
    const choice = opts?.choices?.find((c) => c.id === rawAnswer);
    return choice?.text ?? rawAnswer;
  }

  if (type === "multiple_select") {
    const opts = options as unknown as MultipleSelectOptions | null;
    const ids = parseJsonArray(rawAnswer);
    return ids.map((id) => opts?.choices?.find((c) => c.id === id)?.text ?? id).join(", ");
  }

  if (type === "matching") {
    const opts = options as unknown as MatchingOptions | null;
    const map = parseJsonRecord(rawAnswer);
    const pairs = opts?.pairs ?? [];
    if (!pairs.length) return rawAnswer;
    return pairs
      .map((p) => {
        const chosenId = map[p.id];
        const chosenRight = pairs.find((x) => x.id === chosenId)?.right;
        return `${p.left} → ${chosenRight ?? "—"}`;
      })
      .join("; ");
  }

  if (type === "fill_blanks") {
    const answers = parseJsonArray(rawAnswer);
    if (!answers.length) return rawAnswer;
    return answers.map((a, i) => `${i + 1}. ${a}`).join("; ");
  }

  return rawAnswer;
}

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [raw];
  } catch {
    return [raw];
  }
}

function parseJsonRecord(raw: string): Record<string, string> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
