/**
 * Provider remote — génère une vraie illustration de scène.
 *
 * Priorité :
 * 1. MASCOT_GEN_REMOTE_URL — webhook custom (POST JSON)
 * 2. OPENAI_API_KEY / MASCOT_GEN_OPENAI_API_KEY — Images API + ref C-v3
 * 3. Pollinations (free, sans clé) — fallback pour débloquer Studio Ours
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { persistGeneratedImage } from "../image-store";
import { CANON_IMAGE_PATH } from "../constants";
import type { GenRequest, GenResult, ImageGenerationProvider } from "../types";

const OPENAI_EDITS = "https://api.openai.com/v1/images/edits";
const OPENAI_GENERATIONS = "https://api.openai.com/v1/images/generations";

function openaiKey(): string | undefined {
  return (
    process.env.MASCOT_GEN_OPENAI_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    undefined
  );
}

function openaiModel(): string {
  return process.env.MASCOT_GEN_OPENAI_MODEL?.trim() || "gpt-image-1";
}

/** Ref identité : vue de face (évite de renvoyer une planche turnaround). */
function referenceAssetPath(): string {
  const override = process.env.MASCOT_GEN_REFERENCE_PATH?.trim();
  if (override) {
    return override.startsWith("/")
      ? join(process.cwd(), "public", override.replace(/^\//, ""))
      : override;
  }
  return join(
    process.cwd(),
    "public",
    "community-assets",
    "ours-canon",
    "canon-front.png"
  );
}

function sizeFor(req: GenRequest): "1024x1024" | "1024x1536" | "1536x1024" {
  if (req.height > req.width) return "1024x1536";
  if (req.width > req.height) return "1536x1024";
  return "1024x1024";
}

/** Prompt court pour free tier URL-based (limite longueur). */
export function buildCompactScenePrompt(req: GenRequest): string {
  const sceneBlock =
    req.prompt.match(/SCENE:[\s\S]*?(?=\n\nART DIRECTION:|\n\nCOMPOSITION:|$)/)?.[0] ??
    req.prompt.slice(0, 500);
  return [
    "Single square illustration, NOT a character turnaround sheet.",
    "Proche+ adult plump brown bear mascot, plush fur, white forehead tuft,",
    "single brown Frida-like mono-brow, cream Mexican floral waistcoat, no bow tie.",
    "Same character as official Proche+ bear. Full body, seated or at table, never on floor.",
    "No humans — companions are other Proche+ bears only.",
    "Warm cream atmosphere, calm senior-friendly illustration.",
    sceneBlock.replace(/\s+/g, " ").trim(),
    "Avoid: Lotso, Winnie the Pooh, photoreal humans, character sheet collage,",
    (req.negativePrompt || "").replace(/\s+/g, " ").trim().slice(0, 400),
  ]
    .filter(Boolean)
    .join(" ");
}

async function generateViaOpenAI(req: GenRequest): Promise<GenResult> {
  const key = openaiKey();
  if (!key) throw new Error("OPENAI_API_KEY manquant");

  const started = Date.now();
  const model = openaiModel();
  const size = sizeFor(req);
  const editPrompt = [
    "Using the attached Proche+ bear as the ONLY character identity reference,",
    "create a NEW single-scene illustration (not a turnaround / model sheet).",
    "Keep the same face, body proportions, white forehead tuft, mono-brow, floral cream waistcoat.",
    "Place the bear in this scene:",
    req.prompt,
    "Negative constraints:",
    req.negativePrompt,
  ].join("\n");

  let b64: string | undefined;
  let mode: "edits" | "generations" = "edits";

  try {
    const refBytes = await readFile(referenceAssetPath());
    const form = new FormData();
    form.append("model", model);
    form.append("prompt", editPrompt.slice(0, 32000));
    form.append("size", size);
    form.append("n", "1");
    form.append(
      "image",
      new Blob([new Uint8Array(refBytes)], { type: "image/png" }),
      "canon-front.png"
    );
    // gpt-image models return b64 by default; dall-e may need response_format
    if (model.startsWith("dall-e")) {
      form.append("response_format", "b64_json");
    }

    const res = await fetch(OPENAI_EDITS, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: AbortSignal.timeout(55_000),
    });
    const json = (await res.json()) as {
      error?: { message?: string };
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    if (!res.ok) {
      throw new Error(json.error?.message || `OpenAI edits HTTP ${res.status}`);
    }
    b64 = json.data?.[0]?.b64_json;
    if (!b64 && json.data?.[0]?.url) {
      const imgRes = await fetch(json.data[0].url);
      if (!imgRes.ok) throw new Error("Téléchargement image OpenAI échoué");
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const mimeType = imgRes.headers.get("content-type") || "image/png";
      const imageUrl = await persistGeneratedImage(buf, mimeType, req.sceneId);
      return {
        imageUrl,
        mimeType,
        provider: "remote",
        meta: {
          backend: "openai",
          mode: "edits",
          model,
          size,
          durationMs: Date.now() - started,
          identityVersion: req.identityVersion,
          reference: CANON_IMAGE_PATH,
        },
      };
    }
  } catch (editErr) {
    // Fallback txt2img si edits indisponible (modèle / org / asset)
    mode = "generations";
    // dall-e-3 n’accepte que 1024x1024 / 1792x1024 / 1024x1792 — on reste en carré.
    const genModel = model.startsWith("dall-e") ? model : "dall-e-3";
    const genSize = "1024x1024" as const;
    const res = await fetch(OPENAI_GENERATIONS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: genModel,
        prompt: buildCompactScenePrompt(req).slice(0, 3900),
        size: genSize,
        n: 1,
        response_format: "b64_json",
      }),
      signal: AbortSignal.timeout(55_000),
    });
    const json = (await res.json()) as {
      error?: { message?: string };
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    if (!res.ok) {
      const editMsg =
        editErr instanceof Error ? editErr.message : "edits failed";
      throw new Error(
        json.error?.message ||
          `OpenAI generations HTTP ${res.status} (après échec edits: ${editMsg})`
      );
    }
    b64 = json.data?.[0]?.b64_json;
    if (!b64 && json.data?.[0]?.url) {
      const imgRes = await fetch(json.data[0].url);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const mimeType = imgRes.headers.get("content-type") || "image/png";
      const imageUrl = await persistGeneratedImage(buf, mimeType, req.sceneId);
      return {
        imageUrl,
        mimeType,
        provider: "remote",
        meta: {
          backend: "openai",
          mode,
          model: genModel,
          size: genSize,
          durationMs: Date.now() - started,
          identityVersion: req.identityVersion,
        },
      };
    }
  }

  if (!b64) throw new Error("OpenAI n’a renvoyé aucune image");
  const bytes = Buffer.from(b64, "base64");
  const mimeType = "image/png";
  const imageUrl = await persistGeneratedImage(bytes, mimeType, req.sceneId);
  return {
    imageUrl,
    mimeType,
    provider: "remote",
    meta: {
      backend: "openai",
      mode,
      model: mode === "generations" ? "dall-e-3" : model,
      size: mode === "generations" ? "1024x1024" : size,
      durationMs: Date.now() - started,
      identityVersion: req.identityVersion,
      reference: mode === "edits" ? "canon-front.png" : null,
    },
  };
}

async function generateViaWebhook(req: GenRequest): Promise<GenResult> {
  const endpoint = process.env.MASCOT_GEN_REMOTE_URL?.trim();
  if (!endpoint) throw new Error("MASCOT_GEN_REMOTE_URL manquant");

  const started = Date.now();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.MASCOT_GEN_REMOTE_SECRET?.trim();
  if (secret) headers.Authorization = `Bearer ${secret}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt: req.prompt,
      negativePrompt: req.negativePrompt,
      width: req.width,
      height: req.height,
      seed: req.seed,
      identityVersion: req.identityVersion,
      sceneId: req.sceneId,
      poseKey: req.poseKey,
      referencePath: CANON_IMAGE_PATH,
    }),
    signal: AbortSignal.timeout(55_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Webhook remote HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = (await res.json()) as {
      imageUrl?: string;
      image_base64?: string;
      mimeType?: string;
    };
    if (json.imageUrl) {
      return {
        imageUrl: json.imageUrl,
        mimeType: json.mimeType || "image/png",
        provider: "remote",
        meta: {
          backend: "webhook",
          durationMs: Date.now() - started,
          identityVersion: req.identityVersion,
        },
      };
    }
    if (json.image_base64) {
      const mimeType = json.mimeType || "image/png";
      const bytes = Buffer.from(json.image_base64, "base64");
      const imageUrl = await persistGeneratedImage(bytes, mimeType, req.sceneId);
      return {
        imageUrl,
        mimeType,
        provider: "remote",
        meta: {
          backend: "webhook",
          durationMs: Date.now() - started,
          identityVersion: req.identityVersion,
        },
      };
    }
    throw new Error("Webhook remote : réponse JSON sans imageUrl / image_base64");
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  const mimeType = contentType.startsWith("image/")
    ? contentType
    : "image/png";
  const imageUrl = await persistGeneratedImage(bytes, mimeType, req.sceneId);
  return {
    imageUrl,
    mimeType,
    provider: "remote",
    meta: {
      backend: "webhook",
      durationMs: Date.now() - started,
      identityVersion: req.identityVersion,
    },
  };
}

async function generateViaPollinations(req: GenRequest): Promise<GenResult> {
  const started = Date.now();
  const compact = buildCompactScenePrompt(req);
  const seed = req.seed ?? Math.floor(Math.random() * 1_000_000);
  const params = new URLSearchParams({
    width: String(Math.min(req.width, 1024)),
    height: String(Math.min(req.height, 1024)),
    nologo: "true",
    model: process.env.MASCOT_GEN_POLLINATIONS_MODEL?.trim() || "flux",
    seed: String(seed),
  });
  const promptPath = encodeURIComponent(compact.slice(0, 1200));
  const url = `https://image.pollinations.ai/prompt/${promptPath}?${params}`;

  const res = await fetch(url, {
    headers: { Accept: "image/*" },
    signal: AbortSignal.timeout(55_000),
  });
  if (!res.ok) {
    throw new Error(`Pollinations HTTP ${res.status}`);
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.byteLength < 1000) {
    throw new Error("Pollinations a renvoyé une image vide ou invalide");
  }
  const mimeType = res.headers.get("content-type") || "image/jpeg";
  const imageUrl = await persistGeneratedImage(bytes, mimeType, req.sceneId);
  return {
    imageUrl,
    mimeType,
    provider: "remote",
    meta: {
      backend: "pollinations",
      model: params.get("model"),
      seed,
      sourceUrl: url,
      durationMs: Date.now() - started,
      identityVersion: req.identityVersion,
      note: "Free tier — identité C-v3 approximative ; OPENAI_API_KEY améliore la fidélité.",
    },
  };
}

export class RemoteImageGenerationProvider implements ImageGenerationProvider {
  readonly id = "remote" as const;

  async isAvailable(): Promise<boolean> {
    // Toujours dispo : Pollinations free en dernier recours.
    return true;
  }

  async generate(req: GenRequest): Promise<GenResult> {
    if (process.env.MASCOT_GEN_REMOTE_URL?.trim()) {
      return generateViaWebhook(req);
    }
    if (openaiKey()) {
      return generateViaOpenAI(req);
    }
    return generateViaPollinations(req);
  }
}
