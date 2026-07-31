/**
 * Remplit le catalogue exercices si la base prod est vide
 * (db push crée les tables, mais le seed manuel n'est pas toujours fait).
 */
import { PrismaClient } from "@prisma/client";
import { ensureExerciseCatalog } from "./seed-exercises";

const prisma = new PrismaClient();

async function main() {
  const result = await ensureExerciseCatalog(prisma);
  if (result.seeded) {
    console.log("Catalogue exercices initialisé (thèmes + matrice Fauteuil).");
  } else {
    console.log("Catalogue déjà présent — rien à faire.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
