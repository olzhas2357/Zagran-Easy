import { UserRound } from "lucide-react";
import { requireParent } from "@/lib/parent-data";
import { ParentPage } from "@/components/parent/ParentPage";

export default async function ParentsProfilePage() {
  const parent = await requireParent();
  return <ParentPage title="Профиль" description="Контактные данные для связи с командой ZagranEasy."><div className="max-w-2xl rounded-[22px] border border-ze-border bg-white p-5 sm:p-7"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800"><UserRound className="h-6 w-6" /></span><div><div className="text-lg font-extrabold">{parent.fullName}</div><div className="mt-1 text-sm text-ze-muted">{parent.email || "Электронная почта не указана"}</div></div></div><div className="mt-6 border-t border-ze-border pt-5 text-sm text-ze-muted">Редактирование данных будет доступно после подключения профиля.</div></div></ParentPage>;
}