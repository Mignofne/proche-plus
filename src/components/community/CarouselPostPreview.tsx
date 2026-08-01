"use client";

import { useCallback, useState } from "react";
import { COMMUNITY_BRAND } from "@/lib/community/ui-tokens";
import {
  formatForChannelKind,
  channelLabels,
  resolvePrimaryChannel,
  type CommunityFormatSpec,
} from "@/lib/community/formats";
import { normalizeHexColor } from "@/lib/community/scenes";
import type { CommunitySocialChannel } from "@prisma/client";
import { SituationPostArt } from "./SituationPostArt";

export type CarouselSlide = {
  overlayText: string;
  /** Sous-titre optionnel sur la slide */
  subtitle?: string | null;
  poseKey?: string | null;
  /** @deprecated préférez poseKey / sceneKey */
  poseSrc?: string | null;
  /** Image scène explicite */
  imageSrc?: string | null;
  sceneKey?: string | null;
  bearEnabled?: boolean;
  accent?: "teal" | "sun" | "terracotta";
  /** Couleur du texte overlay (titre) */
  textColor?: string | null;
  subtitleColor?: string | null;
};

const ACCENT_INDEX: Record<NonNullable<CarouselSlide["accent"]>, number> = {
  teal: 1,
  sun: 0,
  terracotta: 2,
};

/** Aperçu carrousel — scène en situation + couleurs par slide + format réseau */
export function CarouselPostPreview({
  body,
  title,
  slides,
  channel,
  channels,
  channelLabel,
  titleColor,
  subtitleColor,
  themeSlug,
  format: formatOverride,
}: {
  body: string;
  title?: string | null;
  slides: CarouselSlide[];
  channel?: CommunitySocialChannel | string | null;
  channels?: Array<CommunitySocialChannel | string>;
  channelLabel?: string;
  titleColor?: string | null;
  subtitleColor?: string | null;
  themeSlug?: string | null;
  format?: CommunityFormatSpec;
}) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index] ?? slides[0];
  const primary = resolvePrimaryChannel([channel, ...(channels ?? [])]);
  const format = formatOverride ?? formatForChannelKind(primary, "carrousel");
  const label =
    channelLabel ??
    channelLabels(
      (channels?.length
        ? channels
        : [primary]) as CommunitySocialChannel[]
    );

  const go = useCallback(
    (dir: -1 | 1) => {
      if (total < 2) return;
      setIndex((i) => (i + dir + total) % total);
    },
    [total]
  );

  if (!slide) {
    return <p className="text-sm text-text-muted">Aucun slide carrousel.</p>;
  }

  const slideTitleColor = slide.textColor || titleColor;
  const slideSubtitleColor = slide.subtitleColor || subtitleColor;

  return (
    <div className="mx-auto w-full max-w-sm animate-fade-up">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Aperçu carrousel — {label} · {format.label}
      </p>

      <div
        className="overflow-hidden rounded-[1.75rem] border border-cream-dark bg-white shadow-[0_18px_40px_-18px_rgba(45,42,38,0.35)]"
        style={{ fontFamily: "Nunito, system-ui, sans-serif" }}
      >
        <div className="flex items-center justify-center bg-[#1a1816] px-4 py-1.5">
          <div className="h-1 w-16 rounded-full bg-white/25" aria-hidden />
        </div>

        <div className="flex items-center gap-2.5 border-b border-cream-dark/80 px-3.5 py-2.5">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
            style={{
              background: `linear-gradient(145deg, ${COMMUNITY_BRAND.teal}, ${COMMUNITY_BRAND.tealDark})`,
            }}
          >
            P+
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-text">procheplus</p>
            <p className="text-[11px] text-text-muted">
              Carrousel · {index + 1}/{total}
              {primary === "facebook" ? " · Facebook" : ""}
            </p>
          </div>
        </div>

        <div className="relative">
          <div key={index}>
            <SituationPostArt
              title={slide.overlayText}
              subtitle={slide.subtitle}
              titleColor={slideTitleColor}
              subtitleColor={slideSubtitleColor}
              sceneKey={slide.sceneKey}
              imageSrc={slide.imageSrc}
              poseKey={slide.poseKey}
              themeSlug={themeSlug}
              bearEnabled={slide.bearEnabled !== false}
              format={format}
              accentIndex={ACCENT_INDEX[slide.accent ?? "teal"]}
            />
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text shadow-md touch-target"
                aria-label="Slide précédent"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text shadow-md touch-target"
                aria-label="Slide suivant"
              >
                ›
              </button>
            </>
          ) : null}

          {total > 1 ? (
            <div className="absolute left-3 right-3 top-3 z-10 flex gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="h-0.5 flex-1 rounded-full transition-opacity"
                  style={{
                    background:
                      i === index
                        ? "rgba(45,42,38,0.85)"
                        : "rgba(45,42,38,0.25)",
                  }}
                  aria-label={`Aller au slide ${i + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-2.5 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-text" aria-hidden>
              <CarouselIcon kind="heart" />
              <CarouselIcon kind="comment" />
              <CarouselIcon kind="share" />
            </div>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background:
                      i === index ? COMMUNITY_BRAND.teal : COMMUNITY_BRAND.creamDark,
                  }}
                />
              ))}
            </div>
          </div>
          {title ? (
            <p
              className="text-sm font-bold"
              style={{
                color: normalizeHexColor(titleColor, COMMUNITY_BRAND.tealDark),
              }}
            >
              {title}
            </p>
          ) : null}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
            <span className="font-extrabold">procheplus</span> {body}
          </p>
          <p className="text-xs text-text-muted">
            #ProchePlus · carrousel · aperçu fondateur
          </p>
        </div>
      </div>
    </div>
  );
}

function CarouselIcon({ kind }: { kind: "heart" | "comment" | "share" }) {
  if (kind === "heart") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "comment") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 18.5V7.8A2.8 2.8 0 0 1 7.8 5h8.4A2.8 2.8 0 0 1 19 7.8v6.4A2.8 2.8 0 0 1 16.2 17H9l-4 1.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12v6.2A1.8 1.8 0 0 0 6.8 20h10.4A1.8 1.8 0 0 0 19 18.2V12M12 15V4m0 0 4 4M12 4 8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
