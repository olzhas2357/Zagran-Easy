"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ImageLightboxProps = {
  images: string[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  alt?: string;
};

export function ImageLightbox({
  images,
  index,
  onIndex,
  onClose,
  alt = "Изображение",
}: ImageLightboxProps) {
  const touchStartX = useRef<number | null>(null);

  function go(delta: number) {
    onIndex((index + delta + images.length) % images.length);
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (images.length > 1 && event.key === "ArrowLeft") go(-1);
      if (images.length > 1 && event.key === "ArrowRight") go(1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  });

  if (images.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображений"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null || images.length < 2) return;
        const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 50) return;
        go(delta > 0 ? -1 : 1);
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Закрыть просмотр"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6"
            aria-label="Предыдущее изображение"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
            aria-label="Следующее изображение"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      <div
        className="relative h-[82vh] w-[calc(100vw-2rem)] max-w-6xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          unoptimized
          priority
        />
      </div>

      <div className="pointer-events-none absolute bottom-4 rounded-full bg-black/35 px-3 py-1.5 text-sm font-semibold text-white/90">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
