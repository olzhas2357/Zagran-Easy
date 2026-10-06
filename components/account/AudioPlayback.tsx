"use client";

import { useRef, useState } from "react";
import { Download, RefreshCw, TriangleAlert } from "lucide-react";

export function AudioPlayback({ url }: { url: string; mimeType?: string | null }) {
  const [failed, setFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div>
      <audio
        ref={audioRef}
        key={url}
        controls
        preload="metadata"
        src={url}
        className="w-full"
        onCanPlay={() => setFailed(false)}
        onError={() => setFailed(true)}
      />
      {failed && (
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-amber-900">
          <div className="flex gap-2">
            <TriangleAlert className="mt-0.5 h-4 w-4 flex-none" />
            <span>Не удалось загрузить запись во встроенном плеере. Можно повторить загрузку или открыть исходный файл.</span>
          </div>
          <button type="button" onClick={() => { setFailed(false); audioRef.current?.load(); }} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-amber-950 hover:underline">
            <RefreshCw className="h-3.5 w-3.5" />Повторить загрузку
          </button>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        download
        className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ze-primary hover:underline"
      >
        <Download className="h-3.5 w-3.5" />
        Открыть или скачать запись
      </a>
    </div>
  );
}
