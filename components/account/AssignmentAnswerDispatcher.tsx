import { AssignmentAnswerForm } from "./AssignmentAnswerForm";
import { MultipleChoiceAnswer } from "./MultipleChoiceAnswer";
import { MultipleSelectAnswer } from "./MultipleSelectAnswer";
import { MatchingAnswer } from "./MatchingAnswer";
import { FillBlanksAnswer } from "./FillBlanksAnswer";
import type { FillBlanksOptions, MatchingOptions, MultipleChoiceOptions, MultipleSelectOptions } from "@/lib/task-types";

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
  initialAnswer,
}: {
  taskId: string;
  taskType: string | null;
  taskQuestion: string | null;
  taskOptions: Record<string, unknown> | null;
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

  // vocabulary/grammar/reading/listening/writing/speaking — текстовый ответ
  // (для speaking аудиозапись пока не реализована, см. известные ограничения).
  return <AssignmentAnswerForm taskId={taskId} initialAnswer={initialAnswer} />;
}
