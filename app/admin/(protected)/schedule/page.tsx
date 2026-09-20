"use client";

import { useEffect, useState } from "react";
import { StaffScheduleBackend } from "@/components/staff/StaffScheduleBackend";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { ScheduleResources, ScheduleSlot } from "@/lib/schedule-data";

export default function AdminSchedulePage() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [resources, setResources] = useState<ScheduleResources>({ teachers: [], courses: [], classrooms: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    Promise.all([
      apiGet<ScheduleSlot[]>("/schedule", token),
      apiGet<Record<string, unknown>[]>("/teachers?limit=100", token),
      apiGet<Record<string, unknown>[]>("/courses?limit=100", token),
      apiGet<Record<string, unknown>[]>("/schedule/classrooms", token),
    ]).then(([response, teachers, courses, classrooms]) => {
      if (cancelled) return;
      setSlots(response.data || []);
      setResources({
        teachers: (teachers.data || []).map((row) => ({ id: row.id as string, name: ((row.profiles as Record<string, unknown> | undefined)?.full_name as string) || (row.full_name as string) || "Без имени" })),
        courses: (courses.data || []).map((row) => ({ id: row.id as string, name: (row.title as string) || (row.name as string) || "Курс" })),
        classrooms: (classrooms.data || []).map((row) => ({ id: row.id as string, name: (row.name as string) || "Кабинет" })),
      });
      setError(response.error || "");
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [token]);

  if (loading) return <div className="p-8 text-sm text-slate-400">Загрузка расписания…</div>;
  if (error) return <div className="m-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>;

  return <StaffScheduleBackend profile={{ role: "admin" }} slots={slots} resources={resources} />;
}
