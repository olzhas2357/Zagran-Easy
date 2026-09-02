"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { MediaReelTile } from "./MediaReelTile";
import type { MEDIA_REEL_ITEMS } from "@/lib/constants";

const SPEED_PX_PER_SEC = 46;
const COPY_HEADROOM = 2;

// Автопрокрутка ленты фото/видео слева направо (см. requestAnimationFrame-технику
// из LogoLoop в design_site_1.md, адаптированную под Tailwind-стиль проекта).
export function MediaReel({ items }: { items: typeof MEDIA_REEL_ITEMS }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(2);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect().width ?? 0;
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + COPY_HEADROOM;
      setCopyCount(Math.max(2, copiesNeeded));
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    updateDimensions();
    if (!window.ResizeObserver) {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    if (seqRef.current) observer.observe(seqRef.current);
    return () => observer.disconnect();
  }, [isVisible, updateDimensions, items]);

  useEffect(() => {
    if (!isVisible || reduceMotion || seqWidth === 0) return;
    const track = trackRef.current;
    if (!track) return;

    let raf: number;
    let last: number | null = null;
    let offset = 0;

    const animate = (timestamp: number) => {
      if (last === null) last = timestamp;
      const dt = Math.max(0, timestamp - last) / 1000;
      last = timestamp;

      if (!pausedRef.current) {
        offset -= SPEED_PX_PER_SEC * dt;
        offset = ((offset % seqWidth) + seqWidth) % seqWidth;
      }
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, seqWidth, reduceMotion]);

  const sequence = (copyIndex: number) => (
    <div key={copyIndex} ref={copyIndex === 0 ? seqRef : undefined} className="flex flex-none gap-4" aria-hidden={copyIndex > 0}>
      {items.map((item, i) => (
        <MediaReelTile key={`${copyIndex}-${item.id}`} item={item} index={i} src={item.src} />
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[266px] ${reduceMotion ? "overflow-x-auto [scrollbar-width:none]" : "overflow-hidden"}`}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onTouchStart={() => (pausedRef.current = true)}
      onTouchEnd={() => (pausedRef.current = false)}
    >
      {isVisible && (
        <div ref={trackRef} className="flex gap-4">
          {reduceMotion ? sequence(0) : Array.from({ length: copyCount }, (_, i) => sequence(i))}
        </div>
      )}
      {isVisible && !reduceMotion && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent sm:w-16" />
        </>
      )}
    </div>
  );
}
