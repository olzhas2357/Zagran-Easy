import Link from "next/link";
import { SITE } from "@/lib/constants";
import { waUrl } from "@/lib/utils";

const COLUMNS = [
  {
    title: "Обучение",
    links: [
      { label: "Курсы", href: "#courses" },
      { label: "Преподаватели", href: "#teachers" },
      { label: "IELTS", href: "#courses" },
      { label: "Speaking Club", href: "#courses" },
    ],
  },
  {
    title: "ZagranEasy",
    links: [
      { label: "О нас", href: "/about" },
      { label: "Контакты", href: "/about" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { label: "Поддержка", href: waUrl("Здравствуйте! Нужна помощь.") },
      { label: "Политика конфиденциальности", href: "/faq" },
      { label: "Условия использования", href: "/faq" },
    ],
  },
];

export function LanguageFooter() {
  return (
    <footer className="border-t border-[#E7ECF6] bg-[#0F1B3D] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-10 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-8">
          <div>
            <div className="text-[18px] font-extrabold tracking-tight">ZagranEasy</div>
            <p className="mt-2.5 max-w-[220px] text-[13.5px] leading-relaxed text-white/60">
              Образование без границ.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-white/70 hover:text-white"
              >
                Instagram
              </a>
              <a
                href={waUrl("Здравствуйте!")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-white/70 hover:text-white"
              >
                WhatsApp
              </a>
              <a
                href="https://t.me/zagraneasy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-white/70 hover:text-white"
              >
                Telegram
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[13px] font-semibold uppercase tracking-wide text-white/40">{col.title}</div>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className="text-[13.5px] text-white/70 hover:text-white">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[13.5px] text-white/70 hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-[12.5px] text-white/40 sm:mt-14">
          © {new Date().getFullYear()} ZagranEasy. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
