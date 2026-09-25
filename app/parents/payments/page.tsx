import { CreditCard } from "lucide-react";
import { requireParent } from "@/lib/parent-data";
import { ParentEmptyState, ParentPage } from "@/components/parent/ParentPage";

export default async function ParentsPaymentsPage() { await requireParent(); return <ParentPage title="Оплата" description="Счета, история платежей и документы по обучению."><ParentEmptyState icon={CreditCard} title="Счетов пока нет" text="Здесь будет отображаться информация об оплате после оформления программы." /></ParentPage>; }