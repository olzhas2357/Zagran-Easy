import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMockTest } from "@/lib/mock-test-data";
import { PublicMockTest } from "@/components/account/PublicMockTest";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const test = await getMockTest((await params).id);
  return { title: test ? `${test.title} — ZagranEasy` : "Mock test — ZagranEasy" };
}

export default async function PublicMockTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = await getMockTest(id);
  if (!test) notFound();

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-3xl px-4 py-9 sm:px-10 sm:py-14">
        <Link href="/mock-test" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-ze-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Все тесты
        </Link>
        <h1 className="mb-5 mt-4 text-[22px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">{test.title}</h1>
        <PublicMockTest test={test} />
      </div>
    </div>
  );
}
