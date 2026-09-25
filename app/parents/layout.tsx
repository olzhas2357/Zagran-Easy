import type { ReactNode } from "react";
import { getCurrentParent } from "@/lib/parent-data";
import { ParentSidebar } from "@/components/parent/ParentSidebar";

export default async function ParentsLayout({ children }: { children: ReactNode }) {
  const parent = await getCurrentParent();
  if (!parent) return <>{children}</>;

  return <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F7F9FC] md:flex-row"><ParentSidebar profile={parent} /><main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main></div>;
}