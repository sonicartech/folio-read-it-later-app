// Shrinks the docs screenshots in the static export (out/) so pages load fast.
// Static export can't use Next's on-demand image optimizer, and the source PNGs
// are up to ~14k px wide. Originals in public/ are left untouched.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT_DIR = fileURLToPath(new URL("../out/", import.meta.url));
const MAX_WIDTH = 3000;
const CONCURRENCY = 4;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))
  );
  return files.flat();
}

async function optimize(file) {
  const input = await readFile(file);
  const ext = extname(file).toLowerCase();
  let image = sharp(input, { limitInputPixels: false });
  const { width = 0 } = await image.metadata();
  if (width > MAX_WIDTH) image = image.resize({ width: MAX_WIDTH, withoutEnlargement: true });

  const output =
    ext === ".png"
      ? await image.png({ palette: true, quality: 85, compressionLevel: 9, effort: 8 }).toBuffer()
      : await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();

  if (output.length >= input.length) return [input.length, input.length];
  await writeFile(file, output);
  return [input.length, output.length];
}

const files = (await walk(OUT_DIR)).filter(
  (f) => /\.(png|jpe?g)$/i.test(f) && !f.startsWith(join(OUT_DIR, "og/"))
);

let before = 0;
let after = 0;
for (let i = 0; i < files.length; i += CONCURRENCY) {
  const results = await Promise.all(files.slice(i, i + CONCURRENCY).map(optimize));
  for (const [b, a] of results) {
    before += b;
    after += a;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`Optimized ${files.length} images: ${mb(before)} MB -> ${mb(after)} MB`);
