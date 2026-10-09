import { llms, loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { z } from "zod";
import { absoluteUrl, docsRoute } from "./shared";

// see https://fumadocs.dev/docs/mdx/collections#define-docs
const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      tags: z.array(z.string()).optional(),
    }),
    // last commit date of each page, used for sitemap and structured data
    lastModified: true,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title}

URL: ${absoluteUrl(page.url)}
${page.data.description ? `\n> ${page.data.description}\n` : ""}
${await page.data.getText("processed")}`,
});
