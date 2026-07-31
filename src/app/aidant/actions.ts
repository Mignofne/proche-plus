"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markTransmissionRead } from "@/lib/services/aidant";
import {
  evaluateExerciseAutonomySignals,
  postponeAutonomyReview,
  setPatientAutonomyLevel,
} from "@/lib/services/autonomy";
import type { AutonomyHistorySource, AutonomyLevel } from "@prisma/client";

async function requireCaregiver() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    throw new Error("Accès refusé");
  }
  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
  });
  if (!caregiver) throw new Error("Aidant introuvable");
  return { session, caregiver };
}

async function assertCaregiverPatient(caregiverId: string, patientId: string) {
  const link = await prisma.patientCaregiver.findUnique({
    where: {
      patientId_caregiverId: { patientId, caregiverId },
    },
  });
  if (!link) throw new Error("Proche introuvable");
  return link;
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
  const { caregiver } = await requireCaregiver();
  await prisma.caregiverFeedback.create({
    data: {
      transmissionId,
      caregiverId: caregiver.id,
      outcome: outcome as "facile" | "difficile" | "non_essaye",
      difficulties: JSON.stringify(difficulties),
      wantsToDiscuss,
    },
  });

  const transmission = await prisma.transmission.findUnique({
    where: { id: transmissionId },
    include: { visit: true },
  });
  if (transmission) {
    await evaluateExerciseAutonomySignals({
      patientId: transmission.visit.patientId,
      signal: outcome === "facile" ? "success" : "failure",
    });
  }

  revalidatePath("/aidant");
  revalidatePath("/pro");
}

export async function submitCaregiverQuestion(text: string) {
  const { caregiver } = await requireCaregiver();
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
  const { caregiver } = await requireCaregiver();
  await prisma.caregiverAction.create({
    data: {
      transmissionId: input.transmissionId,
      caregiverId: caregiver.id,
      type: input.type,
      stepLabel: input.stepLabel ?? null,
      note: input.note ?? null,
    },
  });

  const transmission = await prisma.transmission.findUnique({
    where: { id: input.transmissionId },
    include: { visit: true },
  });
  if (transmission && input.type !== "note" && input.type !== "essaye") {
    await evaluateExerciseAutonomySignals({
      patientId: transmission.visit.patientId,
      signal: input.type === "realise_succes" ? "success" : "failure",
    });
  }

  revalidatePath("/aidant");
  revalidatePath("/aidant/mode-visite");
  revalidatePath("/pro");
  revalidatePath("/admin-etablissement");
}

export async function declarePatientAutonomy(input: {
  patientId: string;
  autonomyLevel: AutonomyLevel;
  historySource?: AutonomyHistorySource;
  completeOnboarding?: boolean;
  largeText?: boolean;
}) {
  const { session, caregiver } = await requireCaregiver();
  await assertCaregiverPatient(caregiver.id, input.patientId);

  await setPatientAutonomyLevel({
    patientId: input.patientId,
    autonomyLevel: input.autonomyLevel,
    source: "declare_aidant",
    historySource: input.historySource ?? "question_aidant",
    status: "provisoire",
    setByUserId: session.userId,
    createConfirmAlert: true,
    restartReviewTimer: true,
  });

  if (input.completeOnboarding) {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        onboardingDone: true,
        ...(typeof input.largeText === "boolean"
          ? { largeText: input.largeText }
          : {}),
      },
    });
    await prisma.caregiver.update({
      where: { id: caregiver.id },
      data: { status: "actif" },
    });
  }

  revalidatePath("/aidant");
  revalidatePath("/pro");
  revalidatePath("/admin-etablissement");
}

export async function answerAutonomyReviewPrompt(input: {
  patientId: string;
  changed: boolean;
}) {
  const { caregiver } = await requireCaregiver();
  await assertCaregiverPatient(caregiver.id, input.patientId);

  if (!input.changed) {
    await postponeAutonomyReview(input.patientId);
    revalidatePath("/aidant");
    return { needsPicker: false as const };
  }

  return { needsPicker: true as const };
}

export async function dismissCaregiverAutonomyAlert(alertId: string) {
  const { caregiver } = await requireCaregiver();
  const alert = await prisma.autonomyAlert.findFirst({
    where: {
      id: alertId,
      audience: "aidant",
      status: "en_attente",
      patient: {
        caregivers: { some: { caregiverId: caregiver.id } },
      },
    },
  });
  if (!alert) throw new Error("Alerte introuvable");

  await prisma.autonomyAlert.update({
    where: { id: alertId },
    data: { status: "ignore", resolvedAt: new Date() },
  });
  revalidatePath("/aidant");
}

export async function submitExerciseOutcome(input: {
  patientExerciseId: string;
  outcome: "reussi" | "essai" | "echec";
  note?: string;
  transmissionId?: string | null;
}) {
  const { caregiver } = await requireCaregiver();

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
        note: input.note ?? Statut exercice: \,
      },
    });
  }

  // Signaux autonomie depuis les résultats d'exercices
  if (input.outcome === "reussi" || input.outcome === "echec") {
    await evaluateExerciseAutonomySignals({
      patientId: pe.patientId,
      signal: input.outcome === "reussi" ? "success" : "failure",
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
