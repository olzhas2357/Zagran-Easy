import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Video, ClipboardList, ChevronRight, MessageCircle, UserRound, Search } from "lucide-react";
import { getCurrentUser, getMyApplication } from "@/lib/account-data";
import { fetchAllUniversities } from "@/lib/data";
import { getMyLessonsSplit, getMyAssignments, getMyGoal } from "@/lib/student-data";
import { GoalCard } from "@/components/account/GoalCard";
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href={nextLesson ? `/account/lessons/${nextLesson.id}` : "/account/lessons"}
                className="flex items-center justify-between gap-3 rounded-[18px] border border-ze-border bg-white p-4.5 transition-colors hover:border-slate-300 sm:p-5.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#EBF1FE]">
                    <Video className="h-5 w-5 text-ze-primary" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold">Ближайший урок</div>
                    {nextLesson ? (
                      <div className="mt-0.5 flex items-center gap-1 truncate text-[13px] text-ze-muted">
                        <Clock className="h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
                        {formatDateTime(nextLesson.scheduledAt)}
                      </div>
                    ) : (
                      <div className="mt-0.5 text-[13px] text-ze-muted">Уроков пока не назначено</div>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4.5 w-4.5 flex-none text-ze-muted" strokeWidth={1.75} />
              </Link>

              <Link
                href="/account/homework"
                className="flex items-center justify-between gap-3 rounded-[18px] border border-ze-border bg-white p-4.5 transition-colors hover:border-slate-300 sm:p-5.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-amber-50">
                    <ClipboardList className="h-5 w-5 text-amber-700" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold">Домашние задания</div>
                    <div className="mt-0.5 text-[13px] text-ze-muted">
                      {pendingHomeworkCount > 0 ? `${pendingHomeworkCount} ожидают выполнения` : "Всё выполнено"}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4.5 w-4.5 flex-none text-ze-muted" strokeWidth={1.75} />
              </Link>
            </div>

            <div className="rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
              <div className="text-[15px] font-bold">Быстрые действия</div>
              <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { href: "/account/lessons", label: "Мои уроки", Icon: Video },
                  { href: "/account/homework", label: "Домашние задания", Icon: ClipboardList },
                  { href: "/education/quiz", label: "Подбор вуза", Icon: Search },
                  { href: waUrl("Здравствуйте! Пишу из личного кабинета."), label: "Менеджер", Icon: MessageCircle, external: true },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    className="flex flex-col items-center gap-2 rounded-[14px] border border-ze-border px-2 py-3.5 text-center transition-colors hover:border-slate-300 hover:bg-ze-surface"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBF1FE]">
                      <action.Icon className="h-4.5 w-4.5 text-ze-primary" strokeWidth={1.75} />
                    </span>
                    <span className="text-[12.5px] font-semibold leading-tight text-ze-ink">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-emerald-50">
                  <UserRound className="h-5 w-5 text-emerald-700" strokeWidth={1.75} />
                </span>
                <div>
                  <div className="text-[22px] font-extrabold leading-none tracking-tight">{completedLessonsCount}</div>
                  <div className="mt-1 text-[12.5px] text-ze-muted">пройденных уроков</div>
                </div>
              </div>
            </div>

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

        {!application && (
          <div className="mt-8 rounded-2xl border border-dashed border-[#D6DEEA] bg-white px-6 py-14 text-center">
            <div className="text-[17px] font-bold">Заявок пока нет</div>
            <p className="mx-auto mt-2 max-w-[420px] text-[14px] text-ze-muted">
              Пройдите подбор университета или оставьте заявку — здесь появится статус, документы и дедлайны.
            </p>
            <Link href="/education/quiz" className="mt-5 inline-block rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white hover:bg-ze-primary-dark">
              Подобрать университет
            </Link>
          </div>
        )}

        {application && (
          <>
            <div className="mt-6 rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
              <div className="text-[15px] font-bold">Статус поступления</div>
              <div className="mt-4.5 flex flex-col gap-3.5 sm:flex-row sm:gap-2.5">
                {application.steps.map((s) => (
                  <div key={s.label} className="flex flex-1 items-center gap-2.5 sm:flex-col sm:items-start">
                    <span
                      className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full text-[14px] font-bold ${
                        s.state === "done" ? "bg-emerald-500 text-white" : s.state === "now" ? "bg-ze-primary text-white" : "bg-[#EEF1F6] text-slate-400"
                      }`}
                    >
                      {s.state === "done" ? "✓" : s.state === "now" ? "•" : ""}
                    </span>
                    <div>
                      <div className={`text-[14px] font-semibold ${s.state === "wait" ? "text-slate-400" : "text-ze-ink"}`}>{s.label}</div>
                      <div className="mt-0.5 text-[12px] text-slate-400">{s.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
              <div className="rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="text-[15px] font-bold">Документы</div>
                  <div className="text-[13px] font-semibold text-emerald-600">
                    {application.documents.filter((d) => d.ok).length} из {application.documents.length} готовы
                  </div>
                </div>
                <div className="mt-2 flex flex-col">
                  {application.documents.map((d) => (
                    <div key={d.name} className="flex items-center gap-3 border-b border-[#F1F4F9] py-3.5 last:border-0">
                      <span
                        className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] text-[13px] font-bold ${
                          d.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {d.ok ? "✓" : "↑"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold">{d.name}</div>
                        <div className="mt-0.5 text-[12px] text-slate-400">{d.note}</div>
                      </div>
                      <button
                        className={`flex-none rounded-[9px] px-3.5 py-2 text-[12.5px] font-semibold ${
                          d.ok ? "border border-ze-border bg-[#F4F6FA] text-slate-700" : "bg-ze-primary text-white"
                        }`}
                      >
                        {d.ok ? "Открыть" : "Загрузить"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {application.deadlines.length > 0 && (
                  <div className="rounded-[18px] border border-ze-border bg-white p-4.5 sm:p-5.5">
                    <div className="text-[15px] font-bold">Ближайшие дедлайны</div>
                    <div className="mt-3.5 flex flex-col gap-3">
                      {application.deadlines.map((dl) => (
                        <div key={dl.title} className="flex items-center gap-3">
                          <span className={`flex h-[46px] w-[46px] flex-none items-center justify-center rounded-xl text-[13px] font-extrabold ${dl.urgent ? "bg-red-50 text-red-600" : "bg-[#EBF1FE] text-ze-primary"}`}>
                            {dl.date.split(" ")[0]}
                          </span>
                          <div className="min-w-0">
                            <div className="text-[14px] font-semibold">{dl.title}</div>
                            <div className="mt-0.5 text-[12px] text-slate-400">{dl.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {application.paymentTotal !== null && (
                  <div className="rounded-[18px] border border-[#DFE8FA] bg-[#F5F8FE] p-4.5 sm:p-5.5">
                    <div className="text-[15px] font-bold">Оплата и рассрочка</div>
                    <div className="mt-2 text-[26px] font-extrabold tracking-tight">
                      {application.paymentTotal.toLocaleString("ru-RU")} {application.paymentCurrency}
                    </div>
                    <div className="mt-1 text-[13px] text-ze-muted">
                      Оплачено {application.installmentsPaid} из {application.installmentsTotal} платежей
                      {application.nextPaymentDate && ` · след. ${new Date(application.nextPaymentDate).toLocaleDateString("ru-RU")}`}
                    </div>
                    <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-[#DCE6FA]">
                      <div
                        className="h-full rounded-full bg-ze-primary"
                        style={{ width: `${Math.round((application.installmentsPaid / application.installmentsTotal) * 100)}%` }}
                      />
                    </div>
                    <button className="mt-3.5 w-full rounded-xl bg-ze-primary py-3 text-[14.5px] font-semibold text-white hover:bg-ze-primary-dark">
                      Оплатить платёж
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
