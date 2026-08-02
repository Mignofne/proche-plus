import { prisma } from "@/lib/prisma";
import { ensureExerciseCatalog } from "../../../prisma/seed-exercises";

/** Idempotent — remplit le catalogue si vide (prod sans seed manuel). */
export async function ensureCatalogReady() {
  try {
    return await ensureExerciseCatalog(prisma);
  } catch (err) {
    // Ne jamais faire tomber une RSC (mode visite / build) si le sync échoue
    console.error("[ensureCatalogReady] sync failed (soft)", err);
    return { seeded: false, upserted: 0 };
  }
}
