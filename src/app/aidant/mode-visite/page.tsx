import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  caregiverNeedsOnboarding,
  getVisitModeData,
  listVisitProches,
  resolveVisitPatientSelection,
} from "@/lib/services/aidant";
import {
  getCurrentExerciseForTheme,
  listActiveThemesForVisit,
} from "@/lib/exercises/service";
import { parseJsonStringArray } from "@/lib/exercises/mapping";
import { ensureCatalogReady } from "@/lib/exercises/ensure-catalog";
import { ensurePatientExercisesForLevel } from "@/lib/exercises/activate-for-level";
import { ModeVisiteClient } from "./ModeVisiteClient";
import {
  ModeVisiteEmptyProches,
  ModeVisiteProchePicker,
} from "./ProchePicker";

export const dynamic = "force-dynamic";

export default async function ModeVisitePage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
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

  const { patientId: requestedPatientId } = await searchParams;
  const proches = await listVisitProches(caregiver.id);
  const selection = resolveVisitPatientSelection({
    ownedPatientIds: proches.map((p) => p.patientId),
    requestedPatientId,
  });

  if (selection.status === "empty") {
    return <ModeVisiteEmptyProches />;
  }

  if (selection.status === "unauthorized") {
    redirect("/aidant/mode-visite");
  }

  if (selection.status === "pick") {
    return <ModeVisiteProchePicker proches={proches} />;
  }

  if (selection.status === "auto" && requestedPatientId !== selection.patientId) {
    redirect(
      `/aidant/mode-visite?patientId=${encodeURIComponent(selection.patientId)}`
    );
  }

  const patientId = selection.patientId;
  const { patientLink, latestTransmission } = await getVisitModeData(
    caregiver.id,
    patientId
  );

  if (!patientLink) {
    redirect("/aidant/mode-visite");
  }

  // Secours prod : catalogue + activation des exercices publiés au bon niveau
  await ensureCatalogReady();
  await ensurePatientExercisesForLevel(
    prisma,
    patientLink.patient.id,
    patientLink.patient.autonomyLevel
  );

  const patient = patientLink.patient;
  const canChangeProche = proches.length > 1;
  const allThemes = await listActiveThemesForVisit();

  type ExerciseView = {
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
  };

  const exercisesByTheme: Record<string, ExerciseView | null> = {};

  for (const theme of allThemes) {
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

  // Aidant : uniquement les thèmes avec un exercice publié activé (pas les thèmes vides)
  const themes = allThemes
    .filter((t) => exercisesByTheme[t.id])
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Parcours thème-first dès qu'un catalogue / thème actif existe (specs §10 + UX Sally)
  if (allThemes.length > 0) {
    const readyThemeLabels = themes.map((t) => t.label);

    return (
      <ModeVisiteClient
        data={{
          mode: "exercise",
          patientId: patient.id,
          transmissionId: latestTransmission?.id ?? null,
          patientName: `${patient.firstName} ${patient.lastName}`,
          autonomyLevel: patient.autonomyLevel,
          themes: themes.map((t) => ({
            id: t.id,
            label: t.label,
            icon: t.icon,
            hasExercise: true,
          })),
          exercisesByTheme,
          readyThemeLabels,
          canChangeProche,
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
        patientId: patient.id,
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
        canChangeProche,
      }}
    />
  );
}
