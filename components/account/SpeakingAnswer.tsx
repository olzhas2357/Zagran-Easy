"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { uploadSpeakingAudio } from "@/lib/student-actions";
import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";
import { formatAudioDuration, parseSpeakingSubmission } from "@/lib/task-types";

export function SpeakingAnswer({ taskId, initialAnswer }: { taskId: string; initialAnswer: string | null }) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef(0);
  const initialSubmission = parseSpeakingSubmission(initialAnswer);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(initialSubmission?.url ?? "");
  const [durationSeconds, setDurationSeconds] = useState(initialSubmission?.durationSeconds ?? 0);
  const [recordError, setRecordError] = useState<string | null>(null);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => {
      setDurationSeconds(Math.max(0, (Date.now() - recordingStartedAtRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => () => recorderRef.current?.stop(), []);

  async function startRecording() {
    setRecordError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setRecordError("Браузер не поддерживает запись аудио");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // MP4/M4A plays reliably in Safari/iPhone as well as Chromium. Keep WebM
      // as a fallback for browsers that cannot record MP4.
      const mimeType = ["audio/mp4", "audio/mp4;codecs=mp4a.40.2", "audio/webm;codecs=opus", "audio/webm"].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
      };
      recorderRef.current = recorder;
      recordingStartedAtRef.current = Date.now();
      setDurationSeconds(0);
      recorder.start();
      setRecording(true);
    } catch {
      setRecordError("Не удалось получить доступ к микрофону");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRecordError(null);
    if (recording) {
      setRecordError("Сначала остановите запись");
      return;
    }

    if (chunksRef.current.length > 0) {
      setUploading(true);
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0].type || "audio/webm" });
      const extension = blob.type.includes("mp4") ? "m4a" : "webm";
      const formData = new FormData();
      formData.set("file", new File([blob], `speaking-${Date.now()}.${extension}`, { type: blob.type }));
      const upload = await uploadSpeakingAudio(formData);
      setUploading(false);
      if (!upload.success || !upload.url) {
        setRecordError(upload.error || "Не удалось загрузить запись");
        return;
      }
      setRecordedUrl(upload.url);
      chunksRef.current = [];
      submit(JSON.stringify({ url: upload.url, durationSeconds: Math.max(1, Math.round(durationSeconds)) }));
      return;
    }

    if (!recordedUrl) {
      setRecordError("Запишите ответ перед отправкой");
      return;
    }
    submit(JSON.stringify({ url: recordedUrl, durationSeconds: durationSeconds || null }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-[13px] font-semibold text-ze-muted">Ваш устный ответ</div>
      {recordedUrl && <audio controls preload="metadata" src={recordedUrl} className="w-full" />}
      {(recording || recordedUrl) && (
        <div className="text-[13px] font-semibold tabular-nums text-ze-muted">
          Длительность: {formatAudioDuration(durationSeconds) || "0:00"}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        {recording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-red-700"
          >
            <Square className="h-4 w-4" fill="currentColor" strokeWidth={2} />
            Остановить запись
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            disabled={uploading || isPending}
            className="flex items-center gap-2 rounded-xl border border-ze-border bg-white px-4 py-3 text-[14px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary disabled:opacity-60"
          >
            <Mic className="h-4 w-4" strokeWidth={2} />
            Записать ответ
          </button>
        )}
        {uploading && <span className="text-[13px] text-ze-muted">Загружаем запись...</span>}
      </div>

      {(recordError || error) && <SubmitStatus error={recordError || error} done={false} />}
      {done && <SubmitStatus error={null} done />}
      <SubmitButton isPending={isPending || uploading} hasInitial={!!initialAnswer} />
    </form>
  );
}
