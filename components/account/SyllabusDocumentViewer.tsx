"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

type ViewerKind = "pdf" | "docx";

export function SyllabusDocumentViewer({ url, fileName, kind }: { url: string; fileName: string; kind: ViewerKind }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(kind === "docx");

  useEffect(() => {
    if (kind !== "docx" || !containerRef.current) return;

    const container = containerRef.current;
    const controller = new AbortController();
    let active = true;

    async function renderDocument() {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Не удалось загрузить документ");
        const documentBlob = await response.blob();
        const { renderAsync } = await import("docx-preview");
        if (!active) return;
        container.replaceChildren();
        await renderAsync(documentBlob, container, container, {
          breakPages: true,
          ignoreLastRenderedPageBreak: false,
          renderAltChunks: false,
          useBase64URL: true,
        });
        if (active) setLoading(false);
      } catch (renderError) {
        if (!active || controller.signal.aborted) return;
        setLoading(false);
        setError(renderError instanceof Error ? renderError.message : "Не удалось показать документ");
      }
    }

    void renderDocument();
    return () => {
      active = false;
      controller.abort();
      container.replaceChildren();
    };
  }, [kind, url]);

  if (kind === "pdf") {
    return (
      <iframe
        src={`${url}#toolbar=1&navpanes=0&view=FitH`}
        title={`Syllabus: ${fileName}`}
        className="h-[72vh] min-h-[560px] w-full bg-slate-100"
      />
    );
  }

  return (
    <div className="relative min-h-[560px] overflow-auto bg-slate-100 p-3 sm:p-6">
      {loading && !error && <div className="absolute inset-x-0 top-8 flex items-center justify-center gap-2 text-[13px] font-medium text-ze-muted"><LoaderCircle className="h-4 w-4 animate-spin" /> Открываем документ…</div>}
      {error && (
        <div className="relative z-10 mx-auto mt-16 max-w-md rounded-2xl border border-red-100 bg-white p-5 text-center text-[13px] text-red-700">
          {error}. Обновите страницу или воспользуйтесь кнопкой скачивания.
        </div>
      )}
      <div ref={containerRef} className="relative z-10 mx-auto [&_.docx-wrapper]:!bg-transparent [&_.docx-wrapper]:!p-0" />
    </div>
  );
}
