import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Poppins } from "next/font/google";
import Script from "next/script";
import { SiteFooter, SiteHeader } from "~/components/site";
import { THEME_INIT_SCRIPT } from "~/components/ThemeToggle";
import "./globals.css";

// Türkçe harfler (ş, ğ, ı, İ) için "latin-ext" alt kümesi gerekir
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], display: "swap" });
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin", "latin-ext"], weight: ["700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Batman Petrolspor", template: "%s · Batman Petrolspor" },
  description: "Batman Petrolspor resmi sitesi: maçlar, puan durumu, kadro, haberler ve taraftar uygulaması.",
  icons: { icon: "/club/crest.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121317" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: açılış betiği `data-theme` özniteliğini sayfa çizilmeden önce yazar
    <html lang="tr" className={`${poppins.variable} ${barlow.variable} antialiased`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        {/* Saklı tema seçimi sayfa etkileşime girmeden önce uygulanır (açık temada koyu zemin parlaması olmaz) */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-mono-solid focus:px-4 focus:py-2 focus:text-mono-onSolid">
          İçeriğe geç
        </a>
        <SiteHeader />
        <main id="icerik" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
