import type { CommunityGeoFormat } from "@prisma/client";
import { z } from "zod";
import { GEO_FORMAT_META } from "./blog-formats";

export { GEO_FORMAT_META, buildArticleJsonLd } from "./blog-formats";

const formatKeys = Object.keys(GEO_FORMAT_META) as CommunityGeoFormat[];

export const blogArticleSchema = z
  .object({
    format: z.enum(formatKeys as [CommunityGeoFormat, ...CommunityGeoFormat[]]),
    titleSeo: z.string().min(5).max(120),
    metaDescription: z.string().min(20).max(160),
    slug: z
      .string()
      .min(3)
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug FR kebab-case"),
    tldr: z.string().max(600).optional().nullable(),
    authorName: z.string().min(2).max(80),
    authorExpertise: z.string().min(2).max(120),
    sourcesJson: z.string().default("[]"),
    disclaimer: z.string().min(20),
    bodyMarkdown: z.string().min(40),
    planJson: z.string().optional().nullable(),
    faqJson: z.string().optional().nullable(),
    howtoJson: z.string().optional().nullable(),
    themeId: z.string().optional().nullable(),
    tagsJson: z.string().default("[]"),
  })
  .superRefine((data, ctx) => {
    const meta = GEO_FORMAT_META[data.format];
    const bodyLen = data.bodyMarkdown.trim().split(/\s+/).length;
    if (!meta.tldrOptionalShort || bodyLen > 300) {
      if (!data.tldr || data.tldr.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "TL;DR requis pour ce format",
          path: ["tldr"],
        });
      }
    }
    if (meta.requiresFaq) {
      try {
        const faq = JSON.parse(data.faqJson || "[]");
        if (!Array.isArray(faq) || faq.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "FAQ : minimum 3 paires question/réponse",
            path: ["faqJson"],
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "FAQ JSON invalide",
          path: ["faqJson"],
        });
      }
    }
    if (meta.requiresHowto) {
      try {
        const steps = JSON.parse(data.howtoJson || "[]");
        if (!Array.isArray(steps) || steps.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "HowTo : minimum 3 étapes",
            path: ["howtoJson"],
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "HowTo JSON invalide",
          path: ["howtoJson"],
        });
      }
    }
  });
