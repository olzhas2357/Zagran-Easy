"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ClipboardList, BookOpen, CalendarDays, Menu, UsersRound, ListTodo, Library, FolderOpen } from "lucide-react";
import type { Profile } from "@/lib/types";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/staff", label: "Главная", Icon: LayoutGrid },
  { href: "/staff/directory", label: "Университеты", Icon: BookOpen },
  { href: "/staff/materials", label: "Материалы", Icon: FolderOpen },
  { href: "/staff/tasks", label: "Задачи", Icon: ListTodo },
  { href: "/staff/clients", label: "Клиенты", Icon: UsersRound },
  { href: "/staff/leads", label: "Заявки студентов", Icon: ClipboardList },
  { href: "/staff/schedule", label: "Расписание", Icon: CalendarDays },
  { href: "/staff/knowledge", label: "База знаний", Icon: Library },

];

function initials(name: string | null) {
  if (!name) return "М";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

function SidebarContent({ profile, onNavigate }: { profile: Profile; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[228px] flex-none flex-col border-r border-ze-border bg-white p-4 text-ze-ink">
      <div className="flex flex-none items-center gap-2.5 px-1.5 py-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ze-primary text-[13px] font-extrabold text-white">ZE</div>
        <div className="text-[13.5px] font-bold tracking-tight text-ze-ink">Кабинет менеджера</div>
      </div>
      <nav className="mt-5 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.href === "/staff" ? pathname === "/staff" : pathname.startsWith(item.href);
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
      <div className="mt-auto flex flex-none flex-col gap-2.5 border-t border-ze-border pt-4">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-50 text-[12px] font-bold uppercase text-ze-primary">
            {initials(profile.fullName)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-ze-ink">{profile.fullName || "Без имени"}</div>
            <div className="truncate text-[12px] text-ze-muted">{profile.role === "admin" ? "Админ" : "Менеджер"}</div>
            {profile.regions.length > 0 && <div className="truncate text-[11.5px] text-ze-muted/70">{profile.regions.join(", ")}</div>}
          </div>
        </div>
        <SignOutButton redirectTo="/staff/login" className="rounded-xl bg-slate-100 px-3 py-2.5 text-[13.5px] font-semibold text-ze-ink hover:bg-slate-200" />
      </div>
    </div>
  );
}

export function StaffSidebar({ profile }: { profile: Profile }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <SidebarContent profile={profile} />
      </div>

      {/* Mobile header + hamburger */}
      <div className="flex items-center justify-between border-b border-ze-border bg-white px-4 py-3.5 text-ze-ink md:hidden">
        <span className="text-[14.5px] font-bold">Кабинет менеджера</span>
        <button
          aria-label="Открыть меню"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-ze-muted hover:bg-slate-100"
        >
          <Menu className="h-5.5 w-5.5" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <SidebarContent profile={profile} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
