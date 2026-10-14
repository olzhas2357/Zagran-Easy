import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Eye, FileText, GraduationCap, Info, LockKeyhole } from "lucide-react";
import { getMyLearning, getMyTeacherProfile } from "@/lib/student-data";
import { SyllabusDocumentViewer } from "@/components/account/SyllabusDocumentViewer";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} КБ` : `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
}

export default async function StudentSyllabusPage() {
  const [teacher, learning] = await Promise.all([getMyTeacherProfile(), getMyLearning()]);
  const { course, syllabus } = learning;
  const viewerKind = syllabus?.mimeType === "application/pdf" || syllabus?.fileName.toLowerCase().endsWith(".pdf")
    ? "pdf"
    : syllabus?.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || syllabus?.fileName.toLowerCase().endsWith(".docx")
      ? "docx"
      : null;
  const canPreview = viewerKind !== null;

  return (
    <div className="min-h-full bg-ze-surface">
      <div className="mx-auto max-w-5xl px-4 py-7 sm:px-8 sm:py-8">
        <Link href="/account/course" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Мой курс
        </Link>

        <div className="mt-5 flex items-start gap-3">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 text-ze-primary"><FileText className="h-5.5 w-5.5" strokeWidth={1.8} /></span>
          <div>
            <div className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-ze-primary">Программа обучения</div>
            <h1 className="mt-1 text-[25px] font-extrabold tracking-tight text-ze-ink sm:text-[30px]">Syllabus курса</h1>
            <p className="mt-1.5 text-[13.5px] text-ze-muted">Темы, цели и правила вашего языкового курса.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <section className="rounded-[22px] border border-ze-border bg-white p-6 sm:p-8">
            {syllabus ? (
              <div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className="flex h-16 w-16 flex-none items-center justify-center rounded-[22px] bg-red-50 text-red-600"><FileText className="h-7 w-7" strokeWidth={1.6} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-emerald-700">Актуальная версия</span><span className="text-[11.5px] font-medium text-ze-muted">Версия {syllabus.version}</span></div>
                    <h2 className="mt-3 break-words text-[19px] font-extrabold text-ze-ink">{syllabus.fileName}</h2>
                    <p className="mt-1.5 text-[12.5px] text-ze-muted">{formatSize(syllabus.sizeBytes)} · обновлён {new Date(syllabus.updatedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p>
                    {syllabus.comment && <p className="mt-4 rounded-2xl bg-ze-surface px-4 py-3 text-[13px] leading-relaxed text-ze-ink">{syllabus.comment}</p>}
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-3 border-t border-ze-border pt-5">
                  {canPreview ? (
                    <a href="#syllabus-viewer" className="inline-flex items-center gap-2 rounded-xl bg-ze-primary px-5 py-3 text-[13.5px] font-semibold text-white hover:bg-ze-primary-dark"><Eye className="h-4 w-4" /> Читать на странице</a>
                  ) : (
                    <a href={syllabus.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-ze-primary px-5 py-3 text-[13.5px] font-semibold text-white hover:bg-ze-primary-dark"><Eye className="h-4 w-4" /> Открыть файл</a>
                  )}
                  <a href={syllabus.url} download={syllabus.fileName} className="inline-flex items-center gap-2 rounded-xl border border-ze-border bg-white px-5 py-3 text-[13.5px] font-semibold text-ze-ink hover:border-blue-200 hover:text-ze-primary"><Download className="h-4 w-4" /> Скачать отдельно</a>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11.5px] font-semibold text-ze-muted"><LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.9} /> Приватный документ вашего курса</div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center sm:py-12">
                <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F1F6FF] text-ze-primary"><BookOpen className="h-7 w-7" strokeWidth={1.6} /></span>
                <h2 className="mt-5 text-[18px] font-extrabold text-ze-ink">Syllabus скоро появится</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ze-muted">Преподаватель ещё не опубликовал программу курса. После загрузки документ автоматически появится на этой странице.</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11.5px] font-semibold text-ze-muted"><LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.9} /> Доступ только ученикам курса</div>
              </div>
            )}
          </section>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[20px] border border-ze-border bg-white p-5">
              <div className="flex items-center gap-2 text-[14px] font-bold text-ze-ink"><GraduationCap className="h-4.5 w-4.5 text-ze-primary" /> О документе</div>
              <dl className="mt-4 space-y-3 text-[12.5px]">
                <div className="flex items-center justify-between gap-3"><dt className="text-ze-muted">Курс</dt><dd className="max-w-[170px] truncate font-semibold text-ze-ink">{course?.title || "Языковой курс"}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-ze-muted">Преподаватель</dt><dd className="max-w-[150px] truncate font-semibold text-ze-ink">{teacher?.fullName || "Назначается"}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-ze-muted">Формат</dt><dd className="font-semibold text-ze-ink">{syllabus?.mimeType === "application/pdf" ? "PDF" : syllabus ? "DOCX" : "PDF / DOCX"}</dd></div>
              </dl>
            </div>

            <div className="rounded-[20px] border border-blue-100 bg-blue-50/70 p-5">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-blue-900"><Info className="h-4.5 w-4.5" strokeWidth={1.9} /> Здесь будет</div>
              <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-blue-900/70">
                <li>• план тем и модулей;</li>
                <li>• цели и результаты курса;</li>
                <li>• правила занятий и оценивания.</li>
              </ul>
            </div>
          </aside>
        </div>

        {syllabus && viewerKind && (
          <section id="syllabus-viewer" className="mt-5 scroll-mt-5 overflow-hidden rounded-[22px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-2 border-b border-ze-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-ze-ink">Просмотр syllabus</h2>
                <p className="mt-0.5 text-[12px] text-ze-muted">Документ открыт внутри кабинета — скачивать его не обязательно.</p>
              </div>
              <a href={syllabus.url} target="_blank" rel="noopener noreferrer" className="text-[12.5px] font-semibold text-ze-primary hover:underline">Развернуть на весь экран</a>
            </div>
            <SyllabusDocumentViewer url={syllabus.url} fileName={syllabus.fileName} kind={viewerKind} />
          </section>
        )}
      </div>
    </div>
  );
}
