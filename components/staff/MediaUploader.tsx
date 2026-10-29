"use client";

import { useRef, useState, useTransition } from "react";
import { X, Upload } from "lucide-react";
import { uploadUniversityFile } from "@/lib/staff-actions";

// Несколько фото: миниатюры с удалением + drag&drop зона добавления.
// Используется для фото кампуса и фото общежития.
export function ImageListUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    startTransition(async () => {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        try {
          const fd = new FormData();
          fd.set("file", file);
          const res = await uploadUniversityFile(fd);
          if (res.success && res.url) uploaded.push(res.url);
          else setError(res.error || "Не удалось загрузить файл");
        } catch {
          setError("Не удалось загрузить файл. Проверьте соединение и размер файла.");
        }
      }
      if (uploaded.length > 0) onChange([...valueRef.current, ...uploaded]);
    });
  }

  return (
    <div>
      <div className="mb-1.5 text-[11.5px] font-semibold text-ze-muted">{label}</div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={url + i} className="group relative h-[64px] w-[64px] overflow-hidden rounded-lg border border-ze-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Удалить фото"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed px-3 py-3 text-center text-[12px] font-medium transition-colors ${
          dragOver ? "border-ze-primary bg-[#EBF1FE] text-ze-primary" : "border-ze-border text-ze-muted hover:border-slate-300"
        }`}
      >
        <span className="flex items-center justify-center gap-1.5">
          <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
          {isPending ? "Загружаем…" : "Перетащите фото сюда или нажмите, чтобы выбрать"}
        </span>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {error && <div className="mt-1.5 text-[12px] text-red-600">{error}</div>}
    </div>
  );
}

// Один файл (PDF презентации или обложка): загрузить / заменить / убрать.
export function SingleFileUploader({
  label,
  value,
  onChange,
  accept,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  accept: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("file", file);
        const res = await uploadUniversityFile(fd);
        if (res.success && res.url) onChange(res.url);
        else setError(res.error || "Не удалось загрузить файл");
      } catch {
        setError("Не удалось загрузить файл. Проверьте соединение и размер файла.");
      }
    });
  }

  return (
    <div>
      <div className="mb-1.5 text-[11.5px] font-semibold text-ze-muted">{label}</div>
      <div className="flex items-center gap-2">
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate rounded-lg border border-ze-border bg-white px-2.5 py-2 text-[12px] text-ze-primary hover:underline"
          >
            {decodeURIComponent(value.split("/").pop() || value)}
          </a>
        ) : (
          <div className="flex-1 text-[12px] text-ze-muted">Файл не загружен</div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="flex-none rounded-lg border border-ze-border bg-[#F4F6FA] px-3 py-2 text-[12px] font-semibold text-slate-700 hover:border-slate-300 disabled:opacity-50"
        >
          {isPending ? "Загружаем…" : value ? "Заменить" : "Загрузить"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex-none rounded-lg border border-ze-border bg-white px-2.5 py-2 text-slate-500 hover:border-slate-300"
            aria-label="Удалить файл"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => handleFile(e.target.files)} />
      </div>
      {error && <div className="mt-1.5 text-[12px] text-red-600">{error}</div>}
    </div>
  );
}
