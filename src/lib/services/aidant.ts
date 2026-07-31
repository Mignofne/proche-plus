import { prisma } from "@/lib/prisma";

export { resolveVisitPatientSelection } from "@/lib/services/visit-patient-selection";

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

export type VisitProcheOption = {
  patientId: string;
  firstName: string;
  lastName: string;
  autonomyLevel: string;
  establishmentName: string | null;
};

export async function listVisitProches(
  caregiverId: string
): Promise<VisitProcheOption[]> {
  const links = await prisma.patientCaregiver.findMany({
    where: { caregiverId },
    orderBy: [{ isPrimary: "desc" }, { patient: { lastName: "asc" } }],
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          autonomyLevel: true,
          establishment: { select: { name: true } },
        },
      },
    },
  });

  return links.map((link) => ({
    patientId: link.patient.id,
    firstName: link.patient.firstName,
    lastName: link.patient.lastName,
    autonomyLevel: link.patient.autonomyLevel,
    establishmentName: link.patient.establishment.name,
  }));
}

export async function getVisitModeData(
  caregiverId: string,
  patientId: string
) {
  const [patientLink, latestTransmission] = await Promise.all([
    prisma.patientCaregiver.findUnique({
      where: {
        patientId_caregiverId: { patientId, caregiverId },
      },
      include: {
        patient: {
          include: {
            objectives: { where: { isCurrent: true } },
            establishment: { select: { name: true } },
          },
        },
      },
    }),
    prisma.transmission.findFirst({
      where: {
        visit: {
          patientId,
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
