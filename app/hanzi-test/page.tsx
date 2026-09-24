import type { Metadata } from "next";
import { HanziLab } from "@/components/hanzi/HanziLab";

export const metadata: Metadata = {
  title: "Лаборатория иероглифов — ZagranEasy",
  robots: { index: false, follow: false },
};

export default function HanziTestPage() {
  return <HanziLab />;
}
