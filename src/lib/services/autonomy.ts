import type {
  AutonomyHistorySource,
  AutonomyLevel,
  AutonomyLevelSource,
  AutonomyLevelStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { addDays, adjacentLevel } from "@/lib/autonomy-profiles";
import { getProfile } from "@/lib/patient-profiles";

const SUCCESS_SIGNAL_THRESHOLD = 2;
const FAILURE_SIGNAL_THRESHOLD = 2;
const SIGNAL_WINDOW_DAYS = 14;

export async function getReviewIntervalDays(establishmentId: string) {
  const est = await prisma.establishment.findUnique({
    where: { id: establishmentId },
    select: { autonomyReviewIntervalDays: true },
  });
  return est?.autonomyReviewIntervalDays ?? 15;
}

export async function setPatientAutonomyLevel(input: {
  patientId: string;
  autonomyLevel: AutonomyLevel;
  source: AutonomyLevelSource;
  historySource: AutonomyHistorySource;
  status: AutonomyLevelStatus;
  setByUserId?: string | null;
  createConfirmAlert?: boolean;
  restartReviewTimer?: boolean;
}) {
  const patient = await prisma.patient.findUnique({
    where: { id: input.patientId },
    include: { establishment: true },
  });
  if (!patient) throw new Error("Patient introuvable");

  const now = new Date();
  const intervalDays = patient.establishment.autonomyReviewIntervalDays;
  const profile = getProfile(input.autonomyLevel);

  const updated = await prisma.patient.update({
    where: { id: input.patientId },
    data: {
      autonomyLevel: input.autonomyLevel,
      autonomyLevelStatus: input.status,
      autonomyLevelSource: input.source,
      autonomyLevelSetAt: now,
      autonomyLevelReviewDueAt: input.restartReviewTimer !== false
        ? addDays(now, intervalDays)
        : patient.autonomyLevelReviewDueAt,
      girLevel: profile?.girSuggest ?? patient.girLevel,
    },
  });

  await prisma.autonomyLevelHistory.create({
    data: {
      patientId: input.patientId,
      autonomyLevel: input.autonomyLevel,
      source: input.historySource,
      setByUserId: input.setByUserId ?? null,
    },
  });

  if (profile) {
    await prisma.educationalObjective.updateMany({
      where: { patientId: input.patientId, isCurrent: true },
      data: {
        instructions: profile.instructionExample,
        nextStep: profile.objectiveExample,
      },
    });
  }

  if (input.createConfirmAlert) {
    await prisma.autonomyAlert.create({
      data: {
        patientId: input.patientId,
        type: "profil_a_confirmer",
        audience: "professionnel",
        proposedLevel: input.autonomyLevel,
        message: `Nouveau profil déclaré par la famille de ${patient.firstName} ${patient.lastName} — à confirmer`,
      },
    });
  }

  return updated;
}

export async function confirmPatientAutonomy(input: {
  patientId: string;
  professionalUserId: string;
  adjustedLevel?: AutonomyLevel;
}) {
  const patient = await prisma.patient.findUnique({
    where: { id: input.patientId },
  });
  if (!patient) throw new Error("Patient introuvable");

  const adjusted =
    input.adjustedLevel && input.adjustedLevel !== patient.autonomyLevel;
  const level = input.adjustedLevel ?? patient.autonomyLevel;

  await setPatientAutonomyLevel({
    patientId: input.patientId,
    autonomyLevel: level,
    source: "professionnel",
    historySource: "professionnel",
    status: adjusted ? "confirme_ajuste" : "confirme",
    setByUserId: input.professionalUserId,
    createConfirmAlert: false,
    restartReviewTimer: true,
  });

  await prisma.autonomyAlert.updateMany({
    where: {
      patientId: input.patientId,
      type: "profil_a_confirmer",
      status: "en_attente",
      audience: "professionnel",
    },
    data: {
      status: adjusted ? "ajuste" : "confirme",
      resolvedAt: new Date(),
      proposedLevel: level,
    },
  });
}

export async function postponeAutonomyReview(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: { establishment: true },
  });
  if (!patient) throw new Error("Patient introuvable");

  const due = addDays(
    new Date(),
    patient.establishment.autonomyReviewIntervalDays
  );
  await prisma.patient.update({
    where: { id: patientId },
    data: { autonomyLevelReviewDueAt: due },
  });
}

/** Signaux exercice → alertes upgrade / downgrade (immédiat, non calendaire). */
export async function evaluateExerciseAutonomySignals(input: {
  patientId: string;
  signal: "success" | "failure";
}) {
  const patient = await prisma.patient.findUnique({
    where: { id: input.patientId },
  });
  if (!patient) return;

  const since = addDays(new Date(), -SIGNAL_WINDOW_DAYS);

  const [successActions, failureActions, successFeedbacks, failureFeedbacks] =
    await Promise.all([
      prisma.caregiverAction.count({
        where: {
          type: "realise_succes",
          createdAt: { gte: since },
          transmission: { visit: { patientId: input.patientId } },
        },
      }),
      prisma.caregiverAction.count({
        where: {
          type: { in: ["doute", "aide"] },
          createdAt: { gte: since },
          transmission: { visit: { patientId: input.patientId } },
        },
      }),
      prisma.caregiverFeedback.count({
        where: {
          outcome: "facile",
          createdAt: { gte: since },
          transmission: { visit: { patientId: input.patientId } },
        },
      }),
      prisma.caregiverFeedback.count({
        where: {
          outcome: { in: ["difficile", "non_essaye"] },
          createdAt: { gte: since },
          transmission: { visit: { patientId: input.patientId } },
        },
      }),
    ]);

  const successes = successActions + successFeedbacks;
  const failures = failureActions + failureFeedbacks;

  if (input.signal === "success" && successes >= SUCCESS_SIGNAL_THRESHOLD) {
    const next = adjacentLevel(patient.autonomyLevel, "up");
    if (!next) return;
    await createLevelChangeProposal({
      patientId: input.patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      type: "proposition_upgrade",
      proposedLevel: next,
      currentLevel: patient.autonomyLevel,
    });
  }

  if (input.signal === "failure" && failures >= FAILURE_SIGNAL_THRESHOLD) {
    const next = adjacentLevel(patient.autonomyLevel, "down");
    if (!next) return;
    await createLevelChangeProposal({
      patientId: input.patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      type: "proposition_downgrade",
      proposedLevel: next,
      currentLevel: patient.autonomyLevel,
    });
  }
}

async function createLevelChangeProposal(input: {
  patientId: string;
  patientName: string;
  type: "proposition_upgrade" | "proposition_downgrade";
  proposedLevel: AutonomyLevel;
  currentLevel: AutonomyLevel;
}) {
  const existing = await prisma.autonomyAlert.findFirst({
    where: {
      patientId: input.patientId,
      type: input.type,
      status: "en_attente",
      proposedLevel: input.proposedLevel,
    },
  });
  if (existing) return;

  const isUp = input.type === "proposition_upgrade";
  const proMsg = isUp
    ? `Succès répétés pour ${input.patientName} — proposition de monter d’un niveau d’autonomie`
    : `Difficultés répétées pour ${input.patientName} — reconsidérer un niveau plus sécurisé`;
  const aidantMsg = isUp
    ? "Votre proche réussit bien ces exercices — souhaitez-vous proposer un niveau d’autonomie un cran plus élevé à l’équipe ?"
    : "Les exercices semblent difficiles — l’équipe peut revoir le niveau d’autonomie pour plus de sécurité.";

  await prisma.autonomyAlert.createMany({
    data: [
      {
        patientId: input.patientId,
        type: input.type,
        audience: "professionnel",
        proposedLevel: input.proposedLevel,
        message: proMsg,
      },
      {
        patientId: input.patientId,
        type: input.type,
        audience: "aidant",
        proposedLevel: input.proposedLevel,
        message: aidantMsg,
      },
    ],
  });
}

export async function resolveAutonomyAlert(input: {
  alertId: string;
  status: "confirme" | "ajuste" | "ignore";
  adjustedLevel?: AutonomyLevel;
  professionalUserId: string;
}) {
  const alert = await prisma.autonomyAlert.findUnique({
    where: { id: input.alertId },
    include: { patient: true },
  });
  if (!alert || alert.status !== "en_attente") {
    throw new Error("Alerte introuvable");
  }

  if (alert.type === "profil_a_confirmer") {
    await confirmPatientAutonomy({
      patientId: alert.patientId,
      professionalUserId: input.professionalUserId,
      adjustedLevel:
        input.status === "ajuste" ? input.adjustedLevel : undefined,
    });
    return;
  }

  if (
    (input.status === "confirme" || input.status === "ajuste") &&
    (alert.proposedLevel || input.adjustedLevel)
  ) {
    const level = input.adjustedLevel ?? alert.proposedLevel!;
    await setPatientAutonomyLevel({
      patientId: alert.patientId,
      autonomyLevel: level,
      source: "professionnel",
      historySource: "signal_exercice",
      status: input.status === "ajuste" ? "confirme_ajuste" : "confirme",
      setByUserId: input.professionalUserId,
      createConfirmAlert: false,
    });
  }

  await prisma.autonomyAlert.update({
    where: { id: input.alertId },
    data: {
      status: input.status,
      resolvedAt: new Date(),
      ...(input.adjustedLevel ? { proposedLevel: input.adjustedLevel } : {}),
    },
  });

  // Résoudre les alertes jumelles aidant / pro sur le même type
  await prisma.autonomyAlert.updateMany({
    where: {
      patientId: alert.patientId,
      type: alert.type,
      status: "en_attente",
      id: { not: input.alertId },
    },
    data: {
      status: input.status === "ignore" ? "ignore" : input.status,
      resolvedAt: new Date(),
    },
  });
}
