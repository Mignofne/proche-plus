import { prisma } from "@/lib/prisma";

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
