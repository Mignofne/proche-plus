import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingClient } from "./OnboardingClient";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      onboardingDone: true,
      caregiver: {
        include: {
          patients: {
            include: { patient: true },
            orderBy: { isPrimary: "desc" },
          },
        },
      },
    },
  });

  if (!user?.caregiver) {
    redirect("/connexion?role=aidant");
  }

  const links = user.caregiver.patients;
  const hasPatients = links.length > 0;

  // Déjà prêt → espace aidant
  if (user.onboardingDone && hasPatients) {
    redirect("/aidant");
  }

  const primary = links[0]?.patient ?? null;

  return (
    <OnboardingClient
      existingPatientId={primary?.id ?? null}
      existingFirstName={primary?.firstName ?? null}
      existingLastName={primary?.lastName ?? null}
    />
  );
}
