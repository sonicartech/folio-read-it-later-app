import { docsLlms } from "@/lib/source";
import { absoluteUrl, brand, siteDescription, siteName } from "@/lib/shared";

export const revalidate = false;

export async function GET() {
  const index = (await docsLlms.index()).replace(
    /\]\((\/[^)]*)\)/g,
    (_, path: string) => `](${absoluteUrl(path)})`,
  );
  const body = `# ${siteName}

> ${siteDescription}

Folio app: ${brand.url}
Full documentation as one file: ${absoluteUrl("/llms-full.txt")}
Markdown of any page: replace the trailing slash with \`.md\` (e.g. ${absoluteUrl("/docs/faqs.md")})

${index.replace(/^# .*\n+/, "## Docs\n\n")}`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
