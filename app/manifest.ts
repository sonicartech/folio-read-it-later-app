import type { MetadataRoute } from "next";
import { brand, siteDescription, siteName } from "@/lib/shared";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "Folio Help",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: brand.color,
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
