import { StaffScheduleBackend } from "@/components/staff/StaffScheduleBackend";
import { getSchedule } from "@/lib/schedule-data";

export default async function TeacherSchedulePage() {
  const slots = await getSchedule();

  return <StaffScheduleBackend profile={{ role: "teacher" }} slots={slots} />;
}
