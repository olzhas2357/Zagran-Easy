"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type PhotoGalleryProps = {
  images: string[];
  alt?: string;
};

export function PhotoGallery({
  images,
  alt = "Документ",
}: PhotoGalleryProps) {
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const prev = () => {
    setActive((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const next = () => {
    setActive((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  if (!images.length) return null;

  return (
    <>
      <div className="w-full">
        {/* Main document */}
        <div className="group relative overflow-hidden rounded-[24px] border border-ze-border bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
          <div className="relative flex min-h-[360px] items-center justify-center bg-[#F8FAFD] p-4 sm:min-h-[520px] sm:p-8 dark:bg-white/[0.025]">
            <Image
              src={images[active]}
              alt={`${alt} ${active + 1}`}
              width={1200}
              height={800}
              className="max-h-[520px] w-auto max-w-full object-contain transition-opacity duration-300"
              priority={active === 0}
            />

            {/* Expand */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ze-border bg-white/90 text-ze-muted opacity-0 shadow-sm backdrop-blur transition-all duration-300 hover:text-ze-primary group-hover:opacity-100 dark:border-white/10 dark:bg-slate-900/90"
              aria-label="Увеличить документ"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ze-border bg-white/90 text-ze-muted shadow-sm transition hover:text-ze-primary dark:border-white/10 dark:bg-slate-900/90"
                  aria-label="Предыдущий документ"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ze-border bg-white/90 text-ze-muted shadow-sm transition hover:text-ze-primary dark:border-white/10 dark:bg-slate-900/90"
                  aria-label="Следующий документ"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-5 flex items-center justify-center gap-2.5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-12 overflow-hidden rounded-lg border-2 bg-white transition-all duration-200 sm:h-20 sm:w-16 ${
                active === index
                  ? "border-ze-primary shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`Открыть документ ${index + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="mt-3 text-center text-[12px] font-medium text-ze-muted">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Fullscreen */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>

          <Image
            src={images[active]}
            alt={`${alt} ${active + 1}`}
            width={1600}
            height={1200}
            className="max-h-[90vh] w-auto max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}