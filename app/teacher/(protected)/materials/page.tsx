import Link from "next/link";
import { getCurrentTeacher, getMaterials } from "@/lib/teacher-data";

export default async function TeacherMaterialsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const materials = await getMaterials(teacher.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink">Мои материалы</h1>
        <p className="mt-1 text-[14px] text-ze-muted">Файлы, прикреплённые к вашим урокам.</p>
      </div>

      {materials.length > 0 ? (
        <div className="divide-y divide-ze-border rounded-xl border border-ze-border bg-white">
          {materials.map((m, i) => (
            <div key={m.url + i} className="flex items-center justify-between px-5 py-3.5 text-[13.5px]">
              <div>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ze-primary hover:underline">
                  {m.name}
                </a>
                <div className="text-ze-muted">
                  <Link href={`/teacher/lessons/${m.lessonId}`} className="hover:underline">
                    {m.lessonTitle}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-ze-border bg-white p-5 text-[13.5px] text-ze-muted">
          Материалов пока нет. Загрузите их при создании урока.
        </div>
      )}
    </div>
  );
}
