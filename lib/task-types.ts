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
  | "open_question"
  | "word_order"
  | "reading"
  | "listening"
  | "writing"
  | "speaking";

export const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: "multiple_choice", label: "Один вариант ответа" },
  { value: "multiple_select", label: "Несколько вариантов" },
  { value: "fill_blanks", label: "Заполнить пропуски" },
  { value: "matching", label: "Сопоставление" },
  { value: "open_question", label: "Открытый вопрос" },
  { value: "word_order", label: "Собрать предложение" },
  { value: "reading", label: "Чтение" },
  { value: "listening", label: "Аудирование" },
  { value: "writing", label: "Письмо" },
  { value: "speaking", label: "Говорение" },
];

export const TASK_TYPE_LABEL: Record<string, string> = {
  ...Object.fromEntries(TASK_TYPES.map((t) => [t.value, t.label])),
  vocabulary: "Лексика (старый тип)",
  grammar: "Грамматика (старый тип)",
  error_correction: "Исправить ошибку (старый тип)",
};

// Письмо и говорение — всегда ручная проверка преподавателем (см. backend
// tasks.service.ts submit(): для этих типов is_correct всегда null,
// независимо от флага auto_check).
export const MANUAL_ONLY_TYPES: TaskType[] = ["writing", "speaking", "open_question"];

// Эти типы имеют однозначный эталонный ответ и никогда не должны попадать
// в очередь ручной проверки преподавателя.
export const AUTO_CHECK_TYPES: TaskType[] = ["multiple_choice", "multiple_select", "fill_blanks", "matching"];

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
  rights?: Array<Pick<MatchingPair, "id" | "right">>;
}

// Текст с пропусками — в `question` пропуски отмечены как ___.
// blanks[i] — допустимые варианты ответа для i-го пропуска (через "|").
export interface FillBlanksOptions {
  blanks: string[];
}

export interface ComprehensionQuestion {
  id: string;
  text: string;
}

export interface ComprehensionOptions {
  questions: ComprehensionQuestion[];
  questionCount: 5;
  language?: string;
  mediaKind?: "audio" | "video";
}

export interface SpeakingSubmission {
  url: string;
  durationSeconds: number | null;
  mimeType: string | null;
}

export interface HomeworkPhoto {
  url: string;
  path?: string;
  name: string;
}

export interface HomeworkSubmission {
  kind: "homework_submission";
  text: string;
  photos: HomeworkPhoto[];
}

export type HomeworkSubmissionMode = "photo" | "text" | "choice";

export const HOMEWORK_SUBMISSION_MODE_LABEL: Record<HomeworkSubmissionMode, string> = {
  photo: "Рукописная работа — фото",
  text: "Текст на компьютере",
  choice: "На выбор ученика",
};

export function parseHomeworkSubmission(raw: string | null): HomeworkSubmission | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<HomeworkSubmission>;
    if (parsed.kind !== "homework_submission" || !Array.isArray(parsed.photos)) return null;
    const photos = parsed.photos
      .filter((photo): photo is HomeworkPhoto => Boolean(photo) && typeof photo.url === "string" && Boolean(photo.url))
      .map((photo) => ({
        url: photo.url,
        ...(typeof photo.path === "string" && photo.path ? { path: photo.path } : {}),
        name: typeof photo.name === "string" ? photo.name : "Фото задания",
      }));
    return {
      kind: "homework_submission",
      text: typeof parsed.text === "string" ? parsed.text : "",
      photos,
    };
  } catch {
    return null;
  }
}

export function parseSpeakingSubmission(raw: string | null): SpeakingSubmission | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SpeakingSubmission>;
    if (typeof parsed.url === "string" && parsed.url) {
      return {
        url: parsed.url,
        durationSeconds: typeof parsed.durationSeconds === "number" ? parsed.durationSeconds : null,
        mimeType: typeof parsed.mimeType === "string" ? parsed.mimeType : null,
      };
    }
  } catch {
    // Older submissions contain the URL directly.
  }
  return { url: raw, durationSeconds: null, mimeType: null };
}

export function formatAudioDuration(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;
  const rounded = Math.max(0, Math.round(seconds));
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
}

/** Человекочитаемое представление ответа ученика (вместо сырого JSON) для карточек учителя/ученика. */
export function formatAnswerForDisplay(
  type: string | null,
  options: Record<string, unknown> | null | undefined,
  rawAnswer: string | null
): string {
  if (!rawAnswer) return "";

  const homework = parseHomeworkSubmission(rawAnswer);
  if (homework) {
    const photoLabel = homework.photos.length > 0 ? `Прикреплено фото: ${homework.photos.length}` : "";
    return [homework.text, photoLabel].filter(Boolean).join("\n");
  }

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

  if (type === "reading" || type === "listening") {
    const opts = options as unknown as ComprehensionOptions | null;
    const answers = parseJsonRecord(rawAnswer);
    if (opts?.questions?.length) {
      return opts.questions.map((question, index) => `${index + 1}. ${answers[question.id] || "—"}`).join("; ");
    }
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
