"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutGrid,
  Menu,
  MessageCircle,
  Video,
  X,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { waUrl } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Главная", Icon: LayoutGrid },
  { href: "/account/course", label: "Мой курс", Icon: GraduationCap },
  { href: "/account/syllabus", label: "Syllabus", Icon: FileText },
  { href: "/account/lessons", label: "Уроки", Icon: Video },
  { href: "/account/homework", label: "Домашние задания", Icon: ClipboardList },
  // { href: "/account/schedule", label: "Расписание", Icon: CalendarDays },
];

function initials(email?: string) {
  return email?.slice(0, 1).toUpperCase() || "С";
}

function SidebarContent({ email, onNavigate }: { email?: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[260px] flex-none flex-col border-r border-ze-border bg-white p-4 text-ze-ink">
      <Link href="/account" onClick={onNavigate} className="flex flex-none items-center gap-2.5 px-1.5 py-1.5">
        <Image src="/logo-icon.png" alt="ZagranEasy" width={669} height={477} priority className="h-8 w-auto" />
        <div>
          <div className="text-[15px] font-extrabold tracking-tight">ZagranEasy</div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-ze-muted">Кабинет студента</div>
        </div>
      </Link>

      <div className="mt-6 px-3 text-[10.5px] font-bold uppercase tracking-[0.13em] text-slate-400">Обучение</div>
      <nav className="mt-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
                active ? "bg-blue-50 font-semibold text-ze-primary" : "text-ze-muted hover:bg-slate-50 hover:text-ze-ink"
              }`}
            >
              <item.Icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.9} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mb-3 rounded-2xl bg-[#F1F6FF] p-3.5">
        <div className="flex items-center gap-2 text-[13px] font-bold text-ze-ink">
          <BookOpen className="h-4 w-4 text-ze-primary" strokeWidth={1.9} />
          Нужна помощь?
        </div>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-ze-muted">Менеджер поможет с курсом и расписанием.</p>
        <a
          href={waUrl("Здравствуйте! Пишу из личного кабинета студента.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-ze-whatsapp px-3 py-2.5 text-[12.5px] font-bold text-white hover:bg-ze-whatsapp-dark"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
          Написать в WhatsApp
        </a>
      </div>

      <div className="flex flex-none flex-col gap-2.5 border-t border-ze-border pt-4">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-50 text-[12px] font-bold text-ze-primary">
            {initials(email)}
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-ze-muted">Студент</div>
            <div className="truncate text-[12.5px] font-semibold text-ze-ink">{email || "Личный кабинет"}</div>
          </div>
        </div>
        <SignOutButton redirectTo="/account/login" className="rounded-xl bg-slate-100 px-3 py-2.5 text-[13px] font-semibold text-ze-ink hover:bg-slate-200" />
      </div>
    </div>
  );
}

export function StudentSidebar({ email }: { email?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block">
        <SidebarContent email={email} />
      </div>

      <div className="flex items-center justify-between border-b border-ze-border bg-white px-4 py-3 md:hidden">
        <Link href="/account" className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="ZagranEasy" width={669} height={477} priority className="h-7 w-auto" />
          <span className="text-[14.5px] font-extrabold">ZagranEasy</span>
        </Link>
        <button
          type="button"
          aria-label="Открыть меню"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-ze-muted hover:bg-slate-100"
        >
          <Menu className="h-5.5 w-5.5" strokeWidth={2} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Закрыть меню" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <SidebarContent email={email} onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={() => setMobileOpen(false)}
            className="absolute left-[272px] top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ze-ink shadow-lg"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}
    </>
  );
}
