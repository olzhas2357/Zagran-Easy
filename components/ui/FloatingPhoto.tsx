"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { CoverPhoto } from "./CoverPhoto";

// Фото-тайл с бесконечным мягким "парением" (вверх-вниз + лёгкий наклон),
// используется в hero-коллажах и фото-плитках. duration/delay/range задают
// уникальность движения для каждой карточки, чтобы коллаж не двигался в такт.
export function FloatingPhoto({
  src,
  alt,
  className = "",
  range = 10,
  duration = 4,
  delay = 0,
  rotateRange = 2,
}: {
  src: string;
  alt: string;
  className?: string;
  range?: number;
  duration?: number;
  delay?: number;
  rotateRange?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`overflow-hidden rounded-2xl border border-white/60 shadow-[0_10px_30px_rgba(15,23,42,0.14)] ${className}`}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -range, 0],
              rotate: [-rotateRange, rotateRange, -rotateRange],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.06, rotate: 0, transition: { duration: 0.25 } }}
    >
      <CoverPhoto src={src} alt={alt} />
    </motion.div>
  );
}
