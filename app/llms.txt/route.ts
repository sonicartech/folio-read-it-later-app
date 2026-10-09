import { docsLlms } from "@/lib/source";
import { brand, siteDescription, siteName, siteUrl } from "@/lib/shared";

export const revalidate = false;

export async function GET() {
  const index = (await docsLlms.index()).replace(/\]\(\//g, `](${siteUrl}/`);
  const body = `# ${siteName}

> ${siteDescription}

Folio app: ${brand.url}
Full documentation as one file: ${siteUrl}/llms-full.txt
Markdown of any page: append \`.md\` to its URL (e.g. ${siteUrl}/docs/faqs.md)

${index.replace(/^# .*\n+/, "## Docs\n\n")}`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
