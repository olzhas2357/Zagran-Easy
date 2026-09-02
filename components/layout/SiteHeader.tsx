"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/navigation";
import { waUrl } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // /language построена как единый тёмно-синий экран от Header до Footer,
  // поэтому именно на этом маршруте хедер переключается в тёмную тему.
  // На остальных страницах сайта поведение и стили не меняются.
  const isLanguage = pathname?.startsWith("/language");

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        isLanguage ? "border-white/10 bg-[#0B132B]/92" : "border-ze-border bg-white/92"
      }`}
    >
      <div className="mx-auto flex h-[62px] max-w-6xl items-center gap-3 px-4 sm:h-[72px] sm:px-10">
        <Link href="/" className="flex flex-none items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/logo-icon.png"
            alt="ZagranEasy"
            width={669}
            height={477}
            priority
            className="h-8 w-auto sm:h-10"
          />
          <span className={`text-[17px] font-bold tracking-tight ${isLanguage ? "text-white" : "text-ze-ink"}`}>
            ZagranEasy
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.filter((item) => item.href !== "/").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[9px] px-3 py-2 text-[14.5px] font-medium transition-colors ${
                isLanguage
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-slate-700 hover:bg-[#F1F5FB] hover:text-ze-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {/*
            Личный кабинет клиента временно не используется — см. app/account.
            Вернуть ссылку, когда кабинет снова понадобится.

          <Link
            href="/account"
            className="flex items-center gap-2 rounded-[11px] border border-ze-border bg-white py-1.5 pl-1.5 pr-3 text-[13.5px] font-semibold text-ze-ink transition-colors hover:border-ze-primary"
          >
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#EBF1FE] text-[11px] font-bold text-ze-primary">
              К
            </span>
            Кабинет
          </Link>
          */}
          <a
            href={waUrl("Здравствуйте! Хочу оставить заявку на консультацию.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-xl px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors ${
              isLanguage ? "bg-gradient-to-r from-[#2880DE] to-[#22D3EE]" : "bg-ze-primary hover:bg-ze-primary-dark"
            }`}
          >
            Оставить заявку
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
          className={`ml-auto flex h-11 w-11 flex-none flex-col items-center justify-center gap-1 rounded-[11px] border md:hidden ${
            isLanguage ? "border-white/15 bg-white/[0.06]" : "border-ze-border bg-white"
          }`}
        >
          <span className={`h-0.5 w-4 rounded-full ${isLanguage ? "bg-white" : "bg-ze-ink"}`} />
          <span className={`h-0.5 w-4 rounded-full ${isLanguage ? "bg-white" : "bg-ze-ink"}`} />
          <span className={`h-0.5 w-4 rounded-full ${isLanguage ? "bg-white" : "bg-ze-ink"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`flex flex-col gap-1 border-t px-4 pb-4 pt-2 md:hidden ${
              isLanguage ? "border-white/10" : "border-ze-border"
            }`}
          >
            {NAV_ITEMS.filter((item) => item.href !== "/").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[10px] px-2.5 py-3 text-[16px] font-medium ${
                  isLanguage ? "text-white" : "text-ze-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Кабинет клиента временно не используется — см. app/account
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-[10px] px-2.5 py-3 text-[16px] font-medium text-ze-ink"
            >
              Кабинет
            </Link>
            */}
            <a
              href={waUrl("Здравствуйте! Хочу оставить заявку на консультацию.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 rounded-xl px-5 py-3.5 text-center text-[15px] font-semibold text-white ${
                isLanguage ? "bg-gradient-to-r from-[#2880DE] to-[#22D3EE]" : "bg-ze-primary"
              }`}
            >
              Оставить заявку
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
