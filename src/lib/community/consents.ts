import { z } from "zod";

export const BETA_CONSENT_TEXT_VERSION = "beta-consent-v1-2026-07";
export const BETA_CONSENT_PURPOSE_TEXT =
  "Candidature au programme bêta Proche+ — recontact dans le cadre du programme uniquement.";

export const NEWSLETTER_CONSENT_TEXT_VERSION = "newsletter-consent-v1-2026-07";
export const NEWSLETTER_CONSENT_PURPOSE_TEXT =
  "Inscription à la newsletter mensuelle Proche+ (actualités produit et contenus éducatifs).";

export const betaLeadSchema = z.object({
  email: z.string().email("Email invalide").max(200),
  firstName: z.string().min(1, "Prénom requis").max(80),
  profile: z.enum(["aidant", "pro", "autre"], {
    errorMap: () => ({ message: "Profil invalide" }),
  }),
  motivation: z.string().max(2000).optional().nullable(),
  consentBeta: z.literal(true, {
    errorMap: () => ({
      message: "Le consentement au programme bêta est obligatoire",
    }),
  }),
  consentNewsletter: z.boolean().default(false),
});

export type BetaLeadInput = z.infer<typeof betaLeadSchema>;
