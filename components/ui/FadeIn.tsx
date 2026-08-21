"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={fadeInUp.initial}
      whileInView={fadeInUp.animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...fadeInUp.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
