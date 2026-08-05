/**
 * Idempotent — 5 proches A–E (GIR) sur jean.martin@demo.fr.
 * Usage : npx tsx prisma/ensure-demo-gir-profiles.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  DEMO_AIDANT_EMAIL,
  DEMO_GIR_PROFILES,
  ensureDemoGirProfiles,
} from "./demo-gir-profiles";

const prisma = new PrismaClient();

async function main() {
  const result = await ensureDemoGirProfiles(prisma);
  console.log(
    `Profils GIR démo OK — ${result.profiles} proches sur ${result.caregiverEmail} (créés: ${result.created.length}, mis à jour: ${result.updated.length}).`
  );
  for (const p of DEMO_GIR_PROFILES) {
    console.log(
      `  ${p.code} · ${p.patientFirstName} ${p.patientLastName} (${p.autonomyLevel})`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
