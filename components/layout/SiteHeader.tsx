"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navigation";
import { waUrl } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ze-border bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[62px] max-w-6xl items-center gap-3 px-4 sm:h-[72px] sm:px-10">
        <Link href="/" className="flex flex-none items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-ze-primary text-[14px] font-extrabold tracking-wide text-white">
            ZE
          </span>
          <span className="text-[17px] font-bold tracking-tight text-ze-ink">ZagranEasy</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.filter((item) => item.href !== "/").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[9px] px-3 py-2 text-[14.5px] font-medium text-slate-700 transition-colors hover:bg-[#F1F5FB] hover:text-ze-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            href="/account"
            className="flex items-center gap-2 rounded-[11px] border border-ze-border bg-white py-1.5 pl-1.5 pr-3 text-[13.5px] font-semibold text-ze-ink transition-colors hover:border-ze-primary"
          >
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#EBF1FE] text-[11px] font-bold text-ze-primary">
              К
            </span>
            Кабинет
          </Link>
          <a
            href={waUrl("Здравствуйте! Хочу оставить заявку на консультацию.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-ze-primary px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ze-primary-dark"
          >
            Оставить заявку
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
          className="ml-auto flex h-10 w-10 flex-none flex-col items-center justify-center gap-1 rounded-[11px] border border-ze-border bg-white md:hidden"
        >
          <span className="h-0.5 w-4 rounded-full bg-ze-ink" />
          <span className="h-0.5 w-4 rounded-full bg-ze-ink" />
          <span className="h-0.5 w-4 rounded-full bg-ze-ink" />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-ze-border px-4 pb-4 pt-2 md:hidden">
          {NAV_ITEMS.filter((item) => item.href !== "/").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-[10px] px-2.5 py-3 text-[16px] font-medium text-ze-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="rounded-[10px] px-2.5 py-3 text-[16px] font-medium text-ze-ink"
          >
            Кабинет
          </Link>
          <a
            href={waUrl("Здравствуйте! Хочу оставить заявку на консультацию.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-xl bg-ze-primary px-5 py-3.5 text-center text-[15px] font-semibold text-white"
          >
            Оставить заявку
          </a>
        </div>
      )}
    </header>
  );
}
