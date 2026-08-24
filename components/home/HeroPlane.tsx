"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function HeroPlane() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute text-ze-primary/70"
        initial={{ x: "-10%", y: "55%", opacity: 0, rotate: 35 }}
        animate={{ x: "110%", y: "-10%", opacity: [0, 1, 1, 0], rotate: 35 }}
        transition={{ duration: 2.6, ease: "easeInOut", delay: 0.3 }}
      >
        <Plane className="h-6 w-6 sm:h-9 sm:w-9" strokeWidth={1.75} />
      </motion.div>
    </div>
  );
}
