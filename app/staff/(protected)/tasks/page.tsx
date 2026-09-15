import { ManagerTasksBoard } from "@/components/staff/ManagerTasksBoard";
import { getClients, getCurrentProfile, getManagerTasks, getStaffProfiles } from "@/lib/staff-data";

export default async function StaffTasksPage() {
  const [tasks, managers, clients, profile] = await Promise.all([getManagerTasks(), getStaffProfiles(), getClients(), getCurrentProfile()]);
  if (!profile) return null;
  return <div className="p-5 sm:p-9"><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Задачи</h1><p className="mt-2 text-[14px] text-ze-muted">Контакты, дедлайны и следующие действия по клиентам.</p><ManagerTasksBoard tasks={tasks} managers={managers.length ? managers : [profile]} clients={clients} currentProfile={profile} /></div>;
}
