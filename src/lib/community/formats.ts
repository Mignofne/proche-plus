/**
 * Formats d’aperçu / rendu Community selon canal × kind.
 * Le canal principal (premier cible / canal coché) pilote le ratio.
 */

import type {
  CommunityPublicationKind,
  CommunitySocialChannel,
} from "@prisma/client";

export type CommunityFormatSpec = {
  key: string;
  width: number;
  height: number;
  /** CSS aspect-ratio value, e.g. "1 / 1" */
  aspectRatio: string;
  /** Tailwind-friendly aspect class when available */
  aspectClass: string;
  label: string;
};

const FORMATS = {
  "ig-square": {
    key: "ig-square",
    width: 1080,
    height: 1080,
    aspectRatio: "1 / 1",
    aspectClass: "aspect-square",
    label: "Carré 1:1",
  },
  "fb-landscape": {
    key: "fb-landscape",
    width: 1200,
    height: 630,
    aspectRatio: "1200 / 630",
    aspectClass: "aspect-[1200/630]",
    label: "Facebook fil 1.91:1",
  },
  "video-9-16": {
    key: "video-9-16",
    width: 1080,
    height: 1920,
    aspectRatio: "9 / 16",
    aspectClass: "aspect-[9/16]",
    label: "Vertical 9:16",
  },
  "video-16-9": {
    key: "video-16-9",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    aspectClass: "aspect-video",
    label: "Paysage 16:9",
  },
} as const satisfies Record<string, CommunityFormatSpec>;

export type CommunityFormatKey = keyof typeof FORMATS;

const CHANNEL_LABELS: Record<CommunitySocialChannel, string> = {
  instagram: "Instagram",
  threads: "Threads",
  tiktok: "TikTok",
  facebook: "Facebook",
};

/** Format par défaut si canal inconnu / absent */
const DEFAULT_STILL = FORMATS["ig-square"];
const DEFAULT_VIDEO = FORMATS["video-9-16"];

export function channelLabel(channel: CommunitySocialChannel): string {
  return CHANNEL_LABELS[channel] ?? channel;
}

export function channelLabels(channels: CommunitySocialChannel[]): string {
  if (channels.length === 0) return "Instagram / Threads";
  return [...new Set(channels.map(channelLabel))].join(" / ");
}

export function resolvePrimaryChannel(
  channels: Array<CommunitySocialChannel | string | null | undefined>
): CommunitySocialChannel {
  for (const ch of channels) {
    if (
      ch === "instagram" ||
      ch === "threads" ||
      ch === "tiktok" ||
      ch === "facebook"
    ) {
      return ch;
    }
  }
  return "instagram";
}

export function formatForChannelKind(
  channel: CommunitySocialChannel | string | null | undefined,
  kind: CommunityPublicationKind | string
): CommunityFormatSpec {
  const ch = resolvePrimaryChannel([channel]);

  if (kind === "video") {
    if (ch === "facebook") return FORMATS["video-16-9"];
    return FORMATS["video-9-16"];
  }

  if (kind === "classique" && ch === "facebook") {
    return FORMATS["fb-landscape"];
  }

  // carrousel Facebook + IG/Threads classique/carrousel → carré
  return DEFAULT_STILL;
}

export function allFormatKeys(): CommunityFormatKey[] {
  return Object.keys(FORMATS) as CommunityFormatKey[];
}

export { FORMATS, DEFAULT_STILL, DEFAULT_VIDEO };
