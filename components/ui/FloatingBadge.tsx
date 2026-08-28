"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Плавающий бейдж со статистикой поверх hero-коллажа (например "98% Виза").
// Двигается независимо от FloatingPhoto — другой цикл/фаза для живого ощущения.
export function FloatingBadge({
  icon,
  value,
  label,
  className = "",
  duration = 3.2,
  delay = 0,
}: {
  icon: string;
  value: string;
  label: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute z-20 flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/90 px-3.5 py-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.16)] backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        reduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -8, 0] }
      }
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
      }}
    >
      <span className="text-[18px] leading-none">{icon}</span>
      <div className="leading-tight">
        <div className="text-[14px] font-extrabold text-ze-ink">{value}</div>
        <div className="text-[10.5px] font-medium text-ze-muted">{label}</div>
      </div>
    </motion.div>
  );
}
