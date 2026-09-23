import { WhatsAppFloat } from "@/components/contact/whatsapp-float";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { PageBackdrop } from "@/components/layout/page-backdrop";
import { Providers } from "@/components/layout/providers";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { consentBootstrapScript } from "@/lib/consent";
import { baseMetadata } from "@/lib/metadata";
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-WKH53MEDQ1";

/* O nó Organization saía daqui, sem @id e sem endereço, e agora sai de
   lib/schema.ts em TODA página que monta o grafo — com @id, contactPoint,
   sameAs e areaServed reais.
   Emitir os dois deixava duas Organizations sem @id em comum no mesmo HTML:
   para o Google e para um crawler de IA, isso é duas entidades diferentes
   disputando a mesma marca, não uma entidade descrita duas vezes. */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const gohan = localFont({
  src: "../public/fonts/Gohan.ttf",
  variable: "--font-gohan",
  display: "swap",
});

const coolvetica = localFont({
  src: [
    {
      path: "../public/fonts/Coolvetica Rg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Coolvetica Rg It.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Coolvetica Rg Cond.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Coolvetica Rg Cram.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Coolvetica Hv Comp.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-coolvetica",
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    /* As variáveis das fontes ficam no <html>, não no <body>: globals.css
       declara --font-sans no :root apontando para --font-poppins. Com as
       variáveis só no body, o :root resolvia --font-sans como vazio e o body
       herdava esse valor quebrado — resultado, tudo que não declarava
       font-family explícito caía no Times New Roman do navegador. */
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${coolvetica.variable} ${gohan.variable} ${poppins.variable}`}
    >
      <head>
        {/* Consent Mode v2: o padrão "negado" precisa entrar na fila do
            dataLayer ANTES do config e antes do gtag.js. Por isso é um
            <script> síncrono no HTML do servidor, e não um next/script
            afterInteractive — esse roda depois da hidratação, tarde demais.
            Sem isso o GA4 mostra os indicadores de consentimento "inativos". */}
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html: consentBootstrapScript(GA_MEASUREMENT_ID),
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen [font-family:var(--font-poppins)] antialiased">
        <Providers>
          <div className="site-frame site-frame--top" aria-hidden="true" />
          <div className="site-frame site-frame--left" aria-hidden="true" />
          <div className="site-frame site-frame--right" aria-hidden="true" />
          <div className="site-frame site-frame--nav-tray" aria-hidden="true" />
          <div
            className="site-corner site-corner--nav-tray-left"
            aria-hidden="true"
          />
          <div
            className="site-corner site-corner--nav-tray-right"
            aria-hidden="true"
          />
          <div
            className="site-corner site-corner--top-left"
            aria-hidden="true"
          />
          <div
            className="site-corner site-corner--top-right"
            aria-hidden="true"
          />
          <SkipToContent />
          <PageBackdrop />
          <Nav />
          {children}
          <Footer />
          <WhatsAppFloat />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
