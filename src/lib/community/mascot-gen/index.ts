/**
 * Studio Ours — génération illustrée (Phase 1 mock).
 * Domaine Community uniquement — pas d’import clinique.
 */

export * from "./types";
export * from "./constants";
export {
  SAFEGUARD_LIST_FR,
  SAFEGUARD_BLOCK_MESSAGE_FR,
  validateMascotGenText,
  validateSceneBrief,
  canonicalNegativePrompt,
} from "./safeguards";
export { buildPromptFromBrief } from "./prompt-builder";
export {
  resolveMascotGenProvider,
  MockImageGenerationProvider,
  LocalImageGenerationProvider,
  RemoteImageGenerationProvider,
} from "./providers";
export { saveGeneration, listGenerations, getGeneration } from "./history";
