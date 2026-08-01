"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  buildRemotionProps,
  videoFormatForChannel,
  type RemotionInputProps,
} from "@/lib/community/video/remotion";
import { channelLabels, resolvePrimaryChannel } from "@/lib/community/formats";
import type { CommunitySocialChannel } from "@prisma/client";
import { ProchePlusShort } from "@/remotion/ProchePlusShort";

const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[9/16] w-full items-center justify-center rounded-2xl bg-cream-dark/60 text-sm text-text-muted">
        Chargement preview vidéo…
      </div>
    ),
  }
) as ComponentType<{
  component: typeof ProchePlusShort;
  inputProps: RemotionInputProps;
  durationInFrames: number;
  compositionWidth: number;
  compositionHeight: number;
  fps: number;
  style?: React.CSSProperties;
  controls?: boolean;
  loop?: boolean;
}>;

/** Aperçu vidéo Remotion — format adapté au réseau + ours en situation */
export function VideoPostPreview({
  title,
  body,
  poseKey,
  channel,
  channels,
  titleColor,
  subtitleColor,
  sceneKey,
  themeSlug,
  bearEnabled = true,
}: {
  title: string;
  body: string;
  poseKey?: string | null;
  channel?: CommunitySocialChannel | string | null;
  channels?: Array<CommunitySocialChannel | string>;
  titleColor?: string | null;
  subtitleColor?: string | null;
  sceneKey?: string | null;
  themeSlug?: string | null;
  bearEnabled?: boolean;
}) {
  const primary = resolvePrimaryChannel([channel, ...(channels ?? [])]);
  const format = videoFormatForChannel(primary);
  const label = channelLabels(
    (channels?.length ? channels : [primary]) as CommunitySocialChannel[]
  );
  const inputProps = buildRemotionProps({
    title,
    body,
    poseKey,
    titleColor,
    subtitleColor,
    sceneKey,
    themeSlug,
    bearEnabled,
  });

  const maxW = format.key === "video-16-9" ? "max-w-lg" : "max-w-xs";
  const loadingAspect =
    format.key === "video-16-9" ? "aspect-video" : "aspect-[9/16]";

  return (
    <div className={`mx-auto w-full ${maxW} animate-fade-up`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Aperçu vidéo — {label} · {format.label}
      </p>
      <div className="overflow-hidden rounded-[1.75rem] border border-cream-dark bg-[#1a1816] p-1.5 shadow-[0_18px_40px_-18px_rgba(45,42,38,0.4)]">
        <div className={`overflow-hidden rounded-[1.35rem] ${loadingAspect}`}>
          <Player
            component={ProchePlusShort}
            inputProps={inputProps}
            durationInFrames={90}
            compositionWidth={format.width}
            compositionHeight={format.height}
            fps={30}
            style={{ width: "100%", aspectRatio: format.aspectRatio }}
            controls
            loop
          />
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-text-muted">
        Rendu fichier :{" "}
        <code className="text-[10px]">
          {primary === "facebook"
            ? "community:render-video (ProchePlusShortFacebook)"
            : "community:render-video"}
        </code>
      </p>
    </div>
  );
}
