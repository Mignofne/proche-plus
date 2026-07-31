import { z } from "zod";

export const createAppVersionSchema = z.object({
  label: z.string().min(1, "Libellé requis").max(120),
  previewUrl: z
    .string()
    .url("URL Vercel invalide")
    .refine(
      (u) => /vercel\.app|localhost|127\.0\.0\.1/i.test(u),
      "Indiquez une URL Preview Vercel (ou localhost en dev)"
    ),
  notes: z.string().max(2000).optional().nullable(),
});

export type CreateAppVersionInput = z.infer<typeof createAppVersionSchema>;
