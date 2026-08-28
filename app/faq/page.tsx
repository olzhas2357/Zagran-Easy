import type { Metadata } from "next";
import { getFaqItems } from "@/lib/data";
import { waUrl } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { PAGE_META } from "@/lib/navigation";

export const metadata: Metadata = {
  title: PAGE_META["/faq"].title,
  description: PAGE_META["/faq"].description,
  openGraph: {
    title: PAGE_META["/faq"].title,
    description: PAGE_META["/faq"].description,
    url: "https://zagraneasy.kz/faq",
  },
};

export default function FaqPage() {
  const items = getFaqItems();

  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      <div className="border-b border-ze-border">
        <div className="mx-auto max-w-[800px] px-4 py-9 text-center sm:px-10 sm:py-14">
          <h1 className="text-[28px] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-[44px]">
            Частые вопросы
          </h1>
          <p className="mt-3.5 text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
            Ответы на популярные вопросы об обучении, визах, турах, работе и недвижимости за рубежом.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[800px] px-4 py-12 sm:px-10 sm:py-16">
        <FadeIn>
          <FaqAccordion items={items} />
        </FadeIn>
      </div>

      <div className="px-4 sm:px-10">
        <div className="mx-auto max-w-[800px] pb-16">
          <div className="rounded-[20px] border border-ze-border bg-white p-7 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-9">
            <div className="text-[19px] font-bold">Не нашли ответ на свой вопрос?</div>
            <div className="mt-2 text-[14px] text-ze-muted">Напишите нам — ответим в течение 15 минут.</div>
            <a
              href={waUrl("Здравствуйте! У меня есть вопрос.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-ze-whatsapp px-6 py-3.5 text-[14.5px] font-bold text-white hover:bg-ze-whatsapp-dark"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
