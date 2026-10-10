import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Video, ClipboardList, ChevronRight, MessageCircle, UserRound, Search } from "lucide-react";
import { getCurrentUser, getMyApplication } from "@/lib/account-data";
import { fetchAllUniversities } from "@/lib/data";
import { getMyLessonsSplit, getMyAssignments, getMyGamification, getMyGoal, getMyTeacherProfile } from "@/lib/student-data";
import { GoalCard } from "@/components/account/GoalCard";
import { XpProgressCard } from "@/components/account/XpProgressCard";
import { waUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Кабинет студента — ZagranEasy" };

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const application = await getMyApplication(user.id);
  const universities = application ? await fetchAllUniversities() : [];
  const university = application?.universityId ? universities.find((u) => u.id === application.universityId) || null : null;

  const { upcoming: upcomingLessons, past: pastLessons } = await getMyLessonsSplit();
  const nextLesson = upcomingLessons[0] ?? null;
  const assignments = await getMyAssignments();
  const pendingHomeworkCount = assignments.filter((a) => a.status !== "completed").length;
  const completedLessonsCount = pastLessons.length;
  const goal = await getMyGoal();
  const teacher = await getMyTeacherProfile();
  const gamification = await getMyGamification();

  const ASSIGNMENT_ACTIVITY_LABEL: Record<string, string> = {
    completed: "Задание проверено",
    submitted: "Задание отправлено на проверку",
    pending: "Новое домашнее задание",
  };
  const recentActivity = [
    ...pastLessons.slice(0, 4).map((l) => ({
      key: `lesson-${l.id}`,
      icon: Video as typeof Video,
      label: `Урок пройден: ${l.title}`,
      at: l.scheduledAt,
      href: `/account/lessons/${l.id}`,
    })),
    ...assignments.slice(0, 4).map((a) => ({
      key: `hw-${a.id}`,
      icon: ClipboardList as typeof ClipboardList,
      label: `${ASSIGNMENT_ACTIVITY_LABEL[a.status] || "Домашнее задание"}: ${a.taskTitle}`,
      at: a.createdAt,
      href: `/account/homework/${a.id}`,
    })),
  ]
    .filter((item) => item.at)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-11">
        <div>
          <h1 className="text-[23px] font-extrabold tracking-tight sm:text-[34px]">
            {application ? "Ваша заявка в работе" : "Кабинет студента"}
          </h1>
          <p className="mt-2 text-[14.5px] text-ze-muted">
            {application && university
              ? `${university.name} · ${application.programName || "программа уточняется"}`
              : user.email}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
        

          <div className="flex flex-col gap-6">
            {gamification && <XpProgressCard progress={gamification} />}
            <div className="rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
              <div className="text-[15px] font-bold">Недавняя активность</div>
              {recentActivity.length > 0 ? (
                <div className="mt-3 flex flex-col">
                  {recentActivity.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="flex items-center gap-3 border-b border-[#F1F4F9] py-3 last:border-0 hover:opacity-80"
                    >
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] bg-ze-surface">
                        <item.icon className="h-4 w-4 text-ze-muted" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-medium text-ze-ink">{item.label}</div>
                        <div className="mt-0.5 text-[12px] text-slate-400">{formatDateTime(item.at)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[13.5px] text-ze-muted">Здесь появится история уроков и заданий.</p>
              )}
            </div>
          </div>
        </div>

        <GoalCard goal={goal} />

        {teacher && (
          <div className="mt-6 rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
            <div className="text-[15px] font-bold">Ваш преподаватель</div>
            <div className="mt-4 flex items-start gap-3.5">
              <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-[#EBF1FE] text-[16px] font-bold text-ze-primary">
                {teacher.imageUrl ? (
                  <img src={teacher.imageUrl} alt={teacher.fullName} className="h-full w-full object-cover" />
                ) : (
                  teacher.fullName.slice(0, 1).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-ze-ink">{teacher.fullName}</div>
                {teacher.specializations.length > 0 && (
                  <div className="mt-1 text-[13px] text-ze-muted">{teacher.specializations.join(" · ")}</div>
                )}
                {teacher.bio && <p className="mt-2 text-[13.5px] leading-relaxed text-ze-ink">{teacher.bio}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
