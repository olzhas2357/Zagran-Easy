import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StudentScheduleBooking } from "@/components/account/StudentScheduleBooking";
import { getCurrentUser } from "@/lib/account-data";
import { getSchedule } from "@/lib/schedule-data";

export const metadata: Metadata = { title: "Запись на занятия — ZagranEasy" };

export default async function StudentSchedulePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");
  const slots = await getSchedule();
  return <StudentScheduleBooking slots={slots} />;
}
