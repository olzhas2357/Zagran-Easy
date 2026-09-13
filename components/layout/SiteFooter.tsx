import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { NAV_ITEMS } from "@/lib/navigation";
import { waUrl } from "@/lib/utils";

export function SiteFooter() {
  const services = NAV_ITEMS.filter(
    ({ href }) => !["/", "/about", "/faq"].includes(href),
  );

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-10">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* Компания */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo-icon.png"
                alt={SITE.name}
                width={669}
                height={477}
                className="h-9 w-auto object-contain"
              />
              <span className="text-lg font-bold">{SITE.name}</span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              Обучение и поступление за рубеж с полным сопровождением.
            </p>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-sm font-bold">Услуги</h3>

            <nav className="mt-3 flex flex-col gap-2">
              {services.slice(0, 5).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-slate-500 transition hover:text-blue-600"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-bold">Контакты</h3>

            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="block font-semibold text-slate-900 hover:text-blue-600"
              >
                {SITE.phone}
              </a>

              <p>{SITE.address}</p>
              <p>Пн–Сб, 10:00–19:00</p>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={waUrl("Здравствуйте! Хочу получить консультацию.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1EAF55]"
              >
                WhatsApp
              </a>

              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-blue-500 hover:text-blue-600"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {SITE.name}. Все права защищены.</span>

          <div className="flex gap-4">
            <Link href="/public-offer" className="hover:text-blue-600">
              Публичная оферта
            </Link>

            <Link href="/privacy" className="hover:text-blue-600">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}