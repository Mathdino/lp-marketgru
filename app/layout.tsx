import { Nav } from "@/components/layout/nav";
import { PageBackdrop } from "@/components/layout/page-backdrop";
import { Providers } from "@/components/layout/providers";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { baseMetadata } from "@/lib/metadata";
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

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

const gohan = localFont({
  src: "../public/fonts/Gohan.ttf",
  variable: "--font-gohan",
  display: "swap",
});

const coolvetica = localFont({
  src: [
    { path: "../public/fonts/Coolvetica Rg.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Coolvetica Rg It.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/Coolvetica Rg Cond.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Coolvetica Rg Cram.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Coolvetica Hv Comp.otf", weight: "700", style: "normal" },
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${coolvetica.variable} ${gohan.variable} bg-background text-foreground min-h-screen font-sans antialiased`}
      >
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
        </Providers>
      </body>
    </html>
  );
}
