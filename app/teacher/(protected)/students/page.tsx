import { getCurrentTeacher, getStudents } from "@/lib/teacher-data";
import { StudentsList } from "@/components/teacher/StudentsList";

export default async function TeacherStudentsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const students = await getStudents(teacher.id);

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Мои ученики</h1>
        <p className="mt-1.5 text-[14.5px] text-ze-muted">{students.length} учеников в вашем кабинете.</p>
      </div>

      <StudentsList students={students} />
    </div>
  );
}
