"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/patient-profiles";
import {
  resolveAutonomyAlert,
  setPatientAutonomyLevel,
} from "@/lib/services/autonomy";
import type { AutonomyLevel } from "@prisma/client";

async function requirePro() {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "professional" && session.role !== "admin_etablissement")
  ) {
    throw new Error("Accès refusé");
  }
  const professional = await prisma.professional.findUnique({
    where: { userId: session.userId },
  });
  if (!professional) throw new Error("Professionnel introuvable");
  return { session, professional };
}

export async function upsertPatient(input: {
  id?: string;
  firstName: string;
  lastName: string;
  autonomyLevel: AutonomyLevel;
  girLevel?: number | null;
}) {
  const { session, professional } = await requirePro();
  const profile = getProfile(input.autonomyLevel);
  const girLevel = input.girLevel ?? profile?.girSuggest ?? null;

  if (input.id) {
    const existing = await prisma.patient.findFirst({
      where: {
        id: input.id,
        establishmentId: professional.establishmentId,
      },
    });
    if (!existing) throw new Error("Patient introuvable");

    const levelChanged = existing.autonomyLevel !== input.autonomyLevel;
    const wasProvisional = existing.autonomyLevelStatus === "provisoire";

    await setPatientAutonomyLevel({
      patientId: input.id,
      autonomyLevel: input.autonomyLevel,
      source: "professionnel",
      historySource: "professionnel",
      status:
        wasProvisional || levelChanged
          ? levelChanged
            ? "confirme_ajuste"
            : "confirme"
          : existing.autonomyLevelStatus ?? "confirme",
      setByUserId: session.userId,
      createConfirmAlert: false,
      restartReviewTimer: true,
    });

    await prisma.patient.update({
      where: { id: input.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        girLevel,
      },
    });

    // Clôturer les alertes de confirmation en attente
    await prisma.autonomyAlert.updateMany({
      where: {
        patientId: input.id,
        type: "profil_a_confirmer",
        status: "en_attente",
      },
      data: {
        status:
          existing.autonomyLevel === input.autonomyLevel
            ? "confirme"
            : "ajuste",
        resolvedAt: new Date(),
        proposedLevel: input.autonomyLevel,
      },
    });
  } else {
    const patient = await prisma.patient.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        autonomyLevel: input.autonomyLevel,
        autonomyLevelStatus: "confirme",
        autonomyLevelSource: "professionnel",
        autonomyLevelSetAt: new Date(),
        girLevel,
        establishmentId: professional.establishmentId,
      },
    });

    await prisma.autonomyLevelHistory.create({
      data: {
        patientId: patient.id,
        autonomyLevel: input.autonomyLevel,
        source: "professionnel",
        setByUserId: session.userId,
      },
    });

    const interval =
      (
        await prisma.establishment.findUnique({
          where: { id: professional.establishmentId },
          select: { autonomyReviewIntervalDays: true },
        })
      )?.autonomyReviewIntervalDays ?? 15;

    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        autonomyLevelReviewDueAt: new Date(
          Date.now() + interval * 24 * 60 * 60 * 1000
        ),
      },
    });

    if (profile) {
      await prisma.educationalObjective.create({
        data: {
          patientId: patient.id,
          skill: "transfert",
          status: "en_cours",
          instructions: profile.instructionExample,
          nextStep: profile.objectiveExample,
          isCurrent: true,
        },
      });
    }
  }

  revalidatePath("/pro");
  revalidatePath("/admin-etablissement");
}

export async function deletePatient(patientId: string) {
  const { professional } = await requirePro();
  const existing = await prisma.patient.findFirst({
    where: { id: patientId, establishmentId: professional.establishmentId },
  });
  if (!existing) throw new Error("Patient introuvable");
  await prisma.patient.delete({ where: { id: patientId } });
  revalidatePath("/pro");
  revalidatePath("/admin-etablissement");
}

export async function upsertCaregiver(input: {
  patientId: string;
  caregiverLinkId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  relationship: string;
}) {
  const { professional } = await requirePro();
  const patient = await prisma.patient.findFirst({
    where: {
      id: input.patientId,
      establishmentId: professional.establishmentId,
    },
  });
  if (!patient) throw new Error("Patient introuvable dans votre établissement");

  const passwordHash = await bcrypt.hash("demo1234", 8);

  if (input.caregiverLinkId) {
    const link = await prisma.patientCaregiver.findFirst({
      where: {
        id: input.caregiverLinkId,
        patientId: input.patientId,
      },
      include: { caregiver: { include: { user: true } } },
    });
    if (!link) throw new Error("Aidant introuvable");

    await prisma.user.update({
      where: { id: link.caregiver.userId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone || null,
      },
    });
    await prisma.patientCaregiver.update({
      where: { id: link.id },
      data: { relationship: input.relationship },
    });
  } else {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      include: { caregiver: true },
    });

    let caregiverId = existingUser?.caregiver?.id;
    if (!caregiverId) {
      const user = await prisma.user.create({
        data: {
          email: input.email,
          phone: input.phone || null,
          firstName: input.firstName,
          lastName: input.lastName,
          passwordHash,
          onboardingDone: false,
          caregiver: { create: { status: "invite" } },
        },
        include: { caregiver: true },
      });
      caregiverId = user.caregiver!.id;
    }

    await prisma.patientCaregiver.upsert({
      where: {
        patientId_caregiverId: {
          patientId: input.patientId,
          caregiverId,
        },
      },
      create: {
        patientId: input.patientId,
        caregiverId,
        relationship: input.relationship,
        isPrimary: true,
      },
      update: { relationship: input.relationship },
    });
  }

  revalidatePath("/pro");
  revalidatePath(`/pro/patient/${input.patientId}`);
  revalidatePath("/admin-etablissement");
}

export async function deleteCaregiverLink(linkId: string, patientId: string) {
  const { professional } = await requirePro();
  const link = await prisma.patientCaregiver.findFirst({
    where: {
      id: linkId,
      patient: { establishmentId: professional.establishmentId },
    },
  });
  if (!link) throw new Error("Lien introuvable");
  await prisma.patientCaregiver.delete({ where: { id: linkId } });
  revalidatePath("/pro");
  revalidatePath(`/pro/patient/${patientId}`);
}

export async function confirmAutonomyAlert(alertId: string) {
  const { session, professional } = await requirePro();
  const alert = await prisma.autonomyAlert.findFirst({
    where: {
      id: alertId,
      status: "en_attente",
      audience: "professionnel",
      patient: { establishmentId: professional.establishmentId },
    },
  });
  if (!alert) throw new Error("Alerte introuvable");

  await resolveAutonomyAlert({
    alertId,
    status: "confirme",
    professionalUserId: session.userId,
  });

  revalidatePath("/pro");
  revalidatePath(`/pro/patient/${alert.patientId}`);
  revalidatePath("/admin-etablissement");
}

export async function adjustAutonomyAlert(
  alertId: string,
  adjustedLevel: AutonomyLevel
) {
  const { session, professional } = await requirePro();
  const alert = await prisma.autonomyAlert.findFirst({
    where: {
      id: alertId,
      status: "en_attente",
      audience: "professionnel",
      patient: { establishmentId: professional.establishmentId },
    },
  });
  if (!alert) throw new Error("Alerte introuvable");

  await resolveAutonomyAlert({
    alertId,
    status: "ajuste",
    adjustedLevel,
    professionalUserId: session.userId,
  });

  revalidatePath("/pro");
  revalidatePath(`/pro/patient/${alert.patientId}`);
  revalidatePath("/admin-etablissement");
}

export async function updateEstablishmentReviewInterval(days: number) {
  const { professional } = await requirePro();
  if (professional.role !== "admin_etablissement") {
    const session = await getSession();
    if (session?.role !== "admin_etablissement") {
      throw new Error("Réservé à l'admin établissement");
    }
  }

  const safeDays = Math.min(90, Math.max(7, Math.round(days)));
  await prisma.establishment.update({
    where: { id: professional.establishmentId },
    data: { autonomyReviewIntervalDays: safeDays },
  });
  revalidatePath("/admin-etablissement");
  revalidatePath("/pro");
}
