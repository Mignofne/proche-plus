/**
 * Synchronise le catalogue depuis docs/referentiel/Referentiel_Exercices.csv
 * (idempotent — met à jour le contenu sans supprimer les patients).
 */
import { PrismaClient } from "@prisma/client";
import { ensureExerciseCatalog } from "./seed-exercises";

const prisma = new PrismaClient();

async function main() {
  const result = await ensureExerciseCatalog(prisma);
  console.log(
    `Catalogue synchronisé — ${result.upserted} exercice(s) depuis le référentiel CSV.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
