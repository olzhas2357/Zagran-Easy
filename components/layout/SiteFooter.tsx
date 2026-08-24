import Link from "next/link";
import { SITE } from "@/lib/constants";
import { NAV_ITEMS } from "@/lib/navigation";
import { waUrl } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="border-t border-ze-footer-border bg-ze-footer-bg pb-7 text-ze-ink sm:pb-10">
      <div className="h-[3px] w-full bg-gradient-to-r from-ze-primary via-ze-footer-accent to-ze-primary" />
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-10 sm:pt-16">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-[1.4fr_1fr_1.2fr_1fr] sm:gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-ze-primary text-[14px] font-extrabold tracking-wide text-white">
                ZE
              </span>
              <span className="text-[16px] font-bold">{SITE.name}</span>
            </div>
            <p className="mt-3.5 max-w-[280px] text-[13.5px] leading-relaxed text-ze-muted">
              Агентство международных услуг. Обучение, туры, работа, визы и недвижимость за рубежом.
            </p>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-500">Услуги</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              {NAV_ITEMS.filter((item) => item.href !== "/" && item.href !== "/about" && item.href !== "/faq").map(
                (item) => (
                  <Link key={item.href} href={item.href} className="text-[14px] text-ze-ink/80 hover:text-ze-primary">
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-500">Контакты</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              <div className="text-[17px] font-bold text-ze-ink">{SITE.phone}</div>
              <div className="text-[14px] leading-relaxed text-ze-muted">{SITE.address}</div>
              <div className="text-[14px] text-ze-muted">Пн–Сб, 10:00–19:00</div>
              <a href={`mailto:${SITE.email}`} className="text-[14px] text-ze-muted hover:text-ze-primary">
                {SITE.email}
              </a>
            </div>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-500">Написать нам</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              <a
                href={waUrl("Здравствуйте! Есть вопрос.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-ze-whatsapp px-4 py-3 text-[14.5px] font-bold text-white hover:bg-ze-whatsapp-dark"
              >
                WhatsApp
              </a>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-ze-footer-border bg-white px-4 py-3 text-[14.5px] font-semibold text-ze-ink hover:border-ze-primary hover:text-ze-primary"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ze-footer-border pt-5 text-[12.5px] text-ze-muted">
          <div>© 2026 {SITE.name}.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-ze-primary">
              Публичный договор
            </a>
            <a href="#" className="hover:text-ze-primary">
              Политика данных
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
