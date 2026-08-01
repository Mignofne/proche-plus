import { prisma } from "@/lib/prisma";
import { ensureExerciseCatalog } from "../../../prisma/seed-exercises";
import { repairIncompatibleExerciseStatuses } from "./repair-exercise-status";

/** Idempotent — remplit le catalogue si vide (prod sans seed manuel). */
export async function ensureCatalogReady() {
  try {
    await repairIncompatibleExerciseStatuses(prisma);
    return await ensureExerciseCatalog(prisma);
  } catch (err) {
    // Ne jamais faire tomber une RSC (mode visite) si le sync catalogue échoue
    console.error("[ensureCatalogReady] sync failed (soft)", err);
    return { seeded: false, upserted: 0 };
  }
}
