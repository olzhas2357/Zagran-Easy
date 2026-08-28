import Link from "next/link";
import { getCurrentTeacher, getAssignments } from "@/lib/teacher-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

const STATUS_LABEL: Record<string, string> = {
  pending: "На проверке",
  completed: "Проверено",
};

export default async function TeacherAssignmentsPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  const assignments = await getAssignments(teacher.id);
  const pending = assignments.filter((a) => a.status !== "completed");
  const reviewed = assignments.filter((a) => a.status === "completed");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-ze-ink">Задания на проверку</h1>
        <p className="mt-1 text-[14px] text-ze-muted">{pending.length} ожидают проверки.</p>
      </div>

      <div>
        <h2 className="mb-2 text-[15px] font-bold text-ze-ink">На проверке</h2>
        {pending.length > 0 ? (
          <div className="divide-y divide-ze-border rounded-xl border border-ze-border bg-white">
            {pending.map((a) => (
              <Link
                key={a.id}
                href={`/teacher/assignments/${a.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-[13.5px] hover:bg-ze-surface"
              >
                <span className="text-ze-ink">
                  <span className="font-semibold">{a.studentName}</span> · {a.taskTitle}
                </span>
                <span className="text-ze-muted">{formatDate(a.createdAt)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ze-border bg-white p-5 text-[13.5px] text-ze-muted">
            Нет заданий на проверку.
          </div>
        )}
      </div>

      {reviewed.length > 0 && (
        <div>
          <h2 className="mb-2 text-[15px] font-bold text-ze-ink">Проверенные</h2>
          <div className="divide-y divide-ze-border rounded-xl border border-ze-border bg-white">
            {reviewed.map((a) => (
              <Link
                key={a.id}
                href={`/teacher/assignments/${a.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-[13.5px] hover:bg-ze-surface"
              >
                <span className="text-ze-ink">
                  <span className="font-semibold">{a.studentName}</span> · {a.taskTitle}
                </span>
                <span className="text-ze-muted">{a.reviewScore !== null ? `${a.reviewScore}` : STATUS_LABEL[a.status]}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
