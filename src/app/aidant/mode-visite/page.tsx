import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVisitModeData } from "@/lib/services/aidant";
import {
  getCurrentExerciseForTheme,
  listActiveThemesForVisit,
} from "@/lib/exercises/service";
import { parseJsonStringArray } from "@/lib/exercises/mapping";
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

  if (!patientLink) {
    redirect("/aidant");
  }

  const patient = patientLink.patient;
  const themes = await listActiveThemesForVisit();

  // Parcours thème-first dès qu'un catalogue existe (specs §10 + UX Sally)
  if (themes.length > 0) {
    const exercisesByTheme: Record<
      string,
      {
        patientExerciseId: string;
        name: string;
        objective: string;
        steps: string[];
        caregiverCan: string[];
        caregiverMustNot: string[];
        estimatedDuration: string | null;
        themeLabel: string;
        levelLabel: string;
        tier: number;
      } | null
    > = {};

    for (const theme of themes) {
      const pe = await getCurrentExerciseForTheme(patient.id, theme.id);
      exercisesByTheme[theme.id] = pe
        ? {
            patientExerciseId: pe.id,
            name: pe.exercise.name,
            objective: pe.exercise.objective,
            steps: parseJsonStringArray(pe.exercise.steps),
            caregiverCan: parseJsonStringArray(pe.exercise.caregiverCan),
            caregiverMustNot: parseJsonStringArray(pe.exercise.caregiverMustNot),
            estimatedDuration: pe.exercise.estimatedDuration,
            themeLabel: pe.exercise.theme.label,
            levelLabel: pe.exercise.autonomyScale.code,
            tier: pe.exercise.tier,
          }
        : null;
    }

    return (
      <ModeVisiteClient
        data={{
          mode: "exercise",
          transmissionId: latestTransmission?.id ?? null,
          patientName: `${patient.firstName} ${patient.lastName}`,
          autonomyLevel: patient.autonomyLevel,
          themes: themes.map((t) => ({
            id: t.id,
            label: t.label,
            icon: t.icon,
            hasExercise: Boolean(exercisesByTheme[t.id]),
          })),
          exercisesByTheme,
        }}
      />
    );
  }

  if (!latestTransmission) {
    redirect("/aidant");
  }

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
        mode: "legacy",
        transmissionId: latestTransmission.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        autonomyLevel: patient.autonomyLevel,
        nextStep: objective?.nextStep ?? null,
        instructions,
        instructionSteps:
          instructionSteps.length > 0 ? instructionSteps : [instructions],
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
