"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Video, ClipboardList, CalendarDays } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { waUrl } from "@/lib/utils";

const NAV = [
  { href: "/account/schedule", label: "Запись на занятия", Icon: CalendarDays },
  { href: "/account/lessons", label: "Мои уроки", Icon: Video },
  { href: "/account/homework", label: "Домашние задания", Icon: ClipboardList },
];

export function StudentHeader({ email }: { email?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/account" ? pathname === "/account" : pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ze-border bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[62px] max-w-6xl items-center gap-3 px-4 sm:h-[68px] sm:px-10">
        <Link href="/account" className="flex flex-none items-center gap-2">
          <Image src="/logo-icon.png" alt="ZagranEasy" width={669} height={477} priority className="h-7 w-auto sm:h-8" />
          <span className="hidden text-[16px] font-bold tracking-tight text-ze-ink sm:inline">ZagranEasy</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 rounded-[9px] px-3 py-2 text-[14px] font-medium transition-colors ${
                isActive(item.href) ? "bg-[#EBF1FE] text-ze-primary" : "text-slate-600 hover:bg-ze-surface hover:text-ze-ink"
              }`}
            >
              <item.Icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2.5 md:flex">
          <a
            href={waUrl("Здравствуйте! Пишу из личного кабинета.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-ze-whatsapp px-4 py-2.5 text-[13.5px] font-bold text-white hover:bg-ze-whatsapp-dark"
          >
            Менеджер в WhatsApp
          </a>
          <SignOutButton redirectTo="/account/login" className="rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ze-ink hover:border-slate-300" />
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
          className="ml-auto flex h-9 w-9 flex-none items-center justify-center rounded-[10px] border border-ze-border text-ze-ink md:hidden"
        >
          {open ? <X className="h-4.5 w-4.5" strokeWidth={2} /> : <Menu className="h-4.5 w-4.5" strokeWidth={2} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ze-border bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[14.5px] font-medium ${
                  isActive(item.href) ? "bg-[#EBF1FE] text-ze-primary" : "text-slate-700"
                }`}
              >
                <item.Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                {item.label}
              </Link>
            ))}
          </nav>
          {email && <div className="mt-3 truncate px-3 text-[12.5px] text-ze-muted">{email}</div>}
          <div className="mt-3 flex gap-2">
            <a
              href={waUrl("Здравствуйте! Пишу из личного кабинета.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-ze-whatsapp px-4 py-2.5 text-center text-[13.5px] font-bold text-white"
            >
              WhatsApp
            </a>
            <SignOutButton
              redirectTo="/account/login"
              className="flex-1 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ze-ink"
            />
          </div>
        </div>
      )}
    </header>
  );
}
