import { prisma } from "@/lib/prisma";

/** True si l'aidant doit passer par /aidant/onboarding avant le reste de l'app. */
export async function caregiverNeedsOnboarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingDone: true,
      caregiver: {
        select: {
          _count: { select: { patients: true } },
        },
      },
    },
  });
  if (!user?.caregiver) return true;
  return !user.onboardingDone || user.caregiver._count.patients === 0;
}

export async function getCaregiverByUserId(userId: string) {
  return prisma.caregiver.findUnique({
    where: { userId },
    include: {
      patients: {
        include: {
          patient: {
            include: {
              objectives: { where: { isCurrent: true } },
            },
          },
        },
      },
    },
  });
}

export async function getCaregiverTransmissions(caregiverId: string) {
  return prisma.transmission.findMany({
    where: {
      visit: {
        patient: {
          caregivers: { some: { caregiverId } },
        },
      },
    },
    orderBy: { sentAt: "desc" },
    include: {
      messages: true,
      visit: { include: { patient: true } },
      feedbacks: { where: { caregiverId } },
    },
  });
}

export async function getTransmissionForCaregiver(
  caregiverId: string,
  transmissionId: string
) {
  return prisma.transmission.findFirst({
    where: {
      id: transmissionId,
      visit: {
        patient: {
          caregivers: { some: { caregiverId } },
        },
      },
    },
    include: {
      messages: true,
      visit: { include: { patient: true } },
    },
  });
}

export async function markTransmissionRead(transmissionId: string) {
  await prisma.transmission.update({
    where: { id: transmissionId },
    data: { readAt: new Date() },
  });
}

export async function getVisitModeData(caregiverId: string) {
  const [patientLink, latestTransmission] = await Promise.all([
    prisma.patientCaregiver.findFirst({
      where: { caregiverId },
      include: {
        patient: {
          include: {
            objectives: { where: { isCurrent: true } },
          },
        },
      },
    }),
    prisma.transmission.findFirst({
      where: {
        visit: {
          patient: {
            caregivers: { some: { caregiverId } },
          },
        },
      },
      orderBy: { sentAt: "desc" },
      include: { messages: true },
    }),
  ]);

  return { patientLink, latestTransmission };
}
