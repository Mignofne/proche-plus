/**
 * Studio Ours — types Phase 1 (mock → remote/local).
 */

export type MascotGenProviderId = "mock" | "local" | "remote";

export type MascotGenStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "rejected"
  | "blocked";

export type SceneBrief = {
  situation: string;
  emotion: string;
  lieu: string;
  /** Thème référentiel exercices (8 thèmes) — optionnel */
  themeSlug?: string | null;
  emotionCustom?: string | null;
  lieuCustom?: string | null;
};

export type BuiltPrompt = {
  positive: string;
  negative: string;
  identityVersion: string;
  layers: {
    identity: string;
    scene: string;
    artDirection: string;
    composition: string;
    format: string;
    safeguards: string;
  };
};

export type GenRequest = {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  seed?: number;
  identityVersion: string;
  sceneId: string;
  poseKey?: string;
};

export type GenResult = {
  imageBytes?: Buffer;
  imageUrl?: string;
  mimeType: string;
  provider: MascotGenProviderId;
  meta: Record<string, unknown>;
};

export interface ImageGenerationProvider {
  readonly id: MascotGenProviderId;
  isAvailable(): Promise<boolean>;
  generate(req: GenRequest): Promise<GenResult>;
}

export type MascotGenerationRecord = {
  id: string;
  createdAt: string;
  provider: MascotGenProviderId;
  status: MascotGenStatus;
  identityVersion: string;
  brief: SceneBrief;
  promptPositive: string;
  promptNegative: string;
  width: number;
  height: number;
  seed?: number | null;
  imageUrl?: string | null;
  mimeType?: string | null;
  providerMeta?: Record<string, unknown>;
  blockReason?: string | null;
};
