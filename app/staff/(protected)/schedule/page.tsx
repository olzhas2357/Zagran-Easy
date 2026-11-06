import { StaffScheduleBackend } from "@/components/staff/StaffScheduleBackend";
import { getSchedule, getScheduleResources } from "@/lib/schedule-data";
import { getCurrentProfile } from "@/lib/staff-data";

export default async function StaffSchedulePage() {
  const [profile, schedule, resources] = await Promise.all([getCurrentProfile(), getSchedule(), getScheduleResources()]);
  if (!profile) return null;
  if (schedule.error) return <div role="alert" className="m-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{schedule.error}</div>;
  return <StaffScheduleBackend profile={profile} slots={schedule.slots} resources={resources} />;
}
