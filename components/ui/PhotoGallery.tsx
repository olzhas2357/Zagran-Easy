"use client";

import { useState } from "react";

// Главное фото + лента миниатюр, клик открывает полноэкранный просмотр
// со стрелками — используется и для фото кампуса, и для фото общежития.
export function PhotoGallery({ images, alt }: { images: string[]; alt: string }) {
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
        className="block aspect-16/10 w-full overflow-hidden rounded-2xl border border-ze-border sm:aspect-[16/9]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </button>

      {images.length > 1 && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-[62px] w-[86px] flex-none overflow-hidden rounded-lg border-2 ${
                i === active ? "border-ze-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[20px] text-white hover:bg-white/20"
          >
            ✕
          </button>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[24px] text-white hover:bg-white/20 sm:left-6"
            >
              ‹
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={alt}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[24px] text-white hover:bg-white/20 sm:right-6"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
