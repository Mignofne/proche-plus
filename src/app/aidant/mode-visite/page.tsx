import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVisitModeData } from "@/lib/services/aidant";
import { ModeVisiteClient } from "./ModeVisiteClient";

export default async function ModeVisitePage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
  });
  if (!caregiver) redirect("/connexion?role=aidant");

  const { patientLink, latestTransmission } = await getVisitModeData(
    caregiver.id
  );

  if (!latestTransmission || !patientLink) {
    redirect("/aidant");
  }

  const patient = patientLink.patient;
  const objective = patient.objectives[0];
  const messages = latestTransmission.messages;
  const instructions =
    objective?.instructions ?? "Encourager et guider verbalement";

  const instructionSteps = instructions
    .replace(/^Quand votre proche est assis\s*:\s*/i, "")
    .split(/\s*\d+\)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <ModeVisiteClient
      data={{
        transmissionId: latestTransmission.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        autonomyLevel: patient.autonomyLevel,
        nextStep: objective?.nextStep ?? null,
        instructions,
        instructionSteps:
          instructionSteps.length > 0
            ? instructionSteps
            : [instructions],
        aEssayer: messages
          .filter((m) => m.section === "a_essayer")
          .map((m) => m.content),
        aEviter: messages
          .filter((m) => m.section === "a_eviter")
          .map((m) => m.content),
      }}
    />
  );
}
