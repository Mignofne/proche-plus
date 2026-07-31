/**
 * Historique Studio Ours — fichiers JSON locaux (Phase 1, hors Prisma).
 * Dossier : `.data/mascot-gen/` (gitignored).
 */

import { mkdir, readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import type { MascotGenerationRecord } from "./types";

const DIR = join(process.cwd(), ".data", "mascot-gen");

async function ensureDir() {
  await mkdir(DIR, { recursive: true });
}

export async function saveGeneration(
  record: Omit<MascotGenerationRecord, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  }
): Promise<MascotGenerationRecord> {
  await ensureDir();
  const full: MascotGenerationRecord = {
    ...record,
    id: record.id ?? randomUUID(),
    createdAt: record.createdAt ?? new Date().toISOString(),
  };
  const path = join(DIR, `${full.id}.json`);
  await writeFile(path, JSON.stringify(full, null, 2), "utf8");
  return full;
}

export async function listGenerations(
  limit = 20
): Promise<MascotGenerationRecord[]> {
  try {
    await ensureDir();
    const files = (await readdir(DIR)).filter((f) => f.endsWith(".json"));
    const records: MascotGenerationRecord[] = [];
    for (const file of files) {
      try {
        const raw = await readFile(join(DIR, file), "utf8");
        records.push(JSON.parse(raw) as MascotGenerationRecord);
      } catch {
        /* skip corrupt */
      }
    }
    return records
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getGeneration(
  id: string
): Promise<MascotGenerationRecord | null> {
  try {
    const raw = await readFile(join(DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as MascotGenerationRecord;
  } catch {
    return null;
  }
}
