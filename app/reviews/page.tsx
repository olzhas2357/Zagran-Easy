import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { PAGE_META } from "@/lib/navigation";
import { reviewExamples } from "@/data/content";

export const metadata: Metadata = {
  title: PAGE_META["/reviews"].title,
  description: PAGE_META["/reviews"].description,
};

export default async function ReviewsPage() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-[#F3F7FE] to-white">
      <section className="flex-1 border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-10 sm:py-16">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-ze-primary">
            Опыт клиентов ZagranEasy
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Отзывы клиентов
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ze-muted sm:text-lg">
            Здесь будет размещён опыт клиентов ZagranEasy — с их разрешения.
          </p>
          <div className="mt-10">
            <ReviewsCarousel reviews={reviewExamples} showRatingSummary={false} />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
