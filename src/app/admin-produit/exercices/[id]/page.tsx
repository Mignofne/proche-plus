import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, SectionTitle } from "@/components/ui/Card";
import { parseJsonStringArray } from "@/lib/exercises/mapping";
import { repairIncompatibleExerciseStatuses } from "@/lib/exercises/repair-exercise-status";
import { ExerciseForm } from "../ExerciseForm";

export default async function EditExercicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    redirect("/connexion?role=fondateur");
  }

  await repairIncompatibleExerciseStatuses(prisma);

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: { theme: true, autonomyScale: true },
  });
  if (!exercise) notFound();

  const [themes, scales, exercises] = await Promise.all([
    prisma.theme.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.autonomyScale.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.exercise.findMany({
      include: { theme: true, autonomyScale: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const steps = parseJsonStringArray(exercise.steps);
  const can = parseJsonStringArray(exercise.caregiverCan);
  const mustNot = parseJsonStringArray(exercise.caregiverMustNot);

  return (
    <div className="min-h-dvh bg-cream">
      <main className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/admin-produit/exercices" className="text-sm text-teal">
          ← Catalogue
        </Link>

        <Card className="border-teal/20 bg-teal/5">
          <SectionTitle>Prévisualisation aidant</SectionTitle>
          <p className="mt-2 text-sm text-teal font-medium">
            {exercise.theme.label} · {exercise.autonomyScale.code} · Palier{" "}
            {exercise.tier}
          </p>
          <h2 className="mt-1 text-xl font-bold">{exercise.name}</h2>
          <p className="mt-3">{exercise.objective}</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm">
            <strong>Peut :</strong> {can.join(" · ")}
          </p>
          <p className="mt-1 text-sm">
            <strong>Ne doit pas :</strong> {mustNot.join(" · ")}
          </p>
        </Card>

        <Card>
          <SectionTitle>Modifier</SectionTitle>
          <div className="mt-4">
            <ExerciseForm
              themes={themes.map((t) => ({ id: t.id, label: t.label }))}
              scales={scales.map((s) => ({
                id: s.id,
                label: `${s.code} — ${s.label}`,
              }))}
              exerciseOptions={exercises.map((ex) => ({
                id: ex.id,
                label: `${ex.theme.label} · ${ex.autonomyScale.code}/p${ex.tier} — ${ex.name}`,
              }))}
              initial={{
                id: exercise.id,
                themeId: exercise.themeId,
                autonomyScaleId: exercise.autonomyScaleId,
                tier: exercise.tier,
                name: exercise.name,
                objective: exercise.objective,
                steps,
                caregiverCan: can,
                caregiverMustNot: mustNot,
                estimatedDuration: exercise.estimatedDuration ?? "",
                risks: exercise.risks ?? "",
                onSuccessExerciseId: exercise.onSuccessExerciseId ?? "",
                onPartialExerciseId: exercise.onPartialExerciseId ?? "",
                onFailureExerciseId: exercise.onFailureExerciseId ?? "",
                crossesAutonomyLevel: exercise.crossesAutonomyLevel,
                alertOnFailure: exercise.alertOnFailure,
                status: exercise.status,
              }}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
