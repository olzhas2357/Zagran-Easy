import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export default function EducationLayout({ children }: LayoutProps<"/education">) {
  return <div className={`${inter.variable} bg-white font-[family-name:var(--font-inter)]`}>{children}</div>;
}
