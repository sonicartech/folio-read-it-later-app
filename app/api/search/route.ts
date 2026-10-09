import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Exported as a static search index; the search dialog queries it in the browser.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/open-source/supported-languages
  language: 'english',
});
