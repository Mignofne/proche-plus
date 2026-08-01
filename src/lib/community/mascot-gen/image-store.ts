/**
 * Persistance des images générées Studio Ours.
 * Priorité : Vercel Blob → fichier /tmp (servi via API) → data URL (dev only).
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { storeCommunityBinary } from "@/lib/community/media";

function tmpImageDir(): string {
  if (process.env.MASCOT_GEN_DATA_DIR) {
    return join(process.env.MASCOT_GEN_DATA_DIR, "images");
  }
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return join("/tmp", ".data", "mascot-gen", "images");
  }
  return join(process.cwd(), ".data", "mascot-gen", "images");
}

export function tmpImagePath(sceneId: string, ext: string): string {
  return join(tmpImageDir(), `${sceneId}.${ext}`);
}

export async function persistGeneratedImage(
  bytes: Buffer,
  mimeType: string,
  sceneId: string
): Promise<string> {
  const ext = mimeType.includes("webp")
    ? "webp"
    : mimeType.includes("jpeg") || mimeType.includes("jpg")
      ? "jpg"
      : "png";
  const safeId = sceneId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "scene";
  const filename = `mascot-gen/${safeId}.${ext}`;

  const stored = await storeCommunityBinary(filename, bytes, mimeType);
  if (stored.url) return stored.url;

  try {
    const dir = tmpImageDir();
    await mkdir(dir, { recursive: true });
    const path = join(dir, `${safeId}.${ext}`);
    await writeFile(path, bytes);
    return `/api/community/mascot-gen/image/${encodeURIComponent(safeId)}.${ext}`;
  } catch (err) {
    console.warn(
      "[mascot-gen] persist tmp soft-fail:",
      err instanceof Error ? err.message : err
    );
    throw err instanceof Error
      ? err
      : new Error("Impossible de stocker l’image générée");
  }
}
