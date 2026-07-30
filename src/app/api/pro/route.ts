import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "professional") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const professional = await prisma.professional.findUnique({
    where: { userId: session.userId },
    include: { establishment: true },
  });

  if (!professional) {
    return NextResponse.json(
      { error: "Professionnel introuvable" },
      { status: 404 }
    );
  }

  const patients = await prisma.patient.findMany({
    where: { establishmentId: professional.establishmentId },
    include: {
      caregivers: { include: { caregiver: { include: { user: true } } } },
      objectives: { where: { isCurrent: true } },
      visits: {
        orderBy: { date: "desc" },
        take: 3,
        include: {
          transmission: {
            include: {
              messages: true,
              feedbacks: true,
              comprehensionChecks: true,
            },
          },
        },
      },
    },
  });

  const questions = await prisma.question.findMany({
    where: {
      professionalId: professional.id,
      status: "en_attente",
    },
    include: {
      caregiver: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeCaregivers = await prisma.caregiver.count({
    where: {
      status: "actif",
      patients: {
        some: { patient: { establishmentId: professional.establishmentId } },
      },
    },
  });

  const difficulties = await prisma.caregiverFeedback.count({
    where: {
      outcome: { in: ["difficile", "non_essaye"] },
      treated: false,
      transmission: {
        visit: {
          patient: { establishmentId: professional.establishmentId },
        },
      },
    },
  });

  return NextResponse.json({
    establishment: professional.establishment,
    stats: {
      patients: patients.length,
      activeCaregivers,
      pendingQuestions: questions.length,
      difficulties,
    },
    patients,
    questions,
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "professional") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const { action } = body;

  const professional = await prisma.professional.findUnique({
    where: { userId: session.userId },
  });
  if (!professional) {
    return NextResponse.json(
      { error: "Professionnel introuvable" },
      { status: 404 }
    );
  }

  if (action === "create_transmission") {
    const {
      patientId,
      skill,
      status,
      instructions,
      nextStep,
      messages,
    } = body;

    await prisma.educationalObjective.updateMany({
      where: { patientId, isCurrent: true },
      data: { isCurrent: false },
    });

    const objective = await prisma.educationalObjective.create({
      data: {
        patientId,
        skill,
        status,
        instructions,
        nextStep,
        isCurrent: true,
      },
    });

    const visit = await prisma.visit.create({
      data: {
        patientId,
        professionals: { create: { professionalId: professional.id } },
      },
    });

    const transmission = await prisma.transmission.create({
      data: {
        visitId: visit.id,
        objectiveId: objective.id,
        professionalId: professional.id,
        messages: {
          create: messages.map(
            (m: { section: string; content: string }) => ({
              section: m.section,
              content: m.content,
            })
          ),
        },
      },
      include: { messages: true },
    });

    return NextResponse.json({ transmission, objective });
  }

  if (action === "answer_question") {
    const { questionId, answer, status } = body;
    const question = await prisma.question.update({
      where: { id: questionId },
      data: { answer, status: status ?? "traitee" },
    });
    return NextResponse.json({ question });
  }

  if (action === "treat_feedback") {
    const { feedbackId } = body;
    await prisma.caregiverFeedback.update({
      where: { id: feedbackId },
      data: { treated: true },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "invite_caregiver") {
    const { patientId, email, phone, relationship } = body;
    // MVP: trace invitation intent (full SMS/email in production)
    const existing = email
      ? await prisma.user.findUnique({
          where: { email },
          include: { caregiver: true },
        })
      : null;

    if (existing?.caregiver) {
      await prisma.patientCaregiver.upsert({
        where: {
          patientId_caregiverId: {
            patientId,
            caregiverId: existing.caregiver.id,
          },
        },
        create: {
          patientId,
          caregiverId: existing.caregiver.id,
          relationship,
        },
        update: { relationship },
      });
      return NextResponse.json({ status: "linked", userId: existing.id });
    }

    return NextResponse.json({
      status: "invited",
      message: `Lien d'activation envoyé à ${email ?? phone}`,
    });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
