// Splits content/docs/**/*.mdx into plain-text sections the worker can search.
// Output: src/docs.json — [{ title, heading, url, text }]
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const docsDir = join(root, "../../content/docs");
const outFile = join(root, "../src/docs.json");
const MAX_SECTION_CHARS = 2500;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const path = join(dir, e.name);
      return e.isDirectory() ? walk(path) : path.endsWith(".mdx") ? [path] : [];
    })
  );
  return files.flat();
}

function toUrl(file) {
  const slug = relative(docsDir, file)
    .replace(/\.mdx$/, "")
    .replace(/(^|\/)index$/, "");
  return slug ? `/docs/${slug}` : "/docs";
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { title: "", body: source };
  const title = match[1].match(/^title:\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, "") ?? "";
  return { title, body: source.slice(match[0].length) };
}

function toPlainText(mdx) {
  return mdx
    .replace(/^(import|export)\s.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitSections(title, body) {
  const sections = [];
  let heading = title;
  let lines = [];
  const flush = () => {
    const text = toPlainText(lines.join("\n"));
    for (let i = 0; i < text.length; i += MAX_SECTION_CHARS) {
      sections.push({ heading, text: text.slice(i, i + MAX_SECTION_CHARS) });
    }
    lines = [];
  };
  for (const line of body.split("\n")) {
    const h = line.match(/^#{1,3}\s+(.+)$/);
    if (h) {
      flush();
      heading = h[1].trim();
    } else {
      lines.push(line);
    }
  }
  flush();
  return sections;
}

const files = await walk(docsDir);
const sections = [];
for (const file of files.sort()) {
  const { title, body } = parseFrontmatter(await readFile(file, "utf8"));
  const url = toUrl(file);
  for (const s of splitSections(title, body)) {
    if (s.text) sections.push({ title, heading: s.heading, url, text: s.text });
  }
}

await writeFile(outFile, JSON.stringify(sections));
console.log(`Wrote ${sections.length} sections from ${files.length} pages`);
