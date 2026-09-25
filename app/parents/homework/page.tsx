import { ClipboardList } from "lucide-react";
import { requireParent } from "@/lib/parent-data";
import { ParentEmptyState, ParentPage } from "@/components/parent/ParentPage";

export default async function ParentsHomeworkPage() { await requireParent(); return <ParentPage title="Домашние задания" description="Контролируйте задания, сроки и результаты обучения."><ParentEmptyState icon={ClipboardList} title="Заданий пока нет" text="После подключения ребёнка здесь появятся задания и комментарии преподавателя." /></ParentPage>; }