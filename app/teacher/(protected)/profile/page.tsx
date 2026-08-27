import { getCurrentTeacher } from "@/lib/teacher-data";
import { ProfileForm } from "@/components/teacher/ProfileForm";

export default async function TeacherProfilePage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink">Профиль</h1>
        <p className="mt-1 text-[14px] text-ze-muted">{teacher.fullName || "Без имени"}</p>
      </div>

      <ProfileForm initialBio={teacher.bio ?? ""} initialSpecializations={teacher.specializations} />
    </div>
  );
}
