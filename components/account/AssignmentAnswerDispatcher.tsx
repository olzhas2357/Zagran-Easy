"use client";

import { AssignmentAnswerForm } from "./AssignmentAnswerForm";
import { MultipleChoiceAnswer } from "./MultipleChoiceAnswer";
import { MultipleSelectAnswer } from "./MultipleSelectAnswer";
import { MatchingAnswer } from "./MatchingAnswer";
import { FillBlanksAnswer } from "./FillBlanksAnswer";
import { SpeakingAnswer } from "./SpeakingAnswer";
import { ListeningAnswer } from "./ListeningAnswer";
import { ComprehensionAnswer } from "./ComprehensionAnswer";
import type { ComprehensionOptions, FillBlanksOptions, MatchingOptions, MultipleChoiceOptions, MultipleSelectOptions } from "@/lib/task-types";

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
    return <ComprehensionAnswer taskId={taskId} options={taskOptions as unknown as ComprehensionOptions} audioUrl={taskAudioUrl} initialAnswer={initialAnswer} />;
  }

  if (taskType === "listening" && taskAudioUrl) {
    return <ListeningAnswer taskId={taskId} audioUrl={taskAudioUrl} initialAnswer={initialAnswer} />;
  }

  // vocabulary/grammar/reading/listening/writing — текстовый ответ.
  const wordLimit = taskType === "writing" && typeof taskOptions?.wordLimit === "number" ? taskOptions.wordLimit : undefined;
  return <AssignmentAnswerForm taskId={taskId} initialAnswer={initialAnswer} wordLimit={wordLimit} />;
}
