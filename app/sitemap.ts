import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { absoluteUrl } from "@/lib/shared";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();
  const latest = pages
    .map((page) => page.data.lastModified?.getTime() ?? 0)
    .reduce((a, b) => Math.max(a, b), 0);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latest ? new Date(latest) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pages.map((page) => ({
      url: absoluteUrl(page.url),
      lastModified: page.data.lastModified,
      changeFrequency: "monthly" as const,
      priority: page.slugs.length <= 1 ? 0.8 : 0.6,
    })),
  ];
}
