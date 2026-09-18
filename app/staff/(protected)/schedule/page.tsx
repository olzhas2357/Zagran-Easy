import { StaffScheduleBackend } from "@/components/staff/StaffScheduleBackend";
import { getSchedule } from "@/lib/schedule-data";
import { getCurrentProfile } from "@/lib/staff-data";

export default async function StaffSchedulePage() {
  const [profile, slots] = await Promise.all([getCurrentProfile(), getSchedule()]);
  if (!profile) return null;
  return <StaffScheduleBackend profile={profile} slots={slots} />;
}
