import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getMyApplication } from "@/lib/account-data";
import { fetchAllUniversities } from "@/lib/data";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { waUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Кабинет студента — ZagranEasy" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const application = await getMyApplication(user.id);
  const universities = application ? await fetchAllUniversities() : [];
  const university = application?.universityId ? universities.find((u) => u.id === application.universityId) || null : null;

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-11">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          <div className="flex items-center gap-2.5">
            <a
              href={waUrl("Здравствуйте! Пишу из личного кабинета.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-ze-whatsapp px-[18px] py-3 text-[14.5px] font-bold text-white hover:bg-ze-whatsapp-dark"
            >
              Менеджер в WhatsApp
            </a>
            <SignOutButton redirectTo="/account/login" />
          </div>
        </div>

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
