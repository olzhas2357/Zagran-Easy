import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/account-data";

export default async function StudentSchedulePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  // Студент не выбирает расписание и не записывается самостоятельно.
  // Администратор закрепляет его за преподавателем, а назначенные учителем
  // занятия отображаются в едином разделе «Мои уроки».
  redirect("/account/lessons");
}
