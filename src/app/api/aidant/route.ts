import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
    include: {
      patients: {
        include: {
          patient: {
            include: {
              objectives: { where: { isCurrent: true } },
              visits: {
                orderBy: { date: "desc" },
                take: 1,
                include: {
                  transmission: {
                    include: { messages: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!caregiver) {
    return NextResponse.json({ error: "Aidant introuvable" }, { status: 404 });
  }

  const transmissions = await prisma.transmission.findMany({
    where: {
      visit: {
        patient: {
          caregivers: { some: { caregiverId: caregiver.id } },
        },
      },
    },
    orderBy: { sentAt: "desc" },
    include: {
      messages: true,
      visit: { include: { patient: true } },
      feedbacks: { where: { caregiverId: caregiver.id } },
    },
  });

  return NextResponse.json({ caregiver, transmissions });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  const { action } = body;

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
  });
  if (!caregiver) {
    return NextResponse.json({ error: "Aidant introuvable" }, { status: 404 });
  }

  if (action === "mark_read") {
    const { transmissionId } = body;
    await prisma.transmission.update({
      where: { id: transmissionId },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "comprehension") {
    const { transmissionId, result, comment } = body;
    await prisma.comprehensionCheck.create({
      data: {
        transmissionId,
        result,
        comment: comment ?? null,
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "feedback") {
    const { transmissionId, outcome, difficulties, wantsToDiscuss } = body;
    await prisma.caregiverFeedback.create({
      data: {
        transmissionId,
        caregiverId: caregiver.id,
        outcome,
        difficulties: JSON.stringify(difficulties ?? []),
        wantsToDiscuss: wantsToDiscuss ?? false,
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "question") {
    const { text } = body;
    const link = await prisma.patientCaregiver.findFirst({
      where: { caregiverId: caregiver.id },
      include: {
        patient: {
          include: {
            visits: {
              orderBy: { date: "desc" },
              take: 1,
              include: { professionals: true },
            },
          },
        },
      },
    });

    const professionalId =
      link?.patient.visits[0]?.professionals[0]?.professionalId ?? null;

    const question = await prisma.question.create({
      data: {
        caregiverId: caregiver.id,
        professionalId,
        text,
      },
    });
    return NextResponse.json({ question });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
