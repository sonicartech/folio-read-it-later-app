import { readFileSync } from "node:fs";
import { join } from "node:path";
import { generateOGImage } from "fumadocs-ui/og";
import { brand } from "./shared";

const logo = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), "public/whiteLogo.svg"),
).toString("base64")}`;

// Keep descriptions to about two lines so they don't run into the footer.
function shorten(text: string | undefined, max = 95) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max))}…`;
}

/** Folio-branded Open Graph image (1200×630). */
export function folioOGImage({ title, description }: { title: string; description?: string }) {
  return generateOGImage({
    title,
    // titles over ~30 characters wrap to two lines, leaving room for one line of description
    description: shorten(description, title.length > 30 ? 55 : 95),
    site: "Help Center",
    icon: <img src={logo} width={149} height={48} alt="" />,
    primaryColor: "rgba(0, 143, 159, 0.35)",
    primaryTextColor: brand.color,
  });
}
