import { redirect } from "next/navigation";
import { apiGet } from "./api";
import { getToken } from "./session-data";
import { getSessionUser } from "./session-data";

export interface ParentProfile {
  id: string;
  email?: string;
  fullName: string;
}

export async function getCurrentParent(): Promise<ParentProfile | null> {
  const user = await getSessionUser();
  if (!user || user.profile.role !== "parent") return null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.profile.full_name || "Родитель",
  };
}

export async function requireParent(): Promise<ParentProfile> {
  const parent = await getCurrentParent();
  if (!parent) redirect("/parents/login");
  return parent;
}

export interface ParentChild {
  id: string;
  current_exam: string | null;
  current_level: string | null;
  target_level: string | null;
  xp: number;
  profiles: { full_name: string | null } | null;
}

export async function getParentChildren() {
  await requireParent();
  return apiGet<ParentChild[]>("/parents/me/children", await getToken());
}

export interface ParentSchedule {
  student_id: string;
  student_name: string;
  lessons: {
    id: string;
    starts_at: string;
    ends_at: string;
    status: string;
  }[];
}

export async function getParentSchedule() {
  await requireParent();
  return apiGet<ParentSchedule[]>("/parents/me/schedule", await getToken());
}
