import { KnowledgeBase } from "@/components/staff/KnowledgeBase";
import { getCurrentProfile, getKnowledgeArticles } from "@/lib/staff-data";

export default async function StaffKnowledgePage() {
  const [articles, profile] = await Promise.all([getKnowledgeArticles(), getCurrentProfile()]);
  if (!profile) return null;
  return <div className="p-5 sm:p-9"><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">База знаний</h1><p className="mt-2 text-[14px] text-ze-muted">Проверенные материалы для менеджеров и будущих AI-инструментов. Черновики не считаются подтверждённым источником.</p><KnowledgeBase articles={articles} profile={profile} /></div>;
}
