import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/staff-data";
import { StaffSidebar } from "@/components/staff/StaffSidebar";

export default async function StaffLayout({ children }: LayoutProps<"/staff">) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/staff/login");
  if (profile.role !== "admin" && profile.role !== "manager") redirect("/staff/login");

  return (
    <div className="flex flex-1 items-stretch bg-[#F7F9FC]">
      <StaffSidebar profile={profile} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
