"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type PhotoGalleryProps = {
  images: string[];
  alt: string;
  variant?: "default" | "documents";
};

// Главное фото + лента миниатюр, клик открывает полноэкранный просмотр.
export function PhotoGallery({ images, alt, variant = "default" }: PhotoGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  function go(delta: number) {
    setActive((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block w-full overflow-hidden rounded-2xl border border-ze-border bg-white shadow-[0_12px_35px_rgba(15,23,42,0.07)] ${
          variant === "documents" ? "aspect-[4/3] p-3 sm:aspect-[16/10] sm:p-6" : "aspect-16/10 sm:aspect-[16/9]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${alt} ${active + 1}`}
          loading={active === 0 ? "eager" : "lazy"}
          className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.015] ${
            variant === "documents" ? "object-contain" : "object-cover"
          }`}
        />
        {variant === "documents" && (
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/75 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Открыть документ полностью
          </span>
        )}
      </button>

      {images.length > 1 && (
        <div className={`mt-3 flex gap-2 overflow-x-auto pb-1 ${variant === "documents" ? "justify-center sm:mt-4 sm:gap-3" : ""}`}>
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`flex-none overflow-hidden rounded-lg border-2 bg-white transition-all ${
                variant === "documents" ? "h-[84px] w-[58px] sm:h-[104px] sm:w-[74px]" : "h-[62px] w-[86px]"
              } ${
                i === active ? "border-ze-primary shadow-[0_0_0_3px_rgba(26,86,219,0.12)]" : "border-transparent opacity-65 hover:opacity-100"
              }`}
              aria-label={`Открыть документ ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className={`h-full w-full ${variant === "documents" ? "object-contain p-1" : "object-cover"}`} />
            </button>
          ))}
        </div>
      )}

      {variant === "documents" && (
        <div className="mt-2 text-center text-[12px] font-medium text-ze-muted">
          Документ {active + 1} из {images.length}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/92 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Закрыть просмотр"
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              aria-label="Предыдущий документ"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={alt}
            className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              aria-label="Следующий документ"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
