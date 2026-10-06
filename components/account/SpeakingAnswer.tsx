"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { uploadSpeakingAudio } from "@/lib/student-actions";
import { SubmitButton, SubmitStatus, useAnswerSubmit } from "./answer-shared";
import { formatAudioDuration, parseSpeakingSubmission } from "@/lib/task-types";
import { AudioPlayback } from "./AudioPlayback";

export function SpeakingAnswer({ taskId, initialAnswer }: { taskId: string; initialAnswer: string | null }) {
  const { submit, isPending, error, done } = useAnswerSubmit(taskId);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef(0);
  const initialSubmission = parseSpeakingSubmission(initialAnswer);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(initialSubmission?.url ?? "");
  const [recordedMimeType, setRecordedMimeType] = useState(initialSubmission?.mimeType ?? "");
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
      // Prefer a real AAC stream when the browser can create one. Chromium may
      // claim generic audio/mp4 support but write Opus into fragmented MP4,
      // which its own audio player reports as 0:00. WebM/Opus is reliable there.
      const mimeType = [
        "audio/mp4;codecs=mp4a.40.2",
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ].find((type) => MediaRecorder.isTypeSupported(type));
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
      const normalizedMimeType = blob.type.split(";", 1)[0] || "audio/webm";
      setRecordedMimeType(normalizedMimeType);
      chunksRef.current = [];
      submit(JSON.stringify({ url: upload.url, durationSeconds: Math.max(1, Math.round(durationSeconds)), mimeType: normalizedMimeType }));
      return;
    }

    if (!recordedUrl) {
      setRecordError("Запишите ответ перед отправкой");
      return;
    }
    submit(JSON.stringify({ url: recordedUrl, durationSeconds: durationSeconds || null, mimeType: recordedMimeType || null }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-[13px] font-semibold text-ze-muted">Ваш устный ответ</div>
      {recordedUrl && <AudioPlayback url={recordedUrl} mimeType={recordedMimeType} />}
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
