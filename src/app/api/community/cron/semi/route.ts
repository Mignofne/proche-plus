import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canTransition } from "@/lib/community/publications";
import { assertRightsGate } from "@/lib/community/publications";

/**
 * Vercel Cron → ready + notification fondateur (AD-5).
 * Auth : Authorization Bearer CRON_SECRET
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();
  const due = await prisma.communityPublication.findMany({
    where: {
      status: "scheduled",
      scheduledAt: { lte: now },
    },
  });

  let processed = 0;
  for (const pub of due) {
    try {
      assertRightsGate({
        isTestimonial: pub.isTestimonial,
        isAttributable: pub.isAttributable,
        hasAttestation: Boolean(pub.rightsAttestationId),
      });
    } catch {
      await prisma.communityPublication.update({
        where: { id: pub.id },
        data: { status: "failed" },
      });
      await prisma.communityFounderNotification.create({
        data: {
          publicationId: pub.id,
          title: "Publication bloquée (CAP-11)",
          body: `La publication « ${pub.title || pub.id} » nécessite une attestation ou une anonymisation.`,
        },
      });
      continue;
    }

    if (!canTransition(pub.status, "ready")) continue;

    await prisma.communityPublication.update({
      where: { id: pub.id },
      data: { status: "ready" },
    });
    await prisma.communityFounderNotification.create({
      data: {
        publicationId: pub.id,
        title: "Publication prête à publier",
        body: `« ${pub.title || "Sans titre"} » est prête. Publiez manuellement depuis Community — aucune API Meta/TikTok.`,
      },
    });
    processed += 1;
  }

  return NextResponse.json({ ok: true, processed });
}
