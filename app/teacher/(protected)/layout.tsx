import { redirect } from "next/navigation";
import { getCurrentTeacher } from "@/lib/teacher-data";
import { getSessionUser, getToken } from "@/lib/session-data";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";

export default async function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  const session = await getSessionUser();
  if (!session) {
    const token = await getToken();
    redirect(token ? "/auth/session-expired?login=/teacher/login&next=/teacher" : "/teacher/login");
  }
  const teacher = await getCurrentTeacher();
  if (!teacher) redirect("/teacher/login");

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F7F9FC] md:flex-row">
      <TeacherSidebar profile={teacher} />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
