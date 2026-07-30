"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markTransmissionRead } from "@/lib/services/aidant";

async function requireCaregiver() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    throw new Error("Accès refusé");
  }
  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
  });
  if (!caregiver) throw new Error("Aidant introuvable");
  return caregiver;
}

export async function markTransmissionReadIfNeeded(transmissionId: string) {
  await requireCaregiver();
  const transmission = await prisma.transmission.findUnique({
    where: { id: transmissionId },
    select: { readAt: true },
  });
  if (transmission && !transmission.readAt) {
    await markTransmissionRead(transmissionId);
    revalidatePath(`/aidant/transmission/${transmissionId}`);
    revalidatePath("/aidant");
  }
}

export async function submitComprehensionCheck(
  transmissionId: string,
  result: "clair" | "doute",
  comment?: string | null
) {
  await requireCaregiver();
  await prisma.comprehensionCheck.create({
    data: {
      transmissionId,
      result,
      comment: comment ?? null,
    },
  });
  revalidatePath(`/aidant/transmission/${transmissionId}`);
}

export async function submitCaregiverFeedback(
  transmissionId: string,
  outcome: string,
  difficulties: string[],
  wantsToDiscuss: boolean
) {
  const caregiver = await requireCaregiver();
  await prisma.caregiverFeedback.create({
    data: {
      transmissionId,
      caregiverId: caregiver.id,
      outcome: outcome as "facile" | "difficile" | "non_essaye",
      difficulties: JSON.stringify(difficulties),
      wantsToDiscuss,
    },
  });
  revalidatePath("/aidant");
  revalidatePath("/pro");
}

export async function submitCaregiverQuestion(text: string) {
  const caregiver = await requireCaregiver();
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

  await prisma.question.create({
    data: {
      caregiverId: caregiver.id,
      professionalId,
      text,
    },
  });
  revalidatePath("/pro");
  revalidatePath("/admin-etablissement");
}

export async function submitCaregiverVisitAction(input: {
  transmissionId: string;
  type: "realise_succes" | "essaye" | "doute" | "aide" | "note";
  stepLabel?: string;
  note?: string;
}) {
  const caregiver = await requireCaregiver();
  await prisma.caregiverAction.create({
    data: {
      transmissionId: input.transmissionId,
      caregiverId: caregiver.id,
      type: input.type,
      stepLabel: input.stepLabel ?? null,
      note: input.note ?? null,
    },
  });
  revalidatePath("/aidant");
  revalidatePath("/aidant/mode-visite");
  revalidatePath("/pro");
  revalidatePath("/admin-etablissement");
}

export async function submitExerciseOutcome(input: {
  patientExerciseId: string;
  outcome: "reussi" | "essai" | "echec";
  note?: string;
  transmissionId?: string | null;
}) {
  const caregiver = await requireCaregiver();

  const pe = await prisma.patientExercise.findFirst({
    where: {
      id: input.patientExerciseId,
      patient: {
        caregivers: { some: { caregiverId: caregiver.id } },
      },
    },
    include: { exercise: true },
  });
  if (!pe) throw new Error("Exercice non autorisé");

  const { recordExerciseOutcome } = await import("@/lib/exercises/service");
  const decision = await recordExerciseOutcome({
    patientExerciseId: pe.id,
    outcome: input.outcome,
    note: input.note,
  });

  if (input.transmissionId) {
    const actionType =
      input.outcome === "reussi"
        ? "realise_succes"
        : input.outcome === "essai"
          ? "essaye"
          : "doute";
    await prisma.caregiverAction.create({
      data: {
        transmissionId: input.transmissionId,
        caregiverId: caregiver.id,
        type: actionType,
        stepLabel: pe.exercise.name,
        note: input.note ?? `Statut exercice: ${input.outcome}`,
      },
    });
  }

  revalidatePath("/aidant");
  revalidatePath("/aidant/mode-visite");
  revalidatePath("/pro");
  revalidatePath("/admin-etablissement");

  let message = "C'est noté — le professionnel en sera informé.";
  if (decision.kind === "advance") {
    message =
      "Bravo — un exercice suivant vous sera proposé à la prochaine visite.";
  } else if (decision.kind === "fallback") {
    message =
      "C'est noté. Un exercice plus adapté vous sera proposé la prochaine fois.";
  } else if (decision.kind === "alert_only") {
    if (decision.alertType === "level_change_proposed") {
      message =
        "Objectif atteint ! L'équipe validera le passage au niveau suivant avant de vous proposer la suite.";
    } else {
      message =
        "C'est noté. L'équipe a été alertée pour réévaluer la situation.";
    }
  } else {
    message =
      "C'est noté. On pourra réessayer le même exercice à la prochaine visite.";
  }

  return { decision, message };
}
