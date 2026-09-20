import { StaffScheduleBackend } from "@/components/staff/StaffScheduleBackend";
import { getSchedule, getScheduleResources } from "@/lib/schedule-data";
import { getCurrentProfile } from "@/lib/staff-data";

export default async function StaffSchedulePage() {
  const [profile, slots, resources] = await Promise.all([getCurrentProfile(), getSchedule(), getScheduleResources()]);
  if (!profile) return null;
  return <StaffScheduleBackend profile={profile} slots={slots} resources={resources} />;
}
