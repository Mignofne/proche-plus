import { prisma } from "@/lib/prisma";
import { ensureExerciseCatalog } from "../../../prisma/seed-exercises";

/** Idempotent — remplit le catalogue si vide (prod sans seed manuel). */
export async function ensureCatalogReady() {
  return ensureExerciseCatalog(prisma);
}
