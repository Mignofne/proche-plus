import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingClient } from "./OnboardingClient";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
    include: {
      patients: {
        include: { patient: true },
        take: 1,
      },
    },
  });

  const patient = caregiver?.patients[0]?.patient ?? null;

  return (
    <OnboardingClient
      patientId={patient?.id ?? null}
      patientFirstName={patient?.firstName ?? null}
    />
  );
}
