import { z } from "zod";

export const mediaAssetSchema = z.object({
  label: z.string().min(1).max(160),
  url: z.string().url().or(z.string().startsWith("/")),
  mimeType: z.string().max(80).optional().nullable(),
  license: z.string().min(1, "Licence obligatoire"),
  source: z.string().min(1, "Source / provenance obligatoire"),
  provenance: z.string().max(500).optional().nullable(),
  isPosePack: z.boolean().optional(),
  poseKey: z.string().max(80).optional().nullable(),
});

export type MediaAssetInput = z.infer<typeof mediaAssetSchema>;

/** Stockage : Vercel Blob en non-dev ; data URL / public path en dev. */
export async function storeCommunityBinary(
  filename: string,
  data: Buffer | Blob,
  contentType: string
): Promise<{ url: string; deferred?: boolean }> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`community/${filename}`, data, {
      access: "public",
      contentType,
    });
    return { url: blob.url };
  }
  // Dev sans Blob : caller fournit déjà une URL publique (pose pack /uploads)
  console.info(
    "[community/media] BLOB_READ_WRITE_TOKEN absent — pas d’upload Blob (dev)."
  );
  return { url: "", deferred: true };
}
