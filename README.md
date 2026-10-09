# folio

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Defines the docs collection (`defineDocs` from `fumadocs-mdx/macro`) and the content source adapter; [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `app/layout.config.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |
| `worker/`                 | Cloudflare Worker powering the "Ask AI" chat.          |

### Ask AI (Cloudflare Worker)

The "Ask AI" dialog (`components/search.tsx`) streams answers from a Cloudflare
Worker in `worker/` that uses [Workers AI](https://developers.cloudflare.com/workers-ai/).
On each request the worker picks the most relevant sections of `content/docs`
(indexed at build time into `worker/src/docs.json`) and passes them to the model,
then appends links to the source pages.

```bash
cd worker
npm install
npx wrangler login
npm run dev      # http://localhost:8787/chat
npm run deploy   # rebuilds the docs index and deploys
```

Configuration lives in `worker/wrangler.toml`:

- `ALLOWED_ORIGINS` - comma-separated origins allowed to call the worker
  (add your production domain before deploying).
- `MODEL` - the Workers AI model to use.

Point the site at the deployed worker with an environment variable at build time:

```bash
NEXT_PUBLIC_CHAT_API_URL=https://folio-chat.<your-subdomain>.workers.dev/chat
```

If it isn't set, the site uses `http://localhost:8787/chat`.

Redeploy the worker after changing the docs so the AI sees the new content.

### Fumadocs MDX

Collections are defined inline in `lib/source.ts` with `fumadocs-mdx/macro`, where you can customise options like the frontmatter schema. Run `npm run types:check` to type-check the project.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs
