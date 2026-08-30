import { z } from "zod";

const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "me.com",
  "msn.com",
  "live.com",
];

/** Attribution props collected by `src/lib/attribution.ts` — free-form by design. */
const AttributionSchema = z.record(z.string(), z.string().nullable());

export const ContactSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => {
      const domain = email.split("@")[1]?.toLowerCase();
      if (!domain) return true;
      return !FREE_EMAIL_DOMAINS.includes(domain);
    }, "Please use a work email address"),
  name: z.string().min(1, "Name is required").max(120),
  company: z.string().max(160).optional(),
  position: z.string().max(160).optional(),
  help: z.string().min(1, "Please choose a topic").max(160),
  message: z.string().max(4000).optional(),
  attribution: AttributionSchema.optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
