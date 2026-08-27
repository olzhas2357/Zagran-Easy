"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Пользователи", icon: "👥" },
  { href: "/admin/students", label: "Студенты", icon: "🎓" },
  { href: "/admin/leads", label: "Заявки", icon: "📋" },
];

function SidebarContent({ fullName, onLogout, onNavigate }: { fullName: string | null; onLogout: () => void; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[240px] flex-none flex-col bg-slate-900 p-3.5 text-white">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-[12px] font-extrabold">ZE</div>
        <div className="text-[13px] font-bold">Admin Panel</div>
      </div>
      <nav className="mt-4 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                active ? "bg-blue-600 font-semibold text-white" : "text-white/65 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-4">
        <div className="px-1 text-[12.5px] text-white/70">{fullName || "Админ"}</div>
        <button
          onClick={onLogout}
          className="rounded-lg bg-white/8 px-3 py-2.5 text-left text-[13px] font-semibold text-white hover:bg-white/16"
        >
          🚪 Выход
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ fullName }: { fullName: string | null }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <>
      <div className="hidden md:block">
        <SidebarContent fullName={fullName} onLogout={handleLogout} />
      </div>

      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 text-white md:hidden">
        <span className="text-[14px] font-bold">ZagranEasy Admin</span>
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

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <SidebarContent fullName={fullName} onLogout={handleLogout} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
