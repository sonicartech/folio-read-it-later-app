import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { pageJsonLd } from '@/lib/seo';
import {
  absoluteUrl,
  getPageImageUrl,
  getPageMarkdownUrl,
  gitConfig,
  siteName,
} from '@/lib/shared';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const breadcrumbs = getBreadcrumbItems(page.url, source.getPageTree())
    .filter((item) => item.url !== page.url)
    .map((item) => ({
      name: String(item.name),
      url: item.url ? absoluteUrl(item.url) : undefined,
    }));

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <JsonLd data={await pageJsonLd(page, breadcrumbs)} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          // the live URL, so "Open in ChatGPT/Claude/…" prompts always point at the public page
          pageUrl={absoluteUrl(page.url)}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      {page.data.lastModified && <PageLastUpdate date={page.data.lastModified} />}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const image = getPageImageUrl(page).url;

  return {
    title: page.data.title,
    description: page.data.description,
    keywords: page.data.tags,
    alternates: {
      canonical: page.url,
      types: { 'text/markdown': getPageMarkdownUrl(page).url },
    },
    openGraph: {
      type: 'article',
      url: page.url,
      siteName,
      title: page.data.title,
      description: page.data.description,
      images: { url: image, width: 1200, height: 630, alt: page.data.title },
      ...(page.data.lastModified && {
        modifiedTime: page.data.lastModified.toISOString(),
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: image,
    },
  };
}
