import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, CalendarDays, CheckCircle2, CircleAlert, ClipboardList, Clock3, FileCheck2, FolderOpen, GraduationCap, House, Languages, Landmark, ListTodo, Plane, Sparkles, UsersRound } from "lucide-react";
import { getCurrentProfile, getLeadsForAdmin } from "@/lib/staff-data";
import { fetchAllUniversities } from "@/lib/data";
import { isVerificationStale } from "@/lib/education-catalog";
import { AIChatCard } from "@/components/staff/AIChat";
import type { Lead } from "@/lib/types";
import { FullOurWork } from "@/components/home/FullOurWork";
import { StudentJourney } from "@/components/home/StudentJourney";

export default async function StaffDashboardPage() {
  const [profile, leads, universities] = await Promise.all([getCurrentProfile(), getLeadsForAdmin(), fetchAllUniversities()]);
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const inProgress = leads.filter((lead) => lead.status === "in_progress").length;
  const stale = universities.filter((university) => isVerificationStale(university.lastVerifiedAt)).length;
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()).slice(0, 5);

  return <div className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9">
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#3255AD] via-[#4775d1] to-[#8bb8f2] px-6 py-7 text-white shadow-[0_22px_55px_rgba(50,85,173,.2)] sm:px-9 sm:py-9">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-2xl" />
      <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-blue-100"><Sparkles className="h-4 w-4" /> Рабочее пространство менеджера</div><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Здравствуйте, {profile?.fullName?.split(" ")[0] || "коллега"}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Заявки, продукты ZagranEasy и база университетов — всё необходимое для консультации клиента.</p></div><div className="flex flex-wrap gap-2"><Link href="/staff/leads" className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-ze-primary">Открыть заявки</Link><Link href="/staff/clients/new" className="rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-bold text-white">Добавить клиента</Link></div></div>
    </section>

    <div className="mt-5"><AIChatCard /></div>

    <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat label="Новые заявки" value={newLeads} icon={ClipboardList} color="blue" href="/staff/leads" />
      <Stat label="В работе" value={inProgress} icon={Clock3} color="violet" href="/staff/leads" />
      <Stat label="Университетов" value={universities.length} icon={Landmark} color="emerald" href="/staff/directory" />
      <Stat label="Нужно проверить" value={stale} icon={CircleAlert} color="amber" href="/staff/universities" />
    </section>
    
    <section className="mt-9"><SectionHeading eyebrow="Продукты" title="Услуги ZagranEasy" description="Карточки-подсказки для консультации: что предлагаем клиенту и что входит в сопровождение." />
          
      <StudentJourney />

      <div className="grid gap-4 xl:grid-cols-2">
        <ServiceCard icon={GraduationCap} title="Поступление за рубеж" subtitle="Полное сопровождение студента от первой консультации до начала обучения" color="blue" href="/staff/directory" badge="Китай · Турция · Европа" features={["Анализ профиля и стратегии поступления", "Подбор университета и программы", "Проверка и подача документов", "Гранты, скидки и дедлайны", "Виза, общежитие и подготовка к переезду", "Поддержка после зачисления и адаптация"]} />
        <ServiceCard icon={Languages} title="Языковые курсы" subtitle="Подготовка к поступлению, международным экзаменам и уверенному общению" color="violet" href="/language" badge="Онлайн · Индивидуально · В группе" features={["General English для разных уровней", "Подготовка к IELTS и HSK", "English for University", "Разговорные клубы и практика", "Преподаватель и персональный план", "Контроль прогресса и домашние задания"]} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniService icon={FileCheck2} title="Виза в США" text="DS-160, документы, запись и подготовка к интервью" href="/visa-usa" color="blue" />
        <MiniService icon={Plane} title="Авторские туры" text="Перелёт, отель, трансфер, гид и страховка" href="/tours" color="sky" />
        <MiniService icon={BriefcaseBusiness} title="Работа за рубежом" text="Резюме, вакансии, контракт, виза и адаптация" href="/work" color="violet" />
        <MiniService icon={House} title="Недвижимость" text="Подбор объекта и юридическое сопровождение сделки" href="/realestate" color="amber" />
      </div>
    </section>

    <section className="mt-9 rounded-[24px] border border-ze-border bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)] sm:p-6"><div className="flex items-center justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">Продажи</div><h2 className="mt-1 text-xl font-extrabold">Последние заявки</h2></div><Link href="/staff/leads" className="flex items-center gap-1.5 text-sm font-bold text-ze-primary">Все заявки <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-5 grid gap-x-8 md:grid-cols-2">{recentLeads.length ? recentLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />) : <div className="py-10 text-center text-sm text-ze-muted">Новых заявок пока нет.</div>}</div></section>

    <section className="mt-9"><SectionHeading eyebrow="Инструменты" title="Быстрые действия" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><QuickLink href="/staff/tasks" icon={ListTodo} title="Задачи" text="Планы и следующие действия" /><QuickLink href="/staff/clients" icon={UsersRound} title="Клиенты" text="Карточки и история работы" /><QuickLink href="/staff/schedule" icon={CalendarDays} title="Расписание" text="Занятия и встречи" /><QuickLink href="/staff/knowledge" icon={BookOpen} title="База знаний" text="Инструкции менеджера" /><QuickLink href="/staff/materials" icon={FolderOpen} title="Материалы" text="Файлы, ссылки и презентации" /></div></section>
  </div>;
}

const colors = { blue: "bg-blue-50 text-blue-700", violet: "bg-violet-50 text-violet-700", emerald: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
function Stat({ label, value, icon: Icon, color, href }: { label: string; value: number; icon: typeof ClipboardList; color: keyof typeof colors; href: string }) { return <Link href={href} className="group rounded-[20px] border border-ze-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5"><div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}><Icon className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-ze-primary" /></div><div className="mt-4 text-2xl font-extrabold">{value}</div><div className="mt-0.5 text-xs text-ze-muted sm:text-sm">{label}</div></Link>; }
function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) { return <div className="mb-5"><div className="text-xs font-bold uppercase tracking-[.16em] text-ze-primary">{eyebrow}</div><h2 className="mt-1 text-2xl font-extrabold tracking-tight">{title}</h2>{description && <p className="mt-1.5 text-sm text-ze-muted">{description}</p>}</div>; }
function ServiceCard({ icon: Icon, title, subtitle, features, href, color, badge }: { icon: typeof Languages; title: string; subtitle: string; features: string[]; href: string; color: "blue" | "violet"; badge: string }) { const theme = color === "blue" ? "from-blue-50 border-blue-100 text-blue-700" : "from-violet-50 border-violet-100 text-violet-700"; return <Link href={href} className={`group overflow-hidden rounded-[24px] border bg-gradient-to-br ${theme} to-white p-6 transition hover:-translate-y-0.5 hover:shadow-xl sm:p-7`}><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm"><Icon className="h-6 w-6" /></span><ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></div><div className="mt-6 inline-flex rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm">{badge}</div><h3 className="mt-3 text-2xl font-extrabold text-ze-ink">{title}</h3><p className="mt-1.5 max-w-xl text-sm leading-5 text-ze-muted">{subtitle}</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{features.map((item) => <div key={item} className="flex items-start gap-2 text-sm font-medium text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />{item}</div>)}</div><div className="mt-6 flex items-center gap-2 text-sm font-bold">Открыть подробную информацию <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div></Link>; }
const miniColors = { blue: "bg-blue-50 text-blue-700", sky: "bg-sky-50 text-sky-700", violet: "bg-violet-50 text-violet-700", amber: "bg-amber-50 text-amber-700" };
function MiniService({ icon: Icon, title, text, href, color }: { icon: typeof Plane; title: string; text: string; href: string; color: keyof typeof miniColors }) { return <Link href={href} className="group rounded-[20px] border border-ze-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"><div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${miniColors[color]}`}><Icon className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-ze-primary" /></div><h3 className="mt-4 font-extrabold">{title}</h3><p className="mt-1.5 text-xs leading-5 text-ze-muted">{text}</p></Link>; }
function LeadRow({ lead }: { lead: Lead }) { const status = lead.status === "new" ? ["Новая", "bg-blue-50 text-blue-700"] : lead.status === "in_progress" ? ["В работе", "bg-amber-50 text-amber-700"] : ["Завершена", "bg-emerald-50 text-emerald-700"]; const service = /language|язык/i.test(lead.service) ? "Языковой курс" : /education|обуч|university/i.test(lead.service) ? "Поступление" : lead.service; return <Link href="/staff/leads" className="flex items-center gap-3 py-3.5 transition hover:bg-slate-50"><span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-100 text-sm font-extrabold text-slate-600">{(lead.name || "?")[0]?.toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{lead.name || "Без имени"}</span><span className="mt-0.5 block truncate text-xs text-ze-muted">{service || "Услуга не указана"} · {new Date(lead.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}</span></span><span className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-bold ${status[1]}`}>{status[0]}</span></Link>; }
function QuickLink({ href, icon: Icon, title, text }: { href: string; icon: typeof BookOpen; title: string; text: string }) { return <Link href={href} className="group flex items-center gap-3 rounded-2xl border border-ze-border bg-white p-4 transition hover:border-blue-200 hover:shadow-lg"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-ze-primary"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block font-bold">{title}</span><span className="block truncate text-xs text-ze-muted">{text}</span></span></Link>; }
