/**
 * Orchestration Remotion (AD-7) — preview Player in-app.
 * Ours = BearFace inline via poseKey (pas d’Img / SVG externe).
 */
export const REMOTION_COMPOSITION_ID = "ProchePlusShort";

export type RemotionInputProps = {
  title: string;
  body: string;
  /** Clé Community ou pose Mascot */
  poseKey: string;
  accent: "teal" | "sun" | "terracotta";
  /** @deprecated — conservé pour compat props anciennes ; ignoré par la composition */
  poseSrc?: string;
};

export function buildRemotionProps(params: {
  title: string;
  body: string;
  poseKey?: string | null;
  accent?: "teal" | "sun" | "terracotta";
}): RemotionInputProps {
  return {
    title: params.title,
    body: params.body,
    poseKey: params.poseKey || "encourage",
    accent: params.accent ?? "teal",
  };
}

export function getRenderInstructions(publicationId: string): string {
  return `Rendu hors route courte : npm run community:render-video -- --publicationId=${publicationId}`;
}
