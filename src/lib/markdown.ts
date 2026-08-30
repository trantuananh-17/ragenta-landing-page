import { isValidElement, type ReactNode } from "react";

/** One entry in a document's table of contents. */
export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

/**
 * The table of contents reads heading text as raw markdown while the rendered
 * heading receives it as React children, so inline syntax has to come off the
 * former for the two to read the same.
 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

/**
 * Slug for a heading, used as its anchor id.
 *
 * Accents are decomposed and dropped first, so a Vietnamese heading produces a
 * readable ascii anchor ("Bảng giá" → "bang-gia") instead of losing its vowels
 * to the ascii filter below. `đ` has no decomposed form, hence the explicit
 * pair.
 */
export function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Two headings with the same text would otherwise share an anchor and the
 * second would be unreachable, so repeats get a numeric suffix. `seen` carries
 * the counts, which is what keeps the extractor and the renderer in step.
 */
function createUniqueSlug(text: string, seen: Map<string, number>): string {
  const base = slugifyHeading(text) || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);

  return count === 0 ? base : `${base}-${count + 1}`;
}

/**
 * Headings of a markdown document, in document order.
 *
 * Levels 1–3 are collected even though the table of contents shows only 2–3:
 * the ids must match the ones `createHeadingIdResolver` hands the rendered
 * headings, and that only holds while both walk the same headings in the same
 * order.
 */
export function extractTocHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();
  let insideFence = false;

  for (const line of markdown.split("\n")) {
    // A `# comment` inside a fenced block is not a heading. Counting it would
    // put an entry in the list that the renderer never emits, and every id
    // after it would shift, so those links would land nowhere.
    if (/^\s*(```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (!match) continue;

    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    headings.push({
      id: createUniqueSlug(text, seen),
      text,
      level: match[1].length,
    });
  }

  return headings;
}

/** Flattens a rendered heading's children back to plain text for slugging. */
export function reactNodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return reactNodeToText(node.props.children);
  }
  return "";
}

/**
 * Assigns heading ids during a render. One resolver per document: it holds the
 * duplicate counter, so calling it in document order reproduces exactly what
 * `extractTocHeadings` produced for the same source.
 */
export function createHeadingIdResolver(): (text: string) => string {
  const seen = new Map<string, number>();

  return (text: string) => createUniqueSlug(text, seen);
}
