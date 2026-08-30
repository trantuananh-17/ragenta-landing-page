import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = `${SITE_NAME} — AI agents and RAG chat on your own knowledge`;

const TITLE_MAX = 110;

/**
 * Fetch just the glyphs a title needs. Satori's bundled font has no Vietnamese
 * diacritics, so without this a `vi` title renders as boxes.
 */
async function loadGoogleFont(
  family: string,
  text: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(
      / /g,
      "+",
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\(([^)]+)\) format/);
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}...`;
}

function Dot({
  size,
  left,
  right,
  top,
}: {
  size: number;
  left?: number;
  right?: number;
  top: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: "#ffffff",
        top,
        ...(left !== undefined ? { left } : {}),
        ...(right !== undefined ? { right } : {}),
      }}
    />
  );
}

/**
 * The social card: cream ground, a soft brand watermark bleeding off the
 * bottom-right corner, the wordmark top-left, and one large title. Drawn with
 * plain boxes rather than an SVG asset so Satori renders it identically in
 * every environment.
 */
export async function renderOgImage({ title }: { title: string }) {
  const clamped = clamp(title, TITLE_MAX);
  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 600;
    style: "normal";
  }[] = [];
  let fontFamily = "sans-serif";

  const data = await loadGoogleFont("Inter", `${clamped}${SITE_NAME}`, 600);
  if (data) {
    fonts.push({ name: "Inter", data, weight: 600, style: "normal" });
    fontFamily = "Inter, sans-serif";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#f7f7f4",
          fontFamily,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            right: -140,
            bottom: -170,
            width: 620,
            height: 620,
            borderRadius: 170,
            backgroundColor: "#8b5cf6",
            opacity: 0.1,
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 80,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: "#7c3aed",
                marginRight: 18,
              }}
            >
              <Dot size={20} left={12} top={22} />
              <Dot size={12} right={12} top={12} />
              <Dot size={12} right={12} top={26} />
              <Dot size={12} right={12} top={40} />
            </div>
            <span style={{ fontSize: 42, fontWeight: 600, color: "#0f172a" }}>
              {SITE_NAME}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              color: "#0f172a",
              maxWidth: 980,
            }}
          >
            {clamped}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
