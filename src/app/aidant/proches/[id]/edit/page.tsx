import { redirect, notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProcheForm } from "@/components/aidant/ProcheForm";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { caregiverNeedsOnboarding } from "@/lib/services/aidant";

type Props = { params: Promise<{ id: string }> };

export default async function EditProchePage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  if (await caregiverNeedsOnboarding(session.userId)) {
    redirect("/aidant/onboarding");
  }

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
  });
  if (!caregiver) redirect("/connexion?role=aidant");

  const link = await prisma.patientCaregiver.findUnique({
    where: {
      patientId_caregiverId: {
        patientId: id,
        caregiverId: caregiver.id,
      },
    },
    include: { patient: true },
  });
  if (!link) notFound();

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Modifier" backHref="/aidant/proches" />
      <main className="p-4">
        <ProcheForm
          mode="edit"
          patient={{
            id: link.patient.id,
            firstName: link.patient.firstName,
            lastName: link.patient.lastName,
            autonomyLevel: link.patient.autonomyLevel,
            relationship: link.relationship,
          }}
        />
      </main>
    </div>
  );
}
