/**
 * Idempotent — 5 profils aidant A–E (GIR) pour tests locaux et prod.
 * Usage : npx tsx prisma/ensure-demo-gir-profiles.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  DEMO_GIR_PASSWORD,
  DEMO_GIR_PROFILES,
  ensureDemoGirProfiles,
} from "./demo-gir-profiles";

const prisma = new PrismaClient();

async function main() {
  const result = await ensureDemoGirProfiles(prisma);
  console.log(
    `Profils GIR démo OK — ${result.profiles} niveaux (créés: ${result.created.length}, mis à jour: ${result.updated.length}).`
  );
  for (const p of DEMO_GIR_PROFILES) {
    const gir = p.autonomyLevel;
    console.log(
      `  ${p.code} · ${p.email} / ${DEMO_GIR_PASSWORD} → ${p.patientFirstName} ${p.patientLastName} (${gir})`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
