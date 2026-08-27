"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TeacherProfile } from "@/lib/types";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/teacher", label: "Dashboard", icon: "📊" },
  { href: "/teacher/students", label: "Мои ученики", icon: "👥" },
  { href: "/teacher/lessons", label: "Уроки", icon: "📚" },
  { href: "/teacher/assignments", label: "Задания", icon: "📝" },
  { href: "/teacher/materials", label: "Материалы", icon: "📁" },
  { href: "/teacher/profile", label: "Профиль", icon: "👤" },
];

function SidebarContent({ profile, onNavigate }: { profile: TeacherProfile; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[240px] flex-none flex-col bg-ze-navy p-3.5 text-white">
      <div className="px-2 text-[12px] font-bold uppercase tracking-wide text-white/40">Панель преподавателя</div>
      <nav className="mt-3.5 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = item.href === "/teacher" ? pathname === "/teacher" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                active ? "bg-white/12 font-semibold text-white" : "text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-4">
        <div className="px-1">
          <div className="text-[12.5px] text-white/70">{profile.fullName || "Без имени"}</div>
          {profile.specializations.length > 0 && (
            <div className="mt-1 text-[12.5px] text-white/50">{profile.specializations.join(", ")}</div>
          )}
        </div>
        <SignOutButton redirectTo="/teacher/login" className="rounded-[10px] bg-white/8 px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-white/16" />
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
      <div className="flex items-center justify-between border-b border-ze-border bg-ze-navy px-4 py-3 text-white md:hidden">
        <span className="text-[14px] font-bold">Панель преподавателя</span>
        <button
          aria-label="Открыть меню"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
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
