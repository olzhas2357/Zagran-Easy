"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/staff", label: "Дашборд" },
  { href: "/staff/universities", label: "Университеты" },
  { href: "/staff/leads", label: "Заявки студентов" },
  { href: "/staff/calculator", label: "Калькулятор" },
  { href: "/staff/directory", label: "Справочник" },
];

export function StaffSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();

  return (
    <div className="flex w-[212px] flex-none flex-col bg-ze-navy p-3.5 text-white">
      <div className="px-2 text-[12px] font-bold uppercase tracking-wide text-white/40">Кабинет менеджера</div>
      <nav className="mt-3.5 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = item.href === "/staff" ? pathname === "/staff" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                active ? "bg-white/12 font-semibold text-white" : "text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-4">
        <div className="px-1">
          <div className="text-[12.5px] text-white/70">
            {profile.fullName || "Без имени"} · {profile.role === "admin" ? "админ" : "менеджер"}
          </div>
          {profile.regions.length > 0 && <div className="mt-1 text-[12.5px] text-white/50">{profile.regions.join(", ")}</div>}
        </div>
        <SignOutButton redirectTo="/staff/login" className="rounded-[10px] bg-white/8 px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-white/16" />
      </div>
    </div>
  );
}
