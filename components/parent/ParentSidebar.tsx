"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby, CalendarDays, ClipboardList, CreditCard, LayoutGrid, Mail, Menu, UserRound, X } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import type { ParentProfile } from "@/lib/parent-data";

const NAV = [
  { href: "/parents", label: "Главная", Icon: LayoutGrid },
  { href: "/parents/children", label: "Мои дети", Icon: Baby },
  { href: "/parents/schedule", label: "Расписание", Icon: CalendarDays },
  { href: "/parents/homework", label: "Домашние задания", Icon: ClipboardList },
  { href: "/parents/payments", label: "Оплата", Icon: CreditCard },
  { href: "/parents/messages", label: "Сообщения", Icon: Mail },
  { href: "/parents/profile", label: "Профиль", Icon: UserRound },
];

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SidebarContent({ profile, onNavigate }: { profile: ParentProfile; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[252px] flex-none flex-col border-r border-ze-border bg-white p-4 text-ze-ink">
      <Link href="/parents" onClick={onNavigate} className="flex items-center gap-2.5 px-1.5 py-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Baby className="h-5 w-5" /></span>
        <span className="text-[14px] font-extrabold tracking-tight">Кабинет родителя</span>
      </Link>
      <nav className="mt-6 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === "/parents" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${active ? "bg-amber-50 font-semibold text-amber-800" : "text-ze-muted hover:bg-slate-50 hover:text-ze-ink"}`}>
              <Icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3 border-t border-ze-border pt-4">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-100 text-[12px] font-bold text-amber-800">{initials(profile.fullName)}</span>
          <div className="min-w-0"><div className="truncate text-[13px] font-semibold">{profile.fullName}</div><div className="truncate text-[12px] text-ze-muted">{profile.email || "Родитель"}</div></div>
        </div>
        <SignOutButton redirectTo="/parents/login" className="rounded-xl bg-slate-100 px-3 py-2.5 text-[13.5px] font-semibold text-ze-ink hover:bg-slate-200" />
      </div>
    </div>
  );
}

export function ParentSidebar({ profile }: { profile: ParentProfile }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block"><SidebarContent profile={profile} /></div>
      <div className="flex items-center justify-between border-b border-ze-border bg-white px-4 py-3.5 md:hidden">
        <span className="text-[14.5px] font-bold">Кабинет родителя</span>
        <button aria-label="Открыть меню" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-ze-muted hover:bg-slate-100"><Menu className="h-5 w-5" /></button>
      </div>
      {mobileOpen && <div className="fixed inset-0 z-50 md:hidden"><div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} /><div className="absolute inset-y-0 left-0"><div className="relative h-full"><button aria-label="Закрыть меню" onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 z-10 rounded-lg p-2 text-ze-muted"><X className="h-5 w-5" /></button><SidebarContent profile={profile} onNavigate={() => setMobileOpen(false)} /></div></div></div>}
    </>
  );
}