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
  const sceneId = `studio-${Date.now()}`;

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

    const record = await saveGeneration({
      provider: result.provider,
      status: "succeeded",
      identityVersion: built.identityVersion,
      brief,
      promptPositive: built.positive,
      promptNegative: built.negative,
      width: DEFAULT_FORMAT.width,
      height: DEFAULT_FORMAT.height,
      imageUrl: result.imageUrl ?? null,
      mimeType: result.mimeType,
      providerMeta: result.meta,
    });

    revalidatePath("/admin-produit/community/studio-ours");

    const providerNote =
      result.provider === "mock"
        ? "Mock : prompt verrouillé enregistré. Local/Remote rendront l’image réelle plus tard. Placeholder = sheet C-v3."
        : `Généré via provider « ${result.provider} ».`;

    return { ok: true, record, providerNote };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Échec de génération";
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
