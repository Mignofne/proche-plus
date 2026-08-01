"use server";

import { revalidatePath } from "next/cache";
import { requireFondateur } from "@/lib/community/auth-gate";
import {
  buildPromptFromBrief,
  DEFAULT_FORMAT,
  IDENTITY_VERSION,
  listGenerations,
  resolveMascotGenProvider,
  saveGeneration,
  validateSceneBrief,
  type MascotGenerationRecord,
  type SceneBrief,
} from "@/lib/community/mascot-gen";
import { historySafeImageUrl } from "@/lib/community/mascot-gen/image-store";

export type GenerateSceneResult =
  | {
      ok: true;
      record: MascotGenerationRecord;
      providerNote: string;
    }
  | {
      ok: false;
      message: string;
    };

export async function generateOursSceneAction(
  input: SceneBrief
): Promise<GenerateSceneResult> {
  await requireFondateur();

  const brief: SceneBrief = {
    situation: String(input.situation ?? "").trim(),
    emotion: String(input.emotion ?? "").trim(),
    lieu: String(input.lieu ?? "").trim(),
    themeSlug: input.themeSlug ? String(input.themeSlug) : null,
    emotionCustom: input.emotionCustom
      ? String(input.emotionCustom).trim()
      : null,
    lieuCustom: input.lieuCustom ? String(input.lieuCustom).trim() : null,
  };

  const validation = validateSceneBrief(brief);
  if (!validation.ok) {
    await saveGeneration({
      provider: "mock",
      status: "blocked",
      identityVersion: IDENTITY_VERSION,
      brief,
      promptPositive: "",
      promptNegative: "",
      width: DEFAULT_FORMAT.width,
      height: DEFAULT_FORMAT.height,
      blockReason: validation.message,
    });
    return { ok: false, message: validation.message };
  }

  const built = buildPromptFromBrief(brief);
  const provider = resolveMascotGenProvider();
  const sceneId = `studio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const available = await provider.isAvailable();
    if (!available) {
      return {
        ok: false,
        message: `Provider « ${provider.id} » indisponible. Passez à MASCOT_GEN_PROVIDER=mock.`,
      };
    }

    const result = await provider.generate({
      prompt: built.positive,
      negativePrompt: built.negative,
      width: DEFAULT_FORMAT.width,
      height: DEFAULT_FORMAT.height,
      identityVersion: built.identityVersion,
      sceneId,
    });

    const persistedUrl = historySafeImageUrl(result.imageUrl);
    const record = await saveGeneration({
      provider: result.provider,
      status: "succeeded",
      identityVersion: built.identityVersion,
      brief,
      promptPositive: built.positive,
      promptNegative: built.negative,
      width: DEFAULT_FORMAT.width,
      height: DEFAULT_FORMAT.height,
      // data: trop lourd pour l’historique fichier — le client garde result.imageUrl
      imageUrl: persistedUrl,
      mimeType: result.mimeType,
      providerMeta: result.meta,
    });

    // Toujours renvoyer l’URL affichable (data: / http / blob) au client
    const clientRecord: MascotGenerationRecord = {
      ...record,
      imageUrl: result.imageUrl ?? record.imageUrl,
    };

    revalidatePath("/admin-produit/community/studio-ours");

    const backend =
      typeof result.meta?.backend === "string" ? result.meta.backend : null;
    const providerNote =
      result.provider === "mock"
        ? result.imageUrl
          ? "Mode mock : l’image est la planche canon C-v3 (placeholder), pas votre scène."
          : "Mode mock : pas d’illustration de scène."
        : backend === "pollinations"
          ? "Scène générée (free tier). Pour coller au canon C-v3 : OPENAI_API_KEY + BLOB_READ_WRITE_TOKEN sur Vercel."
          : backend === "openai"
            ? "Scène générée via OpenAI à partir de la référence identité C-v3."
            : `Illustration générée via provider « ${result.provider} »${
                backend ? ` (${backend})` : ""
              }.`;

    return { ok: true, record: clientRecord, providerNote };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Échec de génération";
    const message =
      raw.length > 220
        ? `${raw.slice(0, 200)}…`
        : raw.includes("API key") || raw.includes("Authorization")
          ? "Génération impossible : clé API / autorisation provider."
          : raw;
    try {
      await saveGeneration({
        provider: provider.id,
        status: "failed",
        identityVersion: built.identityVersion,
        brief,
        promptPositive: built.positive,
        promptNegative: built.negative,
        width: DEFAULT_FORMAT.width,
        height: DEFAULT_FORMAT.height,
        blockReason: message,
      });
    } catch {
      // Historique best-effort — ne pas masquer l’erreur métier
    }
    return { ok: false, message };
  }
}

export async function getRecentOursGenerationsAction(
  limit = 12
): Promise<MascotGenerationRecord[]> {
  await requireFondateur();
  return listGenerations(limit);
}
