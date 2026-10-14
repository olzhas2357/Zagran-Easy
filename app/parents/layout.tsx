import type { ReactNode } from "react";
import { getCurrentParent } from "@/lib/parent-data";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { redirect } from "next/navigation";
import { getSessionUser, getToken } from "@/lib/session-data";

export default async function ParentsLayout({ children }: { children: ReactNode }) {
  const session = await getSessionUser();
  if (!session && await getToken()) {
    redirect("/auth/session-expired?login=/parents/login&next=/parents");
  }
  const parent = await getCurrentParent();
  if (!parent) return <>{children}</>;

  return <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F7F9FC] md:flex-row"><ParentSidebar profile={parent} /><main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main></div>;
}
