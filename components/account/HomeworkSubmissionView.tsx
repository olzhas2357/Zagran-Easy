/* eslint-disable @next/next/no-img-element -- uploaded Supabase URLs are dynamic and opened at their original resolution */
import { ImageIcon } from "lucide-react";
import { formatAnswerForDisplay, parseHomeworkSubmission } from "@/lib/task-types";

export function HomeworkSubmissionView({
  answer,
  type,
  options,
}: {
  answer: string | null;
  type: string | null;
  options?: Record<string, unknown> | null;
}) {
  if ((type === "reading" || type === "listening") && Array.isArray(options?.questions)) {
    let answers: Record<string, string> = {};
    try {
      const parsed = answer ? JSON.parse(answer) : {};
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) answers = parsed;
    } catch {
      // Старые неструктурированные ответы покажем обычным текстом ниже.
    }
    const questions = options.questions as Array<{ id?: string; text?: string }>;
    if (questions.length > 0 && Object.keys(answers).length > 0) {
      return (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={question.id ?? index} className="rounded-xl border border-ze-border bg-ze-surface px-3.5 py-3">
              <div className="text-[12.5px] font-semibold text-ze-muted">{index + 1}. {question.text || "Вопрос"}</div>
              <div className="mt-1.5 whitespace-pre-wrap text-[14px] leading-relaxed text-ze-ink">{question.id ? answers[question.id] || "—" : "—"}</div>
            </div>
          ))}
        </div>
      );
    }
  }

  const submission = parseHomeworkSubmission(answer);
  if (!submission) {
    return <div className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-ze-ink">{formatAnswerForDisplay(type, options, answer)}</div>;
  }

  return (
    <div>
      {submission.text && <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-ze-ink">{submission.text}</p>}
      {submission.photos.length > 0 && (
        <div className={`${submission.text ? "mt-4" : ""} grid grid-cols-2 gap-2.5 sm:grid-cols-3`}>
          {submission.photos.map((photo, index) => (
            <a
              key={`${photo.url}-${index}`}
              href={photo.url}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-ze-border bg-ze-surface"
            >
              <img src={photo.url} alt={`Страница ${index + 1}`} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
              <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-slate-950/70 px-2 py-1 text-[11px] font-semibold text-white">
                <ImageIcon className="h-3 w-3" />
                {index + 1}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
