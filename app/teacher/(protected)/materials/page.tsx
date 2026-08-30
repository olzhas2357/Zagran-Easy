import Link from "next/link";
import { FileText, FolderOpen } from "lucide-react";
import { getCurrentTeacher, getMaterials } from "@/lib/teacher-data";

export default async function TeacherMaterialsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const materials = await getMaterials(teacher.id);

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Мои материалы</h1>
        <p className="mt-1.5 text-[14.5px] text-ze-muted">Файлы, прикреплённые к вашим урокам.</p>
      </div>

      {materials.length > 0 ? (
        <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {materials.map((m, i) => (
            <div key={m.url + i} className="flex items-center gap-3 px-5 py-4 text-[14px]">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-4.5 w-4.5 text-blue-700" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="truncate font-semibold text-ze-primary hover:underline">
                  {m.name}
                </a>
                <div className="mt-0.5 truncate text-[13px] text-ze-muted">
                  <Link href={`/teacher/lessons/${m.lessonId}`} className="hover:underline">
                    {m.lessonTitle}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
          <FolderOpen className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
          <div className="text-[14.5px] font-semibold text-ze-ink">Материалов пока нет</div>
          <div className="text-[13px] text-ze-muted">Загрузите их при создании урока.</div>
        </div>
      )}
    </div>
  );
}
