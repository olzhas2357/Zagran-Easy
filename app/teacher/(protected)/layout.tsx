import { redirect } from "next/navigation";
import { getCurrentTeacher } from "@/lib/teacher-data";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";

export default async function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  const teacher = await getCurrentTeacher();
  if (!teacher) redirect("/teacher/login");

  return (
    <div className="flex flex-1 flex-col items-stretch bg-[#F7F9FC] md:flex-row">
      <TeacherSidebar profile={teacher} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
