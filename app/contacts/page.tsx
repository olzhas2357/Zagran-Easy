import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FadeIn } from "@/components/ui/FadeIn";
import { SITE } from "@/lib/constants";
import { PAGE_META } from "@/lib/navigation";
import { waUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: PAGE_META["/contacts"].title,
  description: PAGE_META["/contacts"].description,
};

const address = `${SITE.address}, Алматы, Казахстан`;
const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export default function ContactsPage() {
  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      <section className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-10 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-ze-primary">
            <MapPin className="h-3.5 w-3.5" />
            Мы в Алматы
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Контакты и адрес офиса
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ze-muted sm:text-lg">
            Будем рады встретиться лично. Позвоните или напишите заранее — поможем
            сориентироваться и подготовим консультацию.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.25fr_0.75fr]">
        <FadeIn>
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
            <iframe
              title="Офис ZagranEasy на Google Maps"
              src={mapUrl}
              className="h-[360px] w-full rounded-[22px] sm:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="flex h-full flex-col gap-3">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <MapPin className="h-4 w-4 text-ze-primary" />
                Наш адрес
              </div>
              <p className="mt-3 text-lg font-bold leading-relaxed text-slate-900">
                {SITE.address}
              </p>
              <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-900">Как найти офис</p>
                <p className="mt-1">
                  ЖК Тенгиз Тауерс, блок C, 3-й этаж, офис 148.
                </p>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ze-primary px-4 py-3.5 text-sm font-bold text-white transition hover:bg-ze-primary-dark"
              >
                Построить маршрут в Google Maps
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={SITE.twoGisUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Открыть карточку в 2ГИС
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Phone className="h-4 w-4 text-ze-primary" />
                  Телефон
                </span>
                <span className="mt-2 block text-lg font-bold text-slate-900">
                  {SITE.phone}
                </span>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Mail className="h-4 w-4 text-ze-primary" />
                  Электронная почта
                </span>
                <span className="mt-2 block break-all text-base font-bold text-slate-900">
                  {SITE.email}
                </span>
              </a>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              <Clock3 className="h-5 w-5 shrink-0 text-ze-primary" />
              Понедельник–воскресенье, 10:00–19:00
            </div>

            <a
              href={waUrl("Здравствуйте! Хочу записаться на консультацию в офис.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#1EAF55]"
            >
              <MessageCircle className="h-4 w-4" />
              Написать в WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </FadeIn>
      </section>

      <SiteFooter />
    </div>
  );
}
