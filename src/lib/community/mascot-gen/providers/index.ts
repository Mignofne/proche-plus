import type { ImageGenerationProvider, MascotGenProviderId } from "../types";
import { MockImageGenerationProvider } from "./mock";
import { RemoteImageGenerationProvider } from "./remote";
import { LocalImageGenerationProvider } from "./stubs";

/**
 * Résolution provider Studio Ours.
 * Défaut : **remote** (génère une vraie image — OpenAI si clé, sinon Pollinations free).
 * Forcer mock : MASCOT_GEN_PROVIDER=mock
 */
export function resolveMascotGenProvider(
  override?: MascotGenProviderId
): ImageGenerationProvider {
  const raw = (
    override ??
    process.env.MASCOT_GEN_PROVIDER ??
    "remote"
  ).toLowerCase();

  if (raw === "mock") return new MockImageGenerationProvider();
  if (raw === "local") return new LocalImageGenerationProvider();
  if (raw === "remote") return new RemoteImageGenerationProvider();
  console.warn(
    `[mascot-gen] MASCOT_GEN_PROVIDER inconnu « ${raw} » — fallback mock`
  );
  return new MockImageGenerationProvider();
}

export { MockImageGenerationProvider } from "./mock";
export { RemoteImageGenerationProvider } from "./remote";
export { LocalImageGenerationProvider } from "./stubs";
