"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, BookOpen, ClipboardList, FolderOpen, UserCircle, Menu } from "lucide-react";
import type { TeacherProfile } from "@/lib/types";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/teacher", label: "Главная", Icon: LayoutGrid },
  { href: "/teacher/students", label: "Мои ученики", Icon: Users },
  { href: "/teacher/lessons", label: "Уроки", Icon: BookOpen },
  { href: "/teacher/assignments", label: "Задания", Icon: ClipboardList },
  { href: "/teacher/materials", label: "Материалы", Icon: FolderOpen },
  { href: "/teacher/profile", label: "Профиль", Icon: UserCircle },
];

function initials(name: string | null) {
  if (!name) return "П";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

function SidebarContent({ profile, onNavigate }: { profile: TeacherProfile; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[248px] flex-none flex-col bg-ze-navy p-4 text-white">
      <div className="flex items-center gap-2.5 px-1.5 py-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ze-primary text-[13px] font-extrabold">ZE</div>
        <div className="text-[13.5px] font-bold tracking-tight">Кабинет преподавателя</div>
      </div>
      <nav className="mt-5 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = item.href === "/teacher" ? pathname === "/teacher" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
                active ? "bg-white/12 font-semibold text-white" : "text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              <item.Icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.9} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/12 text-[12px] font-bold uppercase">
            {initials(profile.fullName)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-white/85">{profile.fullName || "Без имени"}</div>
            {profile.specializations.length > 0 && (
              <div className="truncate text-[12px] text-white/50">{profile.specializations.join(", ")}</div>
            )}
          </div>
        </div>
        <SignOutButton redirectTo="/teacher/login" className="rounded-xl bg-white/8 px-3 py-2.5 text-[13.5px] font-semibold text-white hover:bg-white/16" />
      </div>
    </div>
  );
}

export function TeacherSidebar({ profile }: { profile: TeacherProfile }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <SidebarContent profile={profile} />
      </div>

      {/* Mobile header + hamburger */}
      <div className="flex items-center justify-between border-b border-ze-border bg-ze-navy px-4 py-3.5 text-white md:hidden">
        <span className="text-[14.5px] font-bold">Кабинет преподавателя</span>
        <button
          aria-label="Открыть меню"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10"
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
