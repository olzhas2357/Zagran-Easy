"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="text-[13.5px] text-slate-400">Загрузка…</div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-[18px] font-bold text-slate-900">Нет доступа</div>
          <p className="mt-1 text-[13.5px] text-slate-500">Эта панель доступна только администраторам.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-stretch bg-slate-50 md:flex-row flex-col">
      <AdminSidebar fullName={user.profile.full_name} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
