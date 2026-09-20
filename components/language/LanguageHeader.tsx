"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { waUrl } from "@/lib/utils";

const COURSE_WHATSAPP_URL = waUrl("Здравствуйте! Хочу подобрать языковой курс и записаться на пробный урок.");

const NAV = [
  { label: "Курсы", href: "#courses" },
  { label: "Преподаватели", href: "#teachers" },
  { label: "Как проходит обучение", href: "#how-it-works" },
  { label: "Отзывы", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export function LanguageHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7ECF6] bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center gap-3 px-4 sm:h-[76px] sm:px-10">
        <Link href="/language" className="flex flex-none items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2880DE] text-[15px] font-extrabold text-white sm:h-10 sm:w-10">
            Z
          </span>
          <span className="text-[17px] font-bold tracking-tight text-[#0F1B3D]">ZagranEasy</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[9px] px-3 py-2 text-[14.5px] font-medium text-slate-600 transition-colors hover:bg-[#F1F4FC] hover:text-[#2880DE]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2.5 md:flex">
          <Link
            href="/account/login"
            className="rounded-xl px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0F1B3D] transition-colors hover:text-[#2880DE]"
          >
            Войти
          </Link>
          <a
            href={COURSE_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#2880DE] px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[#2066B2]"
          >
            Подобрать курс →
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
          className="ml-auto flex h-11 w-11 flex-none flex-col items-center justify-center gap-1 rounded-[11px] border border-[#E7ECF6] bg-white md:hidden"
        >
          <span className="h-0.5 w-4 rounded-full bg-[#0F1B3D]" />
          <span className="h-0.5 w-4 rounded-full bg-[#0F1B3D]" />
          <span className="h-0.5 w-4 rounded-full bg-[#0F1B3D]" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-1 border-t border-[#E7ECF6] px-4 pb-4 pt-2 md:hidden"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-2.5 py-3 text-[16px] font-medium text-[#0F1B3D]"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/account/login"
              onClick={() => setOpen(false)}
              className="rounded-[10px] px-2.5 py-3 text-[16px] font-medium text-[#0F1B3D]"
            >
              Войти
            </Link>
            <a
              href={COURSE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-[#2880DE] px-5 py-3.5 text-center text-[15px] font-semibold text-white"
            >
              Подобрать курс →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
