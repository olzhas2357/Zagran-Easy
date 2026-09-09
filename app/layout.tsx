import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { SITE } from "@/lib/constants";

// Самостоятельно захостенный Inter (пакет @fontsource-variable/inter) —
// не зависит от сети/прокси в отличие от next/font/google.
const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-cyrillic-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
};

// Выставляет data-theme до гидрации — иначе на /language при сохранённой
// светлой теме страница на долю секунды мигнёт тёмной вёрсткой по умолчанию.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('ze-theme');if(!t){t=location.pathname.startsWith('/language')?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning className={inter.variable}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col font-sans text-ze-ink">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
