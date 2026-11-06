import { StaffScheduleBackend } from "@/components/staff/StaffScheduleBackend";
import { getSchedule } from "@/lib/schedule-data";

export default async function TeacherSchedulePage() {
  const schedule = await getSchedule();
  if (schedule.error) return <div role="alert" className="m-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{schedule.error}</div>;

  return <StaffScheduleBackend profile={{ role: "teacher" }} slots={schedule.slots} />;
}
