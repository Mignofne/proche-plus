"use client";

/**
 * Cadre visuel « ours en situation » (style Alan) :
 * texte haut colorisable + illustration scène pleine (pas de médaillon).
 */

import { useEffect, useState } from "react";
import {
  DEFAULT_SUBTITLE_COLOR,
  DEFAULT_TITLE_COLOR,
  normalizeHexColor,
  resolveSceneSrc,
  sceneImagePath,
} from "@/lib/community/scenes";
import type { CommunityFormatSpec } from "@/lib/community/formats";

const PASTEL_BACKGROUNDS = [
  "#F8E8DF", // pêche
  "#E8F2F0", // menthe douce
  "#F3EDE4", // cream
  "#EDE6F5", // lavande pâle
] as const;

const FALLBACK_SCENE = sceneImagePath("scene-communication");

export function SituationPostArt({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  sceneKey,
  imageSrc,
  poseKey,
  themeSlug,
  bearEnabled = true,
  format,
  accentIndex = 0,
}: {
  title?: string | null;
  subtitle?: string | null;
  titleColor?: string | null;
  subtitleColor?: string | null;
  sceneKey?: string | null;
  imageSrc?: string | null;
  poseKey?: string | null;
  themeSlug?: string | null;
  bearEnabled?: boolean;
  format: CommunityFormatSpec;
  accentIndex?: number;
}) {
  const titleHex = normalizeHexColor(titleColor, DEFAULT_TITLE_COLOR);
  const subtitleHex = normalizeHexColor(subtitleColor, DEFAULT_SUBTITLE_COLOR);
  const resolved = resolveSceneSrc({ sceneKey, imageSrc, poseKey, themeSlug });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [resolved]);
  const sceneSrc = failed ? FALLBACK_SCENE : resolved;
  const bg =
    PASTEL_BACKGROUNDS[accentIndex % PASTEL_BACKGROUNDS.length] ??
    PASTEL_BACKGROUNDS[0];

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden ${format.aspectClass}`}
      style={{
        aspectRatio: format.aspectRatio,
        background: bg,
        fontFamily: "Nunito, system-ui, sans-serif",
      }}
    >
      <div className="relative z-[2] flex shrink-0 flex-col items-center px-5 pb-2 pt-6 text-center sm:px-7 sm:pt-8">
        {title ? (
          <p
            className="max-w-[92%] text-[1.15rem] font-extrabold leading-snug tracking-tight sm:text-[1.35rem]"
            style={{ color: titleHex }}
          >
            {title}
          </p>
        ) : null}
        {subtitle ? (
          <p
            className="mt-2 max-w-[90%] text-[0.85rem] font-semibold leading-snug sm:text-[0.95rem]"
            style={{ color: subtitleHex }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="relative z-[1] flex min-h-0 flex-1 items-end justify-center px-3 pb-3 pt-1">
        {bearEnabled ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sceneSrc}
            alt="Ours Proche+ en situation"
            className="max-h-full w-auto max-w-[92%] object-contain object-bottom drop-shadow-[0_10px_20px_rgba(107,68,35,0.12)] animate-soft-pop"
            draggable={false}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="mb-8 text-sm text-text-muted">Sans ours</div>
        )}
      </div>
    </div>
  );
}
