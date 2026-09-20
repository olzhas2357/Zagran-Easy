import { getCurrentTeacher } from "@/lib/teacher-data";
import { ProfileForm } from "@/components/teacher/ProfileForm";

function initials(name: string | null) {
  if (!name) return "П";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export default async function TeacherProfilePage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="flex items-center gap-3.5">
        {teacher.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={teacher.imageUrl}
            alt={teacher.fullName || "Преподаватель"}
            className="h-14 w-14 flex-none rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-ze-primary text-[19px] font-bold text-white">
            {initials(teacher.fullName)}
          </div>
        )}
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink sm:text-[26px]">{teacher.fullName || "Без имени"}</h1>
          {teacher.specializations.length > 0 && <p className="mt-1 text-[14px] text-ze-muted">{teacher.specializations.join(", ")}</p>}
        </div>
      </div>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <ProfileForm
          initialBio={teacher.bio ?? ""}
          initialSpecializations={teacher.specializations}
          initialImageUrl={teacher.imageUrl ?? ""}
          initialExperience={teacher.experience ?? ""}
          initialCertificateUrl={teacher.certificateUrl ?? ""}
        />
      </div>
    </div>
  );
}
