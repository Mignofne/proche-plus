/**
 * Persistance des images générées Studio Ours.
 *
 * Sur Vercel, `/tmp` n’est PAS partagé entre instances — une URL
 * `/api/community/mascot-gen/image/...` casse dès le rendu suivant.
 *
 * Priorité :
 * 1. Vercel Blob (durable, recommandé en prod)
 * 2. URL publique de secours (ex. Pollinations)
 * 3. data URL (affichage session ; historique sans data: pour rester léger)
 * 4. `/tmp` + API — uniquement hors Vercel (dev local)
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { storeCommunityBinary } from "@/lib/community/media";

function tmpImageDir(): string {
  if (process.env.MASCOT_GEN_DATA_DIR) {
    return join(process.env.MASCOT_GEN_DATA_DIR, "images");
  }
  return join(process.cwd(), ".data", "mascot-gen", "images");
}

export function tmpImagePath(sceneId: string, ext: string): string {
  return join(tmpImageDir(), `${sceneId}.${ext}`);
}

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function extForMime(mimeType: string): "webp" | "jpg" | "png" {
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  return "png";
}

/** URL stockable en historique (pas de data: volumineux). */
export function historySafeImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("data:")) return null;
  return imageUrl;
}

export async function persistGeneratedImage(
  bytes: Buffer,
  mimeType: string,
  sceneId: string,
  options?: { fallbackPublicUrl?: string }
): Promise<string> {
  const ext = extForMime(mimeType);
  const safeId = sceneId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "scene";
  const filename = `mascot-gen/${safeId}.${ext}`;

  const stored = await storeCommunityBinary(filename, bytes, mimeType);
  if (stored.url) return stored.url;

  // URL publique externe (Pollinations, etc.) — durable sans Blob
  if (options?.fallbackPublicUrl?.startsWith("http")) {
    return options.fallbackPublicUrl;
  }

  // Vercel sans Blob : data URL pour que le client voie l’image tout de suite
  if (isVercelRuntime()) {
    console.warn(
      "[mascot-gen] BLOB_READ_WRITE_TOKEN absent sur Vercel — data URL (ajoutez le token Blob pour du durable)."
    );
    return `data:${mimeType};base64,${bytes.toString("base64")}`;
  }

  // Dev local : fichier + route API
  const dir = tmpImageDir();
  await mkdir(dir, { recursive: true });
  const path = join(dir, `${safeId}.${ext}`);
  await writeFile(path, bytes);
  return `/api/community/mascot-gen/image/${encodeURIComponent(safeId)}.${ext}`;
}
