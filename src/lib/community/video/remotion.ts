/**
 * Orchestration Remotion (AD-7) — preview Player in-app.
 * Ours en situation (scène référentiel) + couleurs texte.
 */
import {
  DEFAULT_SUBTITLE_COLOR,
  DEFAULT_TITLE_COLOR,
  normalizeHexColor,
  resolveSceneSrc,
} from "@/lib/community/scenes";
import {
  formatForChannelKind,
  type CommunityFormatSpec,
} from "@/lib/community/formats";
import type { CommunitySocialChannel } from "@prisma/client";

export const REMOTION_COMPOSITION_ID = "ProchePlusShort";

export type RemotionInputProps = {
  title: string;
  body: string;
  /** Clé Community ou pose Mascot (fallback scène) */
  poseKey: string;
  accent: "teal" | "sun" | "terracotta";
  titleColor?: string;
  subtitleColor?: string;
  sceneSrc?: string;
  bearEnabled?: boolean;
  /** @deprecated — conservé pour compat props anciennes */
  poseSrc?: string;
};

export function buildRemotionProps(params: {
  title: string;
  body: string;
  poseKey?: string | null;
  accent?: "teal" | "sun" | "terracotta";
  titleColor?: string | null;
  subtitleColor?: string | null;
  sceneKey?: string | null;
  imageSrc?: string | null;
  themeSlug?: string | null;
  bearEnabled?: boolean;
}): RemotionInputProps {
  return {
    title: params.title,
    body: params.body,
    poseKey: params.poseKey || "encourage",
    accent: params.accent ?? "teal",
    titleColor: normalizeHexColor(params.titleColor, DEFAULT_TITLE_COLOR),
    subtitleColor: normalizeHexColor(
      params.subtitleColor,
      DEFAULT_SUBTITLE_COLOR
    ),
    sceneSrc: resolveSceneSrc({
      sceneKey: params.sceneKey,
      imageSrc: params.imageSrc,
      poseKey: params.poseKey,
      themeSlug: params.themeSlug,
    }),
    bearEnabled: params.bearEnabled !== false,
  };
}

export function videoFormatForChannel(
  channel?: CommunitySocialChannel | string | null
): CommunityFormatSpec {
  return formatForChannelKind(channel, "video");
}

export function getRenderInstructions(publicationId: string): string {
  return `Rendu hors route courte : npm run community:render-video -- --publicationId=${publicationId}`;
}
