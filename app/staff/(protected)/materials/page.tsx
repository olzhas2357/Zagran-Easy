import { StaffResources } from "@/components/staff/StaffResources";
import { getCurrentProfile, getKnowledgeArticles, getStaffResources } from "@/lib/staff-data";

export default async function StaffMaterialsPage() {
  const [resources, articles, profile] = await Promise.all([
    getStaffResources(),
    getKnowledgeArticles(),
    getCurrentProfile(),
  ]);
  if (!profile) return null;
  return <div className="mx-auto max-w-[1440px] p-5 sm:p-9">
    <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Материалы компании</h1>
    <p className="mt-2 max-w-3xl text-[14px] leading-6 text-ze-muted">Презентации, документы, ссылки и шаблоны для консультаций. Менеджерам доступны только проверенные и опубликованные материалы.</p>
    <StaffResources resources={resources} articles={articles} profile={profile} />
  </div>;
}
