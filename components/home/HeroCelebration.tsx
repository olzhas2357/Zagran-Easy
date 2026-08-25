"use client";

import { motion } from "framer-motion";
import { Plane, GraduationCap } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const PLANES = [
  { size: 22, startLeft: "-10%", startTop: "68%", endLeft: "112%", endTop: "-12%", rotate: 35, delay: 0.2, duration: 2.6 },
  { size: 16, startLeft: "108%", startTop: "78%", endLeft: "-14%", endTop: "8%", rotate: -215, delay: 1, duration: 2.4 },
];

const CAPS = [
  { left: "16%", delay: 0.1, duration: 1.9 },
  { left: "38%", delay: 0.32, duration: 2.05 },
  { left: "60%", delay: 0.5, duration: 1.85 },
  { left: "82%", delay: 0.7, duration: 2.1 },
];

// Праздничный оверлей поверх фото в hero: самолёты + подброшенные шапочки —
// метафора "успешно поступили и улетели" для привлечения внимания клиентов.
export function HeroCelebration() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PLANES.map((p, i) => (
        <motion.div
          key={`plane-${i}`}
          className="absolute text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
          initial={{ left: p.startLeft, top: p.startTop, opacity: 0, rotate: p.rotate }}
          animate={{ left: p.endLeft, top: p.endTop, opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeInOut" }}
        >
          <Plane style={{ width: p.size, height: p.size }} strokeWidth={1.75} />
        </motion.div>
      ))}

      {CAPS.map((c, i) => (
        <motion.div
          key={`cap-${i}`}
          className="absolute bottom-[8%] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
          style={{ left: c.left }}
          initial={{ y: 0, opacity: 0, rotate: -15 }}
          animate={{ y: [0, -120, -10], opacity: [0, 1, 1, 0], rotate: [-15, 200, 340] }}
          transition={{ duration: c.duration, delay: c.delay, ease: "easeOut", times: [0, 0.6, 1] }}
        >
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
        </motion.div>
      ))}
    </div>
  );
}
