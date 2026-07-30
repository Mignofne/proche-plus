"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toJsonStringArray } from "@/lib/exercises/mapping";
import type { ExercisePublicationStatus } from "@prisma/client";

async function requireFondateur() {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    throw new Error("Accès refusé");
  }
  return session;
}

export async function saveTheme(input: {
  id?: string;
  label: string;
  slug: string;
  icon?: string;
  displayOrder: number;
  active: boolean;
}) {
  await requireFondateur();
  if (input.id) {
    await prisma.theme.update({
      where: { id: input.id },
      data: {
        label: input.label,
        slug: input.slug,
        icon: input.icon || null,
        displayOrder: input.displayOrder,
        active: input.active,
      },
    });
  } else {
    await prisma.theme.create({
      data: {
        label: input.label,
        slug: input.slug,
        icon: input.icon || null,
        displayOrder: input.displayOrder,
        active: input.active,
      },
    });
  }
  revalidatePath("/admin-produit/exercices");
}

export async function saveExercise(input: {
  id?: string;
  themeId: string;
  autonomyScaleId: string;
  tier: number;
  name: string;
  objective: string;
  steps: string[];
  caregiverCan: string[];
  caregiverMustNot: string[];
  estimatedDuration?: string;
  risks?: string;
  onSuccessExerciseId?: string | null;
  onPartialExerciseId?: string | null;
  onFailureExerciseId?: string | null;
  crossesAutonomyLevel: boolean;
  alertOnFailure: boolean;
  status: ExercisePublicationStatus;
}) {
  await requireFondateur();

  let successScaleId: string | null = null;
  if (input.onSuccessExerciseId) {
    const success = await prisma.exercise.findUnique({
      where: { id: input.onSuccessExerciseId },
    });
    successScaleId = success?.autonomyScaleId ?? null;
  }
  const crosses =
    input.crossesAutonomyLevel ||
    (successScaleId !== null && successScaleId !== input.autonomyScaleId);

  const data = {
    themeId: input.themeId,
    autonomyScaleId: input.autonomyScaleId,
    tier: input.tier,
    name: input.name,
    objective: input.objective,
    steps: toJsonStringArray(input.steps),
    caregiverCan: toJsonStringArray(input.caregiverCan),
    caregiverMustNot: toJsonStringArray(input.caregiverMustNot),
    estimatedDuration: input.estimatedDuration || null,
    risks: input.risks || null,
    onSuccessExerciseId: input.onSuccessExerciseId || null,
    onPartialExerciseId: input.onPartialExerciseId || null,
    onFailureExerciseId: input.onFailureExerciseId || null,
    crossesAutonomyLevel: crosses,
    alertOnFailure: input.alertOnFailure,
    status: input.status,
    validatedBy: input.status === "publie" ? "Admin produit" : null,
    validatedAt: input.status === "publie" ? new Date() : null,
  };

  if (input.id) {
    // Empêcher archivage si référencé comme transition d'un exercice publié
    if (input.status === "archive") {
      const refs = await prisma.exercise.count({
        where: {
          status: "publie",
          OR: [
            { onSuccessExerciseId: input.id },
            { onPartialExerciseId: input.id },
            { onFailureExerciseId: input.id },
          ],
        },
      });
      if (refs > 0) {
        throw new Error(
          `Impossible d'archiver : ${refs} exercice(s) publié(s) le référencent encore.`
        );
      }
    }
    await prisma.exercise.update({ where: { id: input.id }, data });
    await prisma.auditLog.create({
      data: {
        action: "exercise.update",
        entity: "Exercise",
        entityId: input.id,
      },
    });
    revalidatePath("/admin-produit/exercices");
    revalidatePath(`/admin-produit/exercices/${input.id}`);
    redirect(`/admin-produit/exercices/${input.id}`);
  }

  const created = await prisma.exercise.create({ data });
  await prisma.auditLog.create({
    data: {
      action: "exercise.create",
      entity: "Exercise",
      entityId: created.id,
    },
  });
  revalidatePath("/admin-produit/exercices");
  redirect(`/admin-produit/exercices/${created.id}`);
}

export async function duplicateExercise(exerciseId: string) {
  await requireFondateur();
  const source = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!source) throw new Error("Exercice introuvable");

  const copy = await prisma.exercise.create({
    data: {
      themeId: source.themeId,
      autonomyScaleId: source.autonomyScaleId,
      tier: source.tier + 1,
      name: `${source.name} (copie)`,
      objective: source.objective,
      steps: source.steps,
      caregiverCan: source.caregiverCan,
      caregiverMustNot: source.caregiverMustNot,
      estimatedDuration: source.estimatedDuration,
      risks: source.risks,
      crossesAutonomyLevel: false,
      alertOnFailure: false,
      status: "brouillon",
    },
  });

  revalidatePath("/admin-produit/exercices");
  redirect(`/admin-produit/exercices/${copy.id}`);
}
