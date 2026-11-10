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
  const [accountsOpen, setAccountsOpen] = useState(false);
  const pathname = usePathname();

  const isLanguage = pathname?.startsWith("/language");
  const isDark = false;

  const navItems = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? "border-white/[0.08] bg-[#0B132B]/80"
          : "border-slate-200/70 bg-white/85"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center px-4 sm:h-[76px] sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex shrink-0 items-center"
        >
            <Image
              src="/zagraneasy-logo.png"
              alt="ZagranEasy"
              width={1080}
              height={650}
              priority
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-12 lg:h-[54px]"
            />
          </Link>

        {/* DESKTOP NAV */}
        <nav className="ml-8 hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                  active
                    ? isDark
                      ? "bg-white/[0.10] text-white"
                      : "bg-[#F1F5FB] text-ze-primary"
                    : isDark
                      ? "text-white/65 hover:bg-white/[0.06] hover:text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-ze-primary"
                }`}
              >
                {item.label}

                {active && (
                  <motion.span
                    layoutId="header-active"
                    className={`absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full ${
                      isDark ? "bg-white" : "bg-ze-primary"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

          
          {/* <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram ZagranEasy"
            title="Instagram"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              isDark
                ? "border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white"
                : "border-slate-400 bg-white text-slate-500 hover:border-ze-primary/30 hover:text-ze-primary"
            }`}
          >
            <InstagramIcon className="h-[18px] w-[18px]" />
          </a>

          <a
            href={SITE.twoGisUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="2ГИС ZagranEasy"
            title="2ГИС"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              isDark
                ? "border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white"
                : "border-slate-400 bg-white text-slate-500 hover:border-ze-primary/30 hover:text-ze-primary"
            }`}
          >
            <MapPin className="h-[18px] w-[18px]" />
          </a> */}


        {/* RIGHT ACTIONS */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <div className="relative">
            <button
              type="button"
              aria-expanded={accountsOpen}
              onClick={() => setAccountsOpen((value) => !value)}
              className={`group flex h-10 items-center gap-2 rounded-xl border px-2.5 pr-3.5 text-[13.5px] font-semibold transition-all duration-200 ${
                isDark
                  ? "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.09]"
                  : "border-slate-200 bg-white text-ze-ink hover:border-ze-primary/30 hover:bg-[#F8FAFF]"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-transform duration-200 group-hover:scale-105 ${
                  isDark
                    ? "bg-white/10 text-white"
                    : "bg-[#EBF1FE] text-ze-primary"
                }`}
              >
                К
              </span>
              <span>Кабинет</span>
              <span aria-hidden="true" className="text-xs">▾</span>
            </button>
            {accountsOpen && (
              <div
                className={`absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border p-1.5 shadow-lg ${
                  isDark
                    ? "border-white/10 bg-[#0B132B] text-white"
                    : "border-slate-200 bg-white text-ze-ink"
                }`}
              >
                {[
                  { label: "Кабинет студента", href: "/account" },
                  { label: "Кабинет менеджера", href: "/staff" },
                  { label: "Кабинет учителя", href: "/teacher" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAccountsOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isDark
                        ? "hover:bg-white/[0.08]"
                        : "hover:bg-slate-50 hover:text-ze-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href={waUrl("Здравствуйте! Хочу оставить заявку на консультацию.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex h-10 items-center overflow-hidden rounded-xl px-5 text-[14px] font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              isLanguage
                ? "bg-gradient-to-r from-[#2880DE] to-[#22D3EE]"
                : "bg-ze-primary hover:bg-ze-primary-dark"
            }`}
          >
            <span className="relative z-10">Оставить заявку</span>

            <span className="ml-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
          </a>
        </div>

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          className={`ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border md:hidden ${
            isDark
              ? "border-white/10 bg-white/[0.05]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="relative h-4 w-5">
            <motion.span
              animate={{
                rotate: open ? 45 : 0,
                y: open ? 6 : 0,
              }}
              className={`absolute left-0 top-0 h-[2px] w-5 rounded-full ${
                isDark ? "bg-white" : "bg-ze-ink"
              }`}
            />

            <motion.span
              animate={{
                opacity: open ? 0 : 1,
              }}
              className={`absolute left-0 top-[6px] h-[2px] w-5 rounded-full ${
                isDark ? "bg-white" : "bg-ze-ink"
              }`}
            />

            <motion.span
              animate={{
                rotate: open ? -45 : 0,
                y: open ? -6 : 0,
              }}
              className={`absolute left-0 top-3 h-[2px] w-5 rounded-full ${
                isDark ? "bg-white" : "bg-ze-ink"
              }`}
            />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`overflow-hidden border-t md:hidden ${
              isDark
                ? "border-white/[0.08] bg-[#0B132B]/95"
                : "border-slate-200/70 bg-white/95"
            }`}
          >
            <div className="mx-auto max-w-7xl px-4 pb-5 pt-3">
              <nav className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" &&
                      pathname?.startsWith(`${item.href}/`));

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.035,
                        duration: 0.18,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-medium ${
                          active
                            ? isDark
                              ? "bg-white/[0.08] text-white"
                              : "bg-[#F1F5FB] text-ze-primary"
                            : isDark
                              ? "text-white/80 hover:bg-white/[0.05]"
                              : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-slate-400">→</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div
                className={`my-4 h-px ${
                  isDark ? "bg-white/[0.08]" : "bg-slate-100"
                }`}
              />

              <div>
                <button
                  type="button"
                  aria-expanded={accountsOpen}
                  onClick={() => setAccountsOpen((value) => !value)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3.5 text-[15px] font-semibold ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-white"
                      : "border-slate-200 bg-white text-ze-ink"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                        isDark
                          ? "bg-white/10 text-white"
                          : "bg-[#EBF1FE] text-ze-primary"
                      }`}
                    >
                      К
                    </span>
                    Кабинет
                  </span>
                  <span aria-hidden="true" className="text-xs">▾</span>
                </button>
                {accountsOpen && (
                  <div className="mt-1 flex flex-col gap-1 pl-11">
                    {[
                      { label: "Кабинет студента", href: "/account" },
                      { label: "Кабинет менеджера", href: "/staff" },
                      { label: "Кабинет учителя", href: "/teacher" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setOpen(false);
                          setAccountsOpen(false);
                        }}
                        className={`rounded-lg px-3 py-2.5 text-sm ${
                          isDark
                            ? "text-white/80 hover:bg-white/[0.06]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-ze-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a
                href={waUrl(
                  "Здравствуйте! Хочу оставить заявку на консультацию."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 flex items-center justify-center rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white ${
                  isLanguage
                    ? "bg-gradient-to-r from-[#2880DE] to-[#22D3EE]"
                    : "bg-ze-primary"
                }`}
              >
                Оставить заявку
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
