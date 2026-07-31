import type { ImageGenerationProvider, MascotGenProviderId } from "../types";
import { MockImageGenerationProvider } from "./mock";
import {
  LocalImageGenerationProvider,
  RemoteImageGenerationProvider,
} from "./stubs";

export function resolveMascotGenProvider(
  override?: MascotGenProviderId
): ImageGenerationProvider {
  const raw = (
    override ??
    process.env.MASCOT_GEN_PROVIDER ??
    "mock"
  ).toLowerCase();

  if (raw === "remote") return new RemoteImageGenerationProvider();
  if (raw === "local") return new LocalImageGenerationProvider();
  return new MockImageGenerationProvider();
}

export { MockImageGenerationProvider } from "./mock";
export {
  LocalImageGenerationProvider,
  RemoteImageGenerationProvider,
} from "./stubs";
