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
