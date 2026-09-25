import { MessageCircle } from "lucide-react";
import { requireParent } from "@/lib/parent-data";
import { ParentEmptyState, ParentPage } from "@/components/parent/ParentPage";

export default async function ParentsMessagesPage() { await requireParent(); return <ParentPage title="Сообщения" description="Общайтесь с менеджером и получайте важные уведомления по обучению."><ParentEmptyState icon={MessageCircle} title="Сообщений пока нет" text="Новые сообщения от команды ZagranEasy появятся в этом разделе." /></ParentPage>; }