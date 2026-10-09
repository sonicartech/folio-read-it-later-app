import type { InferPageType } from "fumadocs-core/source";
import type { source } from "./source";
import {
  absoluteUrl,
  brand,
  getPageImageUrl,
  maker,
  siteDescription,
  siteName,
  siteUrl,
} from "./shared";

type Page = InferPageType<typeof source>;

export interface FAQ {
  question: string;
  answer: string;
}

// Remove emoji used as decoration in titles, e.g. "🕓 How long does an import take?"
function stripEmoji(text: string) {
  return text
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function markdownToText(markdown: string) {
  return markdown
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|`)/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extracts `<Accordion title="...">answer</Accordion>` pairs from a page's MDX source. */
export function extractFAQs(mdx: string): FAQ[] {
  const faqs: FAQ[] = [];
  const pattern = /<Accordion\s+title=(["'])([\s\S]*?)\1[^>]*>([\s\S]*?)<\/Accordion>/g;
  for (const [, , title, body] of mdx.matchAll(pattern)) {
    const question = stripEmoji(title);
    const answer = markdownToText(body);
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}

const organization = {
  "@type": "Organization",
  "@id": `${brand.url}/#organization`,
  name: brand.name,
  url: brand.url,
  logo: brand.logo,
};

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": organization["@id"] },
        creator: { "@type": "Organization", name: maker.name, url: maker.url },
      },
      {
        "@type": "SoftwareApplication",
        name: brand.name,
        url: brand.url,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "iOS, Android, Web, Chrome, Firefox, Edge, Safari",
        publisher: { "@id": organization["@id"] },
      },
    ],
  };
}

export async function pageJsonLd(page: Page, breadcrumbs: { name: string; url?: string }[]) {
  const url = absoluteUrl(page.url);
  const lastModified = page.data.lastModified?.toISOString();
  const faqs = extractFAQs(await page.data.getText("raw"));

  const graph: Record<string, unknown>[] = [
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: page.data.title,
      description: page.data.description,
      url,
      mainEntityOfPage: url,
      image: absoluteUrl(getPageImageUrl(page).url),
      inLanguage: "en",
      keywords: page.data.tags?.join(", "),
      ...(lastModified && { dateModified: lastModified }),
      author: organization,
      publisher: organization,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@type": "SoftwareApplication", name: brand.name, url: brand.url },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { name: "Help Center", url: siteUrl },
        ...breadcrumbs,
        { name: page.data.title, url },
      ].map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: stripEmoji(item.name),
        ...(item.url && { item: item.url }),
      })),
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
