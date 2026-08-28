"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/session";

export function SignOutButton({ redirectTo, className }: { redirectTo: string; className?: string }) {
  const router = useRouter();

  async function handleClick() {
    await logoutAction();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        "rounded-xl border border-ze-border bg-white px-4 py-3 text-[14px] font-semibold text-ze-ink hover:border-slate-300"
      }
    >
      Выйти
    </button>
  );
}
