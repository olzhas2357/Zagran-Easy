const ROLE_STYLES: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  teacher: "bg-purple-100 text-purple-700",
  parent: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
  manager: "bg-red-100 text-red-700",
};

const ROLE_LABELS: Record<string, string> = {
  student: "Студент",
  teacher: "Учитель",
  parent: "Родитель",
  admin: "Админ",
  manager: "Менеджер",
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${ROLE_STYLES[role] || "bg-slate-100 text-slate-600"}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}
