import Link from "next/link";
import { SITE } from "@/lib/constants";
import { NAV_ITEMS } from "@/lib/navigation";
import { waUrl } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="bg-ze-navy px-4 pb-7 pt-14 text-white sm:px-10 sm:pb-10 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-[1.4fr_1fr_1.2fr_1fr] sm:gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-ze-primary text-[13px] font-extrabold">
                ZE
              </span>
              <span className="text-[16px] font-bold">{SITE.name}</span>
            </div>
            <p className="mt-3.5 max-w-[280px] text-[13.5px] leading-relaxed text-white/55">
              Агентство международных услуг. Обучение, туры, работа, визы и недвижимость за рубежом.
            </p>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-white/40">Услуги</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              {NAV_ITEMS.filter((item) => item.href !== "/" && item.href !== "/about" && item.href !== "/faq").map(
                (item) => (
                  <Link key={item.href} href={item.href} className="text-[14px] text-white/80 hover:text-white">
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-white/40">Контакты</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              <div className="text-[17px] font-bold">{SITE.phone}</div>
              <div className="text-[14px] leading-relaxed text-white/70">{SITE.address}</div>
              <div className="text-[14px] text-white/70">Пн–Сб, 10:00–19:00</div>
              <a href={`mailto:${SITE.email}`} className="text-[14px] text-white/70 hover:text-white">
                {SITE.email}
              </a>
            </div>
          </div>

          <div>
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-white/40">Написать нам</div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              <a
                href={waUrl("Здравствуйте! Есть вопрос.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-ze-whatsapp px-4 py-3 text-[14.5px] font-bold text-ze-navy hover:bg-ze-whatsapp-dark"
              >
                WhatsApp
              </a>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/8 px-4 py-3 text-[14.5px] font-semibold text-white hover:bg-white/16"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[12.5px] text-white/40">
          <div>© 2026 {SITE.name}.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Публичный договор
            </a>
            <a href="#" className="hover:text-white">
              Политика данных
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
