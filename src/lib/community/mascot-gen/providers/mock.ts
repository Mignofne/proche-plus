import type { GenRequest, GenResult, ImageGenerationProvider } from "../types";
import { CANON_IMAGE_PATH } from "../constants";

/**
 * Mock provider — compose/persist prompt only; returns C-v3 as visual placeholder.
 * Local/Remote will replace imageUrl with a real render later.
 */
export class MockImageGenerationProvider implements ImageGenerationProvider {
  readonly id = "mock" as const;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async generate(req: GenRequest): Promise<GenResult> {
    const started = Date.now();
    return {
      imageUrl: CANON_IMAGE_PATH,
      mimeType: "image/png",
      provider: "mock",
      meta: {
        note: "Mock only — prompt composed and stored; Local/Remote will render for real.",
        identityVersion: req.identityVersion,
        sceneId: req.sceneId,
        seed: req.seed ?? null,
        width: req.width,
        height: req.height,
        durationMs: Date.now() - started,
        placeholder: CANON_IMAGE_PATH,
      },
    };
  }
}
