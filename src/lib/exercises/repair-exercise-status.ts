import type { PrismaClient } from "@prisma/client";

const globalRepair = globalThis as unknown as {
  __exerciseStatusRepaired?: boolean;
};

/**
 * Si une preview a écrit le statut `a_valider` (enum pas encore dans le
 * client Prisma de prod), les `findMany` Exercise plantent à la désérialisation.
 * On normalise d'abord via SQL brut — safe même si la valeur n'existe pas.
 */
export async function repairIncompatibleExerciseStatuses(
  prisma: PrismaClient
): Promise<number> {
  if (globalRepair.__exerciseStatusRepaired) return 0;
  globalRepair.__exerciseStatusRepaired = true;

  try {
    // Postgres : comparer via text pour ne pas dépendre du client Prisma
    const updated = await prisma.$executeRawUnsafe(`
      UPDATE "Exercise"
      SET status = 'brouillon'
      WHERE status::text = 'a_valider'
    `);
    return typeof updated === "number" ? updated : 0;
  } catch {
    // SQLite / enum absent / permission — ignorer
    return 0;
  }
}
