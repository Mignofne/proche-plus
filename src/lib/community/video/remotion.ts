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
export const REMOTION_STORYBOARD_ID = "ProchePlusStoryboard";
export const REMOTION_STORYBOARD_FACEBOOK_ID = "ProchePlusStoryboardFacebook";

/** Frames par beat storyboard (30 fps → 2 s) */
export const DEFAULT_STORYBOARD_BEAT_FRAMES = 60;

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

/** Un plan d’une vidéo multi-stills (Studio Ours → Remotion) */
export type RemotionStoryboardBeat = {
  /** Chemin sous `public/` (ex. `/community-assets/ours-canon/generations/…`) */
  sceneSrc: string;
  title?: string;
  body?: string;
  durationInFrames?: number;
};

export type RemotionStoryboardProps = {
  beats: RemotionStoryboardBeat[];
  accent?: "teal" | "sun" | "terracotta";
  titleColor?: string;
  subtitleColor?: string;
};

export function storyboardDurationInFrames(
  beats: RemotionStoryboardBeat[]
): number {
  if (!beats.length) return DEFAULT_STORYBOARD_BEAT_FRAMES;
  return beats.reduce(
    (sum, b) => sum + (b.durationInFrames ?? DEFAULT_STORYBOARD_BEAT_FRAMES),
    0
  );
}

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

/** Instructions rendu storyboard Studio Ours (props JSON local) */
export function getStoryboardRenderInstructions(propsPath: string): string {
  return `npm run community:render-video -- --composition=${REMOTION_STORYBOARD_ID} --props=${propsPath}`;
}

export const REMOTION_FLIPBOOK_ID = "ProchePlusFlipbook";
export const REMOTION_FLIPBOOK_FACEBOOK_ID = "ProchePlusFlipbookFacebook";

/** Frames Remotion par image flipbook (30 fps → ~6–7,5 ips perçues à 4–5) */
export const DEFAULT_FLIPBOOK_HOLD = 5;

/**
 * Ours animé — suite de keyframes (même scène, poses successives).
 * `loops` rejoue la séquence ; un hold final est ajouté hors loops dans Root.
 */
export type RemotionFlipbookProps = {
  frames: string[];
  holdFrames?: number;
  title?: string;
  body?: string;
  accent?: "teal" | "sun" | "terracotta";
  titleColor?: string;
  subtitleColor?: string;
  /** Nombre de passages sur la séquence de frames (défaut 2) */
  loops?: number;
  /** Frames supplémentaires figées sur la dernière pose */
  endHoldFrames?: number;
};

export function flipbookDurationInFrames(
  props: Pick<
    RemotionFlipbookProps,
    "frames" | "holdFrames" | "loops" | "endHoldFrames"
  >
): number {
  const hold = props.holdFrames ?? DEFAULT_FLIPBOOK_HOLD;
  const loops = Math.max(1, props.loops ?? 2);
  const n = Math.max(1, props.frames.length);
  const endHold = props.endHoldFrames ?? 30;
  return n * hold * loops + endHold;
}
