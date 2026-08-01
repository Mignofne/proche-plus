/**
 * Historique Studio Ours — fichiers JSON locaux (Phase 1, hors Prisma).
 * Dossier : `.data/mascot-gen/` en local ; `/tmp/.data/mascot-gen/` sur Vercel
 * (filesystem serverless en lecture seule hors `/tmp`).
 */

import { mkdir, readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import type { MascotGenerationRecord } from "./types";

function resolveDataDir(): string {
  if (process.env.MASCOT_GEN_DATA_DIR) {
    return process.env.MASCOT_GEN_DATA_DIR;
  }
  // Vercel (et assimilés) : seul /tmp est writable.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return join("/tmp", ".data", "mascot-gen");
  }
  return join(process.cwd(), ".data", "mascot-gen");
}

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

function normalizeRecord(
  raw: MascotGenerationRecord
): MascotGenerationRecord | null {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.id !== "string" || !raw.id) return null;
  if (typeof raw.createdAt !== "string" || !raw.createdAt) return null;
  const situation =
    typeof raw.brief?.situation === "string" ? raw.brief.situation : "";
  return {
    ...raw,
    brief: {
      situation,
      emotion: typeof raw.brief?.emotion === "string" ? raw.brief.emotion : "",
      lieu: typeof raw.brief?.lieu === "string" ? raw.brief.lieu : "",
      themeSlug: raw.brief?.themeSlug ?? null,
      emotionCustom: raw.brief?.emotionCustom ?? null,
      lieuCustom: raw.brief?.lieuCustom ?? null,
    },
    promptPositive:
      typeof raw.promptPositive === "string" ? raw.promptPositive : "",
    promptNegative:
      typeof raw.promptNegative === "string" ? raw.promptNegative : "",
  };
}

export async function saveGeneration(
  record: Omit<MascotGenerationRecord, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  }
): Promise<MascotGenerationRecord> {
  const full: MascotGenerationRecord = {
    ...record,
    id: record.id ?? randomUUID(),
    createdAt: record.createdAt ?? new Date().toISOString(),
  };
  try {
    const dir = resolveDataDir();
    await ensureDir(dir);
    const path = join(dir, `${full.id}.json`);
    await writeFile(path, JSON.stringify(full, null, 2), "utf8");
  } catch (err) {
    // Ne jamais faire planter l’UI Studio Ours si le FS est indisponible
    // (ex. Vercel read-only, quota /tmp). L’enregistrement en mémoire reste
    // renvoyé au client pour la session courante.
    console.warn(
      "[mascot-gen] saveGeneration soft-fail:",
      err instanceof Error ? err.message : err
    );
  }
  return full;
}

export async function listGenerations(
  limit = 20
): Promise<MascotGenerationRecord[]> {
  try {
    const dir = resolveDataDir();
    // Lecture seule : pas de mkdir — absences → historique vide.
    const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
    const records: MascotGenerationRecord[] = [];
    for (const file of files) {
      try {
        const raw = await readFile(join(dir, file), "utf8");
        const parsed = normalizeRecord(
          JSON.parse(raw) as MascotGenerationRecord
        );
        if (parsed) records.push(parsed);
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
    const dir = resolveDataDir();
    const raw = await readFile(join(dir, `${id}.json`), "utf8");
    return normalizeRecord(JSON.parse(raw) as MascotGenerationRecord);
  } catch {
    return null;
  }
}
