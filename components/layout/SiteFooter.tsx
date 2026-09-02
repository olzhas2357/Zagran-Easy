import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { NAV_ITEMS } from "@/lib/navigation";
import { waUrl } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="border-t border-ze-footer-border bg-ze-footer-bg pb-7 text-ze-ink sm:pb-10 dark:border-white/10 dark:bg-[#0B132B] dark:text-white">
      <div className="h-[3px] w-full bg-gradient-to-r from-ze-primary via-ze-footer-accent to-ze-primary" />
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-10 sm:pt-16">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-[1.4fr_1fr_1.2fr_1fr] sm:gap-10">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/logo-icon.png" alt={SITE.name} width={669} height={477} className="h-9 w-auto" />
              <span className="text-[16px] font-bold">{SITE.name}</span>
            </div>
            <p className="mt-3.5 max-w-[280px] text-[13.5px] leading-relaxed text-ze-muted dark:text-white/60">
              Агентство международных услуг. Обучение, туры, работа, визы и недвижимость за рубежом.
            </p>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-500 dark:text-white/40">Услуги</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              {NAV_ITEMS.filter((item) => item.href !== "/" && item.href !== "/about" && item.href !== "/faq").map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[14px] text-ze-ink/80 hover:text-ze-primary dark:text-white/70 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-500 dark:text-white/40">Контакты</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              <div className="text-[17px] font-bold text-ze-ink dark:text-white">{SITE.phone}</div>
              <div className="text-[14px] leading-relaxed text-ze-muted dark:text-white/60">{SITE.address}</div>
              <div className="text-[14px] text-ze-muted dark:text-white/60">Пн–Сб, 10:00–19:00</div>
              <a
                href={`mailto:${SITE.email}`}
                className="text-[14px] text-ze-muted hover:text-ze-primary dark:text-white/60 dark:hover:text-white"
              >
                {SITE.email}
              </a>
            </div>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-500 dark:text-white/40">Написать нам</div>
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
                className="flex items-center justify-center gap-2 rounded-xl border border-ze-footer-border bg-white px-4 py-3 text-[14.5px] font-semibold text-ze-ink hover:border-ze-primary hover:text-ze-primary dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/30"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ze-footer-border pt-5 text-[12.5px] text-ze-muted dark:border-white/10 dark:text-white/40">
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
