import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { fetchAnnouncement } from "@/content/announcement";
import { fetchCatalogue } from "@/content/catalogue";
import { getPostPage } from "@/content/posts";
import { fetchSiteMetadata } from "@/content/site-metadata";
import { ContactSchema } from "@/lib/validators";
import { defaultLocale } from "@/i18n/config";

export const runtime = "nodejs";

/**
 * The site's own read API. Every handler resolves through `src/content/*`, so
 * the browser sees a stable contract whether the answer currently comes from
 * the bundled fixtures or, once `RAGENTA_CONTENT_API_URL` is set, from the
 * content backend. No upstream URL or credential is ever exposed here.
 */
const app = new Hono().basePath("/api");

function localeOf(value: string | undefined): string {
  return value ?? defaultLocale;
}

app.get("/announcement", async (c) => {
  try {
    return c.json(await fetchAnnouncement(localeOf(c.req.query("locale"))));
  } catch (err) {
    console.error("[announcement] failed:", err);
    return c.json({ message: "Unable to load the announcement." }, 500);
  }
});

app.get("/catalogue", async (c) => {
  try {
    const pageRaw = Number.parseInt(c.req.query("page") ?? "1", 10);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const result = await fetchCatalogue({
      locale: localeOf(c.req.query("locale")),
      search: c.req.query("search"),
      page,
    });
    return c.json(result);
  } catch (err) {
    console.error("[catalogue] failed:", err);
    return c.json({ message: "Unable to load the catalogue." }, 500);
  }
});

app.get("/posts", async (c) => {
  try {
    const limitRaw = Number.parseInt(c.req.query("limit") ?? "9", 10);
    const offsetRaw = Number.parseInt(c.req.query("offset") ?? "0", 10);
    const result = await getPostPage({
      locale: localeOf(c.req.query("locale")),
      limit: Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 50) : 9,
      offset: Number.isFinite(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0,
      search: c.req.query("search"),
    });
    return c.json(result);
  } catch (err) {
    console.error("[posts] failed:", err);
    return c.json({ message: "Unable to load posts." }, 500);
  }
});

app.get("/site-metadata/:key", async (c) => {
  try {
    const value = await fetchSiteMetadata(c.req.param("key"));
    if (value === null) return c.json({ message: "Not found." }, 404);
    return c.json({ value });
  } catch (err) {
    console.error("[site-metadata] failed:", err);
    return c.json({ message: "Unable to load site metadata." }, 500);
  }
});

app.post(
  "/contact",
  zValidator("json", ContactSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Invalid input",
          errors: z.treeifyError(result.error),
        },
        400,
      );
    }
  }),
  async (c) => {
    const payload = c.req.valid("json");

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[contact] CONTACT_WEBHOOK_URL is not set.");
      return c.json(
        { success: false, message: "Server configuration error." },
        503,
      );
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [
            `*New contact request* — ${payload.help}`,
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            payload.company ? `Company: ${payload.company}` : null,
            payload.position ? `Position: ${payload.position}` : null,
            payload.message ? `Message: ${payload.message}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
          attribution: payload.attribution ?? {},
        }),
      });

      if (!response.ok) {
        // Log the status only — the body can echo back submitted details.
        console.error("[contact] webhook rejected:", response.status);
        return c.json(
          { success: false, message: "Something went wrong. Please try again." },
          502,
        );
      }

      return c.json({ success: true }, 201);
    } catch (err) {
      console.error("[contact] webhook request failed:", err);
      return c.json(
        { success: false, message: "Something went wrong. Please try again." },
        500,
      );
    }
  },
);

export const GET = handle(app);
export const POST = handle(app);
