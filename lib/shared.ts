import { createGetUrl } from "fumadocs-core/source";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://folio.sonicar.tech"
).replace(/\/$/, "");
export const siteName = "Folio Help Center";
export const siteTitle = "Folio Help Center - Save What Inspires You";
export const siteDescription =
  "Guides, FAQs and answers for Folio, the beautiful read-it-later app. Learn how to save, read, listen to, organize, import and sync your content on iPhone, Android and the web.";

export const brand = {
  name: "Folio",
  url: "https://savewithfolio.com",
  app: "https://app.savewithfolio.com",
  logo: `${siteUrl}/blackLogo.svg`,
  color: "#008F9F",
};

export const maker = {
  name: "Sonicar",
  url: "https://sonicar.tech",
};

export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

export const gitConfig = {
  user: "sonicartech",
  repo: "folio-read-it-later-app",
  branch: "main",
};

/** Absolute URL on the live site; page paths get a trailing slash to match the static export. */
export function absoluteUrl(path: string) {
  let normalized = path.startsWith("/") ? path : `/${path}`;
  const lastSegment = normalized.split("/").pop() ?? "";
  if (!normalized.endsWith("/") && !lastSegment.includes(".")) normalized += "/";
  return `${siteUrl}${normalized}`;
}

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "content.md"];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "image.png"];

  return { segments, url: getImageUrl(segments, page.locale) };
}
