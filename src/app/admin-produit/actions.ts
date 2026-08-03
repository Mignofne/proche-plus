"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toJsonStringArray } from "@/lib/exercises/mapping";
import type { AutonomyLevel, ExercisePublicationStatus } from "@prisma/client";

async function requireFondateur() {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    throw new Error("Accès refusé");
  }
  return session;
}

function revalidateCatalog(exerciseId?: string) {
  revalidatePath("/admin-produit/exercices");
  revalidatePath("/aidant/mode-visite");
  if (exerciseId) revalidatePath(`/admin-produit/exercices/${exerciseId}`);
}

function slugify(label: string) {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 48);
}

// --- Thèmes ---

export async function saveTheme(input: {
  id?: string;
  label: string;
  slug?: string;
  icon?: string;
  displayOrder: number;
  active: boolean;
}) {
  await requireFondateur();
  const label = input.label.trim();
  if (!label) throw new Error("Le libellé du thème est obligatoire");

  const slug = (input.slug?.trim() || slugify(label)).toLowerCase();
  const data = {
    label,
    slug,
    icon: input.icon?.trim() || null,
    displayOrder: Number(input.displayOrder) || 0,
    active: input.active,
  };

  if (input.id) {
    await prisma.theme.update({ where: { id: input.id }, data });
    await prisma.auditLog.create({
      data: {
        action: "theme.update",
        entity: "Theme",
        entityId: input.id,
      },
    });
  } else {
    const created = await prisma.theme.create({ data });
    await prisma.auditLog.create({
      data: {
        action: "theme.create",
        entity: "Theme",
        entityId: created.id,
      },
    });
  }
  revalidateCatalog();
}

export async function deleteTheme(themeId: string) {
  await requireFondateur();
  const published = await prisma.exercise.count({
    where: { themeId, status: "publie" },
  });
  if (published > 0) {
    throw new Error(
      `Impossible de supprimer : ${published} exercice(s) publié(s) y sont rattachés. Archivez-les d'abord ou désactivez le thème.`
    );
  }

  // Soft : désactiver si des exercices existent encore (brouillon/archive)
  const anyEx = await prisma.exercise.count({ where: { themeId } });
  if (anyEx > 0) {
    await prisma.theme.update({
      where: { id: themeId },
      data: { active: false },
    });
    await prisma.auditLog.create({
      data: {
        action: "theme.deactivate",
        entity: "Theme",
        entityId: themeId,
      },
    });
  } else {
    await prisma.theme.delete({ where: { id: themeId } });
    await prisma.auditLog.create({
      data: {
        action: "theme.delete",
        entity: "Theme",
        entityId: themeId,
      },
    });
  }
  revalidateCatalog();
}

// --- Niveaux d'autonomie ---

export async function saveAutonomyScale(input: {
  id?: string;
  code: string;
  label: string;
  patientEnum: AutonomyLevel;
  displayOrder: number;
  active: boolean;
}) {
  await requireFondateur();
  const code = input.code.trim().toUpperCase();
  const label = input.label.trim();
  if (!code || !label) throw new Error("Code et libellé obligatoires");

  const data = {
    code,
    label,
    patientEnum: input.patientEnum,
    displayOrder: Number(input.displayOrder) || 0,
    active: input.active,
  };

  if (input.id) {
    await prisma.autonomyScale.update({ where: { id: input.id }, data });
    await prisma.auditLog.create({
      data: {
        action: "autonomy_scale.update",
        entity: "AutonomyScale",
        entityId: input.id,
      },
    });
  } else {
    const created = await prisma.autonomyScale.create({ data });
    await prisma.auditLog.create({
      data: {
        action: "autonomy_scale.create",
        entity: "AutonomyScale",
        entityId: created.id,
      },
    });
  }
  revalidateCatalog();
}

export async function deleteAutonomyScale(scaleId: string) {
  await requireFondateur();
  const used = await prisma.exercise.count({
    where: { autonomyScaleId: scaleId },
  });
  if (used > 0) {
    await prisma.autonomyScale.update({
      where: { id: scaleId },
      data: { active: false },
    });
    await prisma.auditLog.create({
      data: {
        action: "autonomy_scale.deactivate",
        entity: "AutonomyScale",
        entityId: scaleId,
      },
    });
  } else {
    await prisma.autonomyScale.delete({ where: { id: scaleId } });
    await prisma.auditLog.create({
      data: {
        action: "autonomy_scale.delete",
        entity: "AutonomyScale",
        entityId: scaleId,
      },
    });
  }
  revalidateCatalog();
}

// --- Exercices ---

export async function saveExercise(input: {
  id?: string;
  themeId: string;
  /** Édition : un seul niveau. */
  autonomyScaleId?: string;
  /** Création : un ou plusieurs niveaux (une fiche par niveau). */
  autonomyScaleIds?: string[];
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

  const name = input.name.trim();
  const objective = input.objective.trim();
  if (!name || !objective) {
    throw new Error("Nom et objectif sont obligatoires");
  }

  const scaleIds = [
    ...new Set(
      (input.id
        ? [input.autonomyScaleId]
        : input.autonomyScaleIds?.length
          ? input.autonomyScaleIds
          : [input.autonomyScaleId]
      ).filter((id): id is string => Boolean(id))
    ),
  ];
  if (scaleIds.length === 0) {
    throw new Error("Sélectionnez au moins un niveau d'autonomie.");
  }

  const scales = await prisma.autonomyScale.findMany({
    where: { id: { in: scaleIds }, active: true },
    select: { id: true },
  });
  if (scales.length !== scaleIds.length) {
    throw new Error("Un ou plusieurs niveaux d'autonomie sont invalides.");
  }

  let successScaleId: string | null = null;
  if (input.onSuccessExerciseId) {
    const success = await prisma.exercise.findUnique({
      where: { id: input.onSuccessExerciseId },
    });
    successScaleId = success?.autonomyScaleId ?? null;
  }

  const baseFields = {
    themeId: input.themeId,
    tier: input.tier,
    name,
    objective,
    steps: toJsonStringArray(input.steps),
    caregiverCan: toJsonStringArray(input.caregiverCan),
    caregiverMustNot: toJsonStringArray(input.caregiverMustNot),
    estimatedDuration: input.estimatedDuration || null,
    risks: input.risks || null,
    onSuccessExerciseId: input.onSuccessExerciseId || null,
    onPartialExerciseId: input.onPartialExerciseId || null,
    onFailureExerciseId: input.onFailureExerciseId || null,
    alertOnFailure: input.alertOnFailure,
    status: input.status,
    validatedBy: input.status === "publie" ? "Admin produit" : null,
    validatedAt: input.status === "publie" ? new Date() : null,
  };

  if (input.id) {
    const autonomyScaleId = scaleIds[0]!;
    const crosses =
      input.crossesAutonomyLevel ||
      (successScaleId !== null && successScaleId !== autonomyScaleId);
    const data = { ...baseFields, autonomyScaleId, crossesAutonomyLevel: crosses };

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
    revalidateCatalog(input.id);
    redirect(`/admin-produit/exercices/${input.id}`);
  }

  const createdIds: string[] = [];
  for (const autonomyScaleId of scaleIds) {
    const crosses =
      input.crossesAutonomyLevel ||
      (successScaleId !== null && successScaleId !== autonomyScaleId);
    const created = await prisma.exercise.create({
      data: { ...baseFields, autonomyScaleId, crossesAutonomyLevel: crosses },
    });
    if (!created.onPartialExerciseId) {
      await prisma.exercise.update({
        where: { id: created.id },
        data: { onPartialExerciseId: created.id },
      });
    }
    await prisma.auditLog.create({
      data: {
        action: "exercise.create",
        entity: "Exercise",
        entityId: created.id,
      },
    });
    createdIds.push(created.id);
  }

  revalidateCatalog();
  if (createdIds.length === 1) {
    redirect(`/admin-produit/exercices/${createdIds[0]}`);
  }
  redirect(
    `/admin-produit/exercices?q=${encodeURIComponent(name)}`
  );
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

  revalidateCatalog(copy.id);
  redirect(`/admin-produit/exercices/${copy.id}`);
}

const PUBLICATION_STATUSES: ExercisePublicationStatus[] = [
  "brouillon",
  "a_valider",
  "publie",
  "archive",
];

/** Change le statut de plusieurs exercices d’un coup (référentiel admin produit). */
export async function bulkUpdateExerciseStatus(input: {
  exerciseIds: string[];
  status: ExercisePublicationStatus;
}): Promise<{ updated: number }> {
  await requireFondateur();

  const ids = [...new Set(input.exerciseIds.filter(Boolean))];
  if (ids.length === 0) {
    throw new Error("Sélectionnez au moins un exercice.");
  }
  if (!PUBLICATION_STATUSES.includes(input.status)) {
    throw new Error("Statut invalide.");
  }

  const existing = await prisma.exercise.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  if (existing.length !== ids.length) {
    throw new Error("Un ou plusieurs exercices sont introuvables.");
  }

  if (input.status === "archive") {
    const blockers = await prisma.exercise.findMany({
      where: {
        status: "publie",
        id: { notIn: ids },
        OR: [
          { onSuccessExerciseId: { in: ids } },
          { onPartialExerciseId: { in: ids } },
          { onFailureExerciseId: { in: ids } },
        ],
      },
      select: { name: true, onSuccessExerciseId: true, onPartialExerciseId: true, onFailureExerciseId: true },
    });
    if (blockers.length > 0) {
      throw new Error(
        `Impossible d'archiver : des exercices publiés référencent encore la sélection (${blockers
          .map((b) => b.name)
          .slice(0, 3)
          .join(", ")}${blockers.length > 3 ? "…" : ""}).`
      );
    }
  }

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.exercise.updateMany({
      where: { id: { in: ids } },
      data: {
        status: input.status,
        validatedBy: input.status === "publie" ? "Admin produit" : null,
        validatedAt: input.status === "publie" ? now : null,
      },
    });

    if (input.status === "archive") {
      await tx.patientExercise.updateMany({
        where: { exerciseId: { in: ids }, isCurrent: true },
        data: { isCurrent: false, currentStatus: "acquis" },
      });
    }

    for (const id of ids) {
      await tx.auditLog.create({
        data: {
          action: "exercise.bulk_status",
          entity: "Exercise",
          entityId: id,
        },
      });
    }
  });

  revalidateCatalog();
  return { updated: ids.length };
}

/** Change le niveau d’autonomie (appropriation patient) de plusieurs exercices. */
export async function bulkUpdateExerciseAutonomy(input: {
  exerciseIds: string[];
  autonomyScaleId: string;
}): Promise<{ updated: number; scaleLabel: string }> {
  await requireFondateur();

  const ids = [...new Set(input.exerciseIds.filter(Boolean))];
  if (ids.length === 0) {
    throw new Error("Sélectionnez au moins un exercice.");
  }

  const scale = await prisma.autonomyScale.findUnique({
    where: { id: input.autonomyScaleId },
  });
  if (!scale || !scale.active) {
    throw new Error("Niveau d'autonomie invalide.");
  }

  const existing = await prisma.exercise.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  if (existing.length !== ids.length) {
    throw new Error("Un ou plusieurs exercices sont introuvables.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.exercise.updateMany({
      where: { id: { in: ids } },
      data: { autonomyScaleId: scale.id },
    });

    // Retirer des parcours courants des patients dont le niveau ne correspond plus
    await tx.patientExercise.updateMany({
      where: {
        exerciseId: { in: ids },
        isCurrent: true,
        patient: { autonomyLevel: { not: scale.patientEnum } },
      },
      data: { isCurrent: false, currentStatus: "acquis" },
    });

    for (const id of ids) {
      await tx.auditLog.create({
        data: {
          action: "exercise.bulk_autonomy",
          entity: "Exercise",
          entityId: id,
        },
      });
    }
  });

  revalidateCatalog();
  return { updated: ids.length, scaleLabel: scale.label };
}

/** Suppression douce = archivage. Bloquée si transition active d'un publié. */
export async function deleteExercise(exerciseId: string) {
  await requireFondateur();

  const refs = await prisma.exercise.findMany({
    where: {
      status: "publie",
      id: { not: exerciseId },
      OR: [
        { onSuccessExerciseId: exerciseId },
        { onPartialExerciseId: exerciseId },
        { onFailureExerciseId: exerciseId },
      ],
    },
    select: { id: true, name: true },
  });
  if (refs.length > 0) {
    throw new Error(
      `Impossible de supprimer : référencé par ${refs.map((r) => r.name).join(", ")}. Corrigez ces transitions d'abord.`
    );
  }

  await prisma.exercise.update({
    where: { id: exerciseId },
    data: { status: "archive" },
  });
  // Retirer des parcours aidants courants
  await prisma.patientExercise.updateMany({
    where: { exerciseId, isCurrent: true },
    data: { isCurrent: false, currentStatus: "acquis" },
  });

  await prisma.auditLog.create({
    data: {
      action: "exercise.archive",
      entity: "Exercise",
      entityId: exerciseId,
    },
  });
  revalidateCatalog();
  redirect("/admin-produit/exercices");
}
