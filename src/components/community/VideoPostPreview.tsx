"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  buildRemotionProps,
  type RemotionInputProps,
} from "@/lib/community/video/remotion";
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

/** Aperçu vidéo Remotion in-house — corriger avant deploy / Semi publish */
export function VideoPostPreview({
  title,
  body,
  poseKey,
}: {
  title: string;
  body: string;
  poseKey?: string | null;
}) {
  const inputProps = buildRemotionProps({ title, body, poseKey });

  return (
    <div className="mx-auto w-full max-w-xs animate-fade-up">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Aperçu vidéo — TikTok / IG / Threads
      </p>
      <div className="overflow-hidden rounded-[1.75rem] border border-cream-dark bg-[#1a1816] p-1.5 shadow-[0_18px_40px_-18px_rgba(45,42,38,0.4)]">
        <div className="overflow-hidden rounded-[1.35rem]">
          <Player
            component={ProchePlusShort}
            inputProps={inputProps}
            durationInFrames={90}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={30}
            style={{ width: "100%", aspectRatio: "9 / 16" }}
            controls
            loop
          />
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-text-muted">
        Rendu fichier : <code className="text-[10px]">community:render-video</code>
      </p>
    </div>
  );
}
