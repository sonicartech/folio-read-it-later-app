import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist } from "next/font/google";
import type { Metadata, Viewport } from "next";
import {
  brand,
  maker,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/shared";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Folio Help Center",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Folio",
    "Folio help center",
    "Folio docs",
    "Save to read later",
    "read-it-later app",
    "read later app",
    "bookmark manager",
    "Pocket alternative",
    "Pocket import",
    "productivity",
  ],
  authors: [{ name: "Folio Team", url: brand.url }],
  creator: maker.name,
  publisher: brand.name,
  category: "technology",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
    types: { "text/plain": "/llms.txt" },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    type: "website",
    locale: "en_US",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1213" },
  ],
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
