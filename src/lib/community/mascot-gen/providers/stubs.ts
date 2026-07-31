import type { GenRequest, GenResult, ImageGenerationProvider } from "../types";

/** Stub — plug remote API later (server secrets only). */
export class RemoteImageGenerationProvider implements ImageGenerationProvider {
  readonly id = "remote" as const;

  async isAvailable(): Promise<boolean> {
    return Boolean(process.env.MASCOT_GEN_REMOTE_URL);
  }

  async generate(_req: GenRequest): Promise<GenResult> {
    throw new Error(
      "Provider remote non configuré — définir MASCOT_GEN_REMOTE_URL ou utiliser MASCOT_GEN_PROVIDER=mock."
    );
  }
}

/** Stub — plug local Comfy/daemon later. */
export class LocalImageGenerationProvider implements ImageGenerationProvider {
  readonly id = "local" as const;

  async isAvailable(): Promise<boolean> {
    return Boolean(process.env.MASCOT_GEN_LOCAL_URL);
  }

  async generate(_req: GenRequest): Promise<GenResult> {
    throw new Error(
      "Provider local non configuré — démarrer le daemon ou utiliser MASCOT_GEN_PROVIDER=mock."
    );
  }
}
