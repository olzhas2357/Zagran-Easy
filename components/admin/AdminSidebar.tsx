"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutGrid, Users, GraduationCap, ClipboardList, LogOut, Menu, Landmark } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/admin", label: "Главная", Icon: LayoutGrid },
  { href: "/admin/users", label: "Пользователи", Icon: Users },
  { href: "/admin/teachers", label: "Учителя", Icon: GraduationCap },
  { href: "/admin/students", label: "Студенты", Icon: GraduationCap },
  { href: "/admin/leads", label: "Заявки", Icon: ClipboardList },
  { href: "/admin/universities", label: "Университеты", Icon: Landmark },
];

function SidebarContent({ fullName, onLogout, onNavigate }: { fullName: string | null; onLogout: () => void; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[248px] flex-none flex-col bg-slate-900 p-4 text-white">
      <div className="flex flex-none items-center gap-2.5 px-1.5 py-1">
        <div className="text-[13.5px] font-bold tracking-tight">Админ-панель</div>
      </div>
      <nav className="mt-5 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
                active ? "bg-blue-600 font-semibold text-white" : "text-white/65 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.Icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.9} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-none flex-col gap-2.5 border-t border-white/10 pt-4">
        <div className="px-1 text-[13px] font-medium text-white/85">{fullName || "Админ"}</div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 rounded-xl bg-white/8 px-3 py-2.5 text-left text-[13.5px] font-semibold text-white hover:bg-white/16"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.9} />
          Выход
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ fullName }: { fullName: string | null }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div className="hidden md:block">
        <SidebarContent fullName={fullName} onLogout={handleLogout} />
      </div>

      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3.5 text-white md:hidden">
        <span className="text-[14.5px] font-bold">ZagranEasy Админ</span>
        <button
          aria-label="Открыть меню"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <Menu className="h-5.5 w-5.5" strokeWidth={2} />
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
