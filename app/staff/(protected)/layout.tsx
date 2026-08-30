import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/staff-data";
import { StaffSidebar } from "@/components/staff/StaffSidebar";

export default async function StaffLayout({ children }: LayoutProps<"/staff">) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/staff/login");
  if (profile.role !== "admin" && profile.role !== "manager") redirect("/staff/login");

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F7F9FC] md:flex-row">
      <StaffSidebar profile={profile} />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
