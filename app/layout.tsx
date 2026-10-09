import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist } from "next/font/google";
import type { Metadata } from "next";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Folio - Save What Inspires You | Read Later App",
    template: "%s | Folio",
  },
  description:
    "We're building a new kind of read-it-later app. Beautiful, simple, and focused on helping you actually enjoy the things you save.",
  keywords: [
    "Save to read later",
    "read-it-later",
    "read later app",
    "bookmark manager",
    "productivity",
  ],
  authors: [{ name: "Folio Team" }],
  creator: "Folio",
  publisher: "Folio",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Folio - Save What Inspires You | Read Later App",
    description:
      "We're building a new kind of read-it-later app. Beautiful, simple, and focused on helping you actually enjoy the things you save.",
    type: "website",
    locale: "en_US",
    siteName: "Folio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folio - Save What Inspires You | Read Later App",
    description:
      "We're building a new kind of read-it-later app. Beautiful, simple, and focused on helping you actually enjoy the things you save.",
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

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
