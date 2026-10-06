"use client";
/* eslint-disable @next/next/no-img-element -- uploaded Supabase URLs are dynamic and previewed without a fixed image host */

import { useRef, useState } from "react";
import { Camera, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { SubmitStatus, useAnswerSubmit } from "./answer-shared";
import { uploadHomeworkPhoto } from "@/lib/student-actions";
import { HOMEWORK_SUBMISSION_MODE_LABEL, parseHomeworkSubmission, type HomeworkPhoto, type HomeworkSubmissionMode } from "@/lib/task-types";

async function preparePhoto(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = objectUrl;
    });
    const maxSide = 2000;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!blob) return file;
    const baseName = file.name.replace(/\.[^.]+$/, "") || "homework";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// Универсальная ручная работа: ученик может отправить текст, фотографии
// тетради/листа или оба варианта вместе.
export function AssignmentAnswerForm({ taskId, initialAnswer, wordLimit, submissionMode = "choice" }: { taskId: string; initialAnswer: string | null; wordLimit?: number; submissionMode?: HomeworkSubmissionMode }) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const initialSubmission = parseHomeworkSubmission(initialAnswer);
  const [answer, setAnswer] = useState(initialSubmission?.text ?? (initialSubmission ? "" : initialAnswer ?? ""));
  const [photos, setPhotos] = useState<HomeworkPhoto[]>(initialSubmission?.photos ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const wordCount = answer.trim() ? answer.trim().split(/\s+/u).length : 0;
  const allowText = submissionMode !== "photo";
  const allowPhotos = submissionMode !== "text";
  const validContent = submissionMode === "photo" ? photos.length > 0 : submissionMode === "text" ? Boolean(answer.trim()) : Boolean(answer.trim() || photos.length > 0);
  const wordLimitMissing = allowText && Boolean(wordLimit && answer.trim() && wordCount < wordLimit);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validContent || wordLimitMissing) return;
    submit(JSON.stringify({ kind: "homework_submission", text: answer.trim(), photos }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const available = Math.max(0, 10 - photos.length);
    if (available === 0) return setUploadError("Можно прикрепить не больше 10 фото");
    setUploading(true);
    setUploadError(null);
    const uploaded: HomeworkPhoto[] = [];
    for (const file of Array.from(files).slice(0, available)) {
      const prepared = await preparePhoto(file);
      const formData = new FormData();
      formData.set("file", prepared);
      const result = await uploadHomeworkPhoto(formData);
      if (!result.success || !result.url) {
        setUploadError(result.error || `Не удалось загрузить ${file.name}`);
        break;
      }
      uploaded.push({ url: result.url, path: result.path, name: result.name || file.name || "Фото задания" });
    }
    setPhotos((current) => [...current, ...uploaded]);
    setUploading(false);
    if (galleryInput.current) galleryInput.current.value = "";
    if (cameraInput.current) cameraInput.current.value = "";
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-xl bg-blue-50 px-3.5 py-3 text-[13px] font-semibold text-blue-800">
        Способ сдачи: {HOMEWORK_SUBMISSION_MODE_LABEL[submissionMode]}
      </div>
      {allowText && <label className="block">
        <div className="mb-1.5 flex justify-between gap-3 text-[13px] font-semibold text-ze-muted">
          <span>Комментарий к работе</span>
          {wordLimit && <span className={wordCount < wordLimit ? "text-amber-600" : "text-emerald-700"}>{wordCount} / минимум {wordLimit} слов</span>}
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={8}
          placeholder="Можно написать пояснение к фотографиям…"
          className="w-full resize-none rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary"
        />
      </label>}

      {allowPhotos && <div>
        <div className="mb-2 text-[13px] font-semibold text-ze-muted">Фото работы</div>
        {photos.length > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <div key={`${photo.url}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-ze-border bg-ze-surface">
                <img src={photo.url} alt={`Страница ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white"
                  aria-label={`Удалить фото ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/65 px-2 py-1 text-[11px] font-semibold text-white">{index + 1}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={uploading || photos.length >= 10}
            onClick={() => cameraInput.current?.click()}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ze-primary px-3 py-3 text-[13.5px] font-semibold text-white disabled:opacity-50"
          >
            {uploading ? <LoaderCircle className="h-4.5 w-4.5 animate-spin" /> : <Camera className="h-4.5 w-4.5" />}
            Сделать фото
          </button>
          <button
            type="button"
            disabled={uploading || photos.length >= 10}
            onClick={() => galleryInput.current?.click()}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ze-border bg-white px-3 py-3 text-[13.5px] font-semibold text-ze-ink disabled:opacity-50"
          >
            <ImagePlus className="h-4.5 w-4.5" />
            Из галереи
          </button>
        </div>
        <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => void handleFiles(event.target.files)} />
        <input ref={galleryInput} type="file" accept="image/*" multiple className="hidden" onChange={(event) => void handleFiles(event.target.files)} />
        <p className="mt-2 text-[12px] text-ze-muted">До 10 фото. Снимайте страницы по порядку.</p>
      </div>}

      <SubmitStatus error={uploadError || error} done={done} />
      <button type="submit" disabled={isPending || uploading || !validContent || wordLimitMissing} className="w-full rounded-xl bg-ze-primary px-6 py-3.5 text-[14px] font-semibold text-white disabled:opacity-50 sm:w-fit">
        {isPending ? "Сохраняем…" : initialAnswer ? "Обновить ответ" : "Сохранить ответ"}
      </button>
    </form>
  );
}
