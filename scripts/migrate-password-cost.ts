import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * One-shot: lower bcrypt cost for existing demo users (serverless login).
 * Safe to re-run — skips hashes already at the target cost.
 */
const ROUNDS = 8;
const DEMO_PASSWORD = "demo1234";

async function main() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, passwordHash: true },
    });

    let updated = 0;
    for (const user of users) {
      const rounds = bcrypt.getRounds(user.passwordHash);
      if (rounds <= ROUNDS) continue;
      const ok = await bcrypt.compare(DEMO_PASSWORD, user.passwordHash);
      if (!ok) continue;
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await bcrypt.hash(DEMO_PASSWORD, ROUNDS) },
      });
      updated += 1;
    }
    console.log(`Password cost migration: updated ${updated}/${users.length}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
