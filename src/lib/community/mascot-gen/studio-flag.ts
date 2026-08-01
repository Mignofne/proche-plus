/**
 * Studio Ours — visible dans l’admin seulement si une clé OpenAI est
 * configurée, ou si MASCOT_GEN_STUDIO_ENABLED=true (override explicite / E2E).
 */

export function isStudioOursEnabled(): boolean {
  const flag = process.env.MASCOT_GEN_STUDIO_ENABLED?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  return Boolean(
    process.env.OPENAI_API_KEY?.trim() ||
      process.env.MASCOT_GEN_OPENAI_API_KEY?.trim()
  );
}
