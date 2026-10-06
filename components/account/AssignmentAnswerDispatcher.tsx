"use client";

import { AssignmentAnswerForm } from "./AssignmentAnswerForm";
import { MultipleChoiceAnswer } from "./MultipleChoiceAnswer";
import { MultipleSelectAnswer } from "./MultipleSelectAnswer";
import { MatchingAnswer } from "./MatchingAnswer";
import { FillBlanksAnswer } from "./FillBlanksAnswer";
import { SpeakingAnswer } from "./SpeakingAnswer";
import { ListeningAnswer } from "./ListeningAnswer";
import { ComprehensionAnswer } from "./ComprehensionAnswer";
import { TextAnswer } from "./TextAnswer";
import type { ComprehensionOptions, FillBlanksOptions, HomeworkSubmissionMode, MatchingOptions, MultipleChoiceOptions, MultipleSelectOptions } from "@/lib/task-types";

/**
 * Раньше при решении задания ВСЕГДА рендерился один и тот же textarea-компонент,
 * независимо от taskType — из-за этого "Сопоставление"/"Несколько вариантов" и т.п.
 * фактически решались как обычный текстовый ответ. Здесь тип задания определяет,
 * какой компонент ответа показать.
 */
export function AssignmentAnswerDispatcher({
  taskId,
  taskType,
  taskQuestion,
  taskOptions,
  taskAudioUrl,
  initialAnswer,
}: {
  taskId: string;
  taskType: string | null;
  taskQuestion: string | null;
  taskOptions: Record<string, unknown> | null;
  taskAudioUrl: string | null;
  initialAnswer: string | null;
}) {
  if (taskType === "multiple_choice" && taskOptions) {
    return (
      <MultipleChoiceAnswer taskId={taskId} options={taskOptions as unknown as MultipleChoiceOptions} initialAnswer={initialAnswer} />
    );
  }
  if (taskType === "multiple_select" && taskOptions) {
    return (
      <MultipleSelectAnswer taskId={taskId} options={taskOptions as unknown as MultipleSelectOptions} initialAnswer={initialAnswer} />
    );
  }
  if (taskType === "matching" && taskOptions) {
    return <MatchingAnswer taskId={taskId} options={taskOptions as unknown as MatchingOptions} initialAnswer={initialAnswer} />;
  }
  if (taskType === "fill_blanks" && taskOptions) {
    return (
      <FillBlanksAnswer
        taskId={taskId}
        question={taskQuestion ?? ""}
        options={taskOptions as unknown as FillBlanksOptions}
        initialAnswer={initialAnswer}
      />
    );
  }

  if (taskType === "speaking") {
    return <SpeakingAnswer taskId={taskId} initialAnswer={initialAnswer} />;
  }

  if ((taskType === "reading" || taskType === "listening") && Array.isArray(taskOptions?.questions)) {
    return <ComprehensionAnswer taskId={taskId} options={taskOptions as unknown as ComprehensionOptions} audioUrl={taskAudioUrl} requiresMedia={taskType === "listening"} initialAnswer={initialAnswer} />;
  }

  if (taskType === "listening" && taskAudioUrl) {
    return <ListeningAnswer taskId={taskId} audioUrl={taskAudioUrl} mediaKind={taskOptions?.mediaKind} initialAnswer={initialAnswer} />;
  }

  if (taskType === "listening") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13.5px] font-medium text-amber-900">
        Медиафайл не прикреплён. Сообщите преподавателю — отправка ответа временно недоступна.
      </div>
    );
  }

  if (taskType === "open_question") {
    return <TextAnswer taskId={taskId} initialAnswer={initialAnswer} placeholder="Напишите развёрнутый ответ или комментарий…" autoChecked={false} />;
  }

  // Сохранённые задания старого типа продолжают открываться.
  if (taskType === "error_correction") {
    return <TextAnswer taskId={taskId} initialAnswer={initialAnswer} placeholder="Напишите исправленное предложение…" autoChecked={false} />;
  }

  if (taskType === "word_order") {
    return <TextAnswer taskId={taskId} initialAnswer={initialAnswer} placeholder="Соберите и напишите предложение в правильном порядке…" />;
  }

  // Старые задания продолжают работать после удаления категорий из списка типов.
  if (taskType === "vocabulary" || taskType === "grammar") {
    return <TextAnswer taskId={taskId} initialAnswer={initialAnswer} placeholder="Введите ответ…" />;
  }

  // vocabulary/grammar/reading/listening/writing — текстовый ответ.
  const wordLimit = taskType === "writing" && typeof taskOptions?.wordLimit === "number" ? taskOptions.wordLimit : undefined;
  const submissionMode = taskType === "writing" && ["photo", "text", "choice"].includes(String(taskOptions?.submissionMode))
    ? taskOptions?.submissionMode as HomeworkSubmissionMode
    : "choice";
  return <AssignmentAnswerForm taskId={taskId} initialAnswer={initialAnswer} wordLimit={wordLimit} submissionMode={submissionMode} />;
}
