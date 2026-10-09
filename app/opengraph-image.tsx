import { folioOGImage } from "@/lib/og";
import { siteName } from "@/lib/shared";

export const dynamic = "force-static";

export const alt = siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return folioOGImage({
    title: "How can we help you?",
    description: "Guides, FAQs and answers for Folio, the read-it-later app.",
  });
}
