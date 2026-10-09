import docs from "./docs.json";

interface Env {
  AI: Ai;
  ALLOWED_ORIGINS: string;
  MODEL: string;
}

interface DocSection {
  title: string;
  heading: string;
  url: string;
  text: string;
}

interface IncomingMessage {
  role: string;
  content?: string;
  parts?: { type: string; text?: string }[];
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const MAX_HISTORY = 10;
const MAX_MESSAGE_CHARS = 4000;
const CONTEXT_SECTIONS = 6;

const SYSTEM_PROMPT = `You are Folio's documentation assistant. Folio is a read-it-later app.
Answer questions about Folio features, getting started, saving content, the reader, importing and syncing, account management, and settings.
Base your answers on the documentation excerpts provided. If the excerpts don't cover the question, say you're not sure and suggest browsing the docs.
Keep responses concise and helpful. Use Markdown.`;

const STOP_WORDS = new Set(
  "a an and are as at be can do does for from how i in is it my of on or the to what when where which who why with you your".split(" ")
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

// BM25 index over doc sections, built once per isolate.
const index = (docs as DocSection[]).map((section) => {
  // Titles and headings count double.
  const tokens = [
    ...tokenize(`${section.title} ${section.heading}`),
    ...tokenize(`${section.title} ${section.heading}`),
    ...tokenize(section.text),
  ];
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return { section, tf, length: tokens.length };
});
const avgLength = index.reduce((sum, d) => sum + d.length, 0) / index.length;
const docFreq = new Map<string, number>();
for (const d of index) for (const t of d.tf.keys()) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);

function retrieve(query: string): DocSection[] {
  const terms = new Set(tokenize(query));
  if (terms.size === 0) return [];

  const k1 = 1.2;
  const b = 0.75;
  return index
    .map((d) => {
      let score = 0;
      for (const t of terms) {
        const f = d.tf.get(t);
        if (!f) continue;
        const n = docFreq.get(t) ?? 0;
        const idf = Math.log(1 + (index.length - n + 0.5) / (n + 0.5));
        score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.length) / avgLength));
      }
      return { section: d.section, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, CONTEXT_SECTIONS)
    .map((r) => r.section);
}

function messageText(m: IncomingMessage): string {
  const text =
    m.content ??
    (m.parts ?? [])
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
  return text.slice(0, MAX_MESSAGE_CHARS);
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  const allowOrigin = allowed.includes("*") ? "*" : allowed.includes(origin) ? origin : "";
  return {
    ...(allowOrigin && { "Access-Control-Allow-Origin": allowOrigin }),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

// Workers AI streams SSE lines like `data: {"response":"..."}`; re-emit just the text.
function sseToText(stream: ReadableStream<Uint8Array>, footer: string): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const { response } = JSON.parse(data) as { response?: string };
            if (response) controller.enqueue(encoder.encode(response));
          } catch {
            // ignore malformed lines
          }
        }
      },
      flush(controller) {
        if (footer) controller.enqueue(encoder.encode(footer));
      },
    })
  );
}

export default {
  async fetch(request, env): Promise<Response> {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST" || new URL(request.url).pathname !== "/chat") {
      return new Response("Not found", { status: 404, headers: cors });
    }

    let body: { messages?: IncomingMessage[] };
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: cors });
    }

    const history: ChatMessage[] = (body.messages ?? [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role as "user" | "assistant", content: messageText(m) }))
      .filter((m) => m.content);

    const lastUser = history.findLast((m) => m.role === "user");
    if (!lastUser) {
      return new Response("No user message", { status: 400, headers: cors });
    }

    const sources = retrieve(lastUser.content);
    const context = sources
      .map((s) => `### ${s.title} — ${s.heading}\n${s.text}`)
      .join("\n\n");

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nDocumentation excerpts:\n\n${context || "(no matching excerpts)"}`,
      },
      ...history,
    ];

    const pages = [...new Map(sources.map((s) => [s.url, s.title])).entries()].slice(0, 3);
    const footer = pages.length
      ? `\n\n**Sources:** ${pages.map(([url, title]) => `[${title}](${url})`).join(" · ")}`
      : "";

    try {
      const stream = (await env.AI.run(env.MODEL as keyof AiModels, {
        messages,
        stream: true,
      } as never)) as ReadableStream<Uint8Array>;

      return new Response(sseToText(stream, footer), {
        headers: {
          ...cors,
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response("AI request failed", { status: 502, headers: cors });
    }
  },
} satisfies ExportedHandler<Env>;
