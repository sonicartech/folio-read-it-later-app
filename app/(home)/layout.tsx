import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';
import { JsonLd } from '@/components/json-ld';
import { websiteJsonLd } from '@/lib/seo';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions}>
      <JsonLd data={websiteJsonLd()} />
      {children}
    </HomeLayout>
  );
}
