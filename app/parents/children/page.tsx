import { Baby } from "lucide-react";
import { getParentChildren } from "@/lib/parent-data";
import { ParentEmptyState, ParentPage } from "@/components/parent/ParentPage";

export default async function ParentsChildrenPage() {
  const result = await getParentChildren();
  return <ParentPage title="Мои дети" description="Профили детей и их учебные данные.">
    {result.error ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Не удалось загрузить детей: {result.error}</p> : result.data?.length ?
      <div className="grid gap-4 sm:grid-cols-2">{result.data.map((child) => <article key={child.id} className="rounded-2xl border border-ze-border bg-white p-5">
        <h2 className="text-lg font-bold">{child.profiles?.full_name || "Студент"}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="text-ze-muted">Экзамен</dt><dd>{child.current_exam?.toUpperCase() || "Не указан"}</dd></div>
          <div><dt className="text-ze-muted">Текущий уровень / цель</dt><dd>{child.current_level || "—"} / {child.target_level || "—"}</dd></div>
          <div><dt className="text-ze-muted">Опыт</dt><dd>{child.xp ?? 0} XP</dd></div>
        </dl>
      </article>)}</div> : <ParentEmptyState icon={Baby} title="Пока нет подключённых профилей" text="Обратитесь к менеджеру ZagranEasy, чтобы связать профиль ребёнка с вашим кабинетом." />}
  </ParentPage>;
}
