import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  betaLeadSchema,
  BETA_CONSENT_PURPOSE_TEXT,
  BETA_CONSENT_TEXT_VERSION,
  NEWSLETTER_CONSENT_PURPOSE_TEXT,
  NEWSLETTER_CONSENT_TEXT_VERSION,
} from "@/lib/community/consents";
import { syncNewsletterContact } from "@/lib/community/newsletter-brevo";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = betaLeadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Demande invalide. Vérifiez les champs et le consentement." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const lead = await prisma.communityBetaLead.create({
      data: {
        email: data.email.toLowerCase().trim(),
        firstName: data.firstName.trim(),
        profile: data.profile,
        motivation: data.motivation || null,
        status: "nouveau",
        newsletterOptIn: data.consentNewsletter,
        consents: {
          create: [
            {
              purpose: "beta",
              purposeText: BETA_CONSENT_PURPOSE_TEXT,
              textVersion: BETA_CONSENT_TEXT_VERSION,
              origin: "landing",
            },
            ...(data.consentNewsletter
              ? [
                  {
                    purpose: "newsletter" as const,
                    purposeText: NEWSLETTER_CONSENT_PURPOSE_TEXT,
                    textVersion: NEWSLETTER_CONSENT_TEXT_VERSION,
                    origin: "landing",
                  },
                ]
              : []),
          ],
        },
      },
    });

    if (data.consentNewsletter) {
      const sync = await syncNewsletterContact({
        email: data.email,
        firstName: data.firstName,
      });
      if (sync.ok) {
        await prisma.communityBetaLead.update({
          where: { id: lead.id },
          data: { brevoSyncedAt: sync.skipped ? null : new Date() },
        });
      } else {
        await prisma.communityBetaLead.update({
          where: { id: lead.id },
          data: { brevoSyncError: sync.error },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/community/beta]", err);
    return NextResponse.json(
      { error: "Impossible d’enregistrer votre candidature pour le moment." },
      { status: 500 }
    );
  }
}
