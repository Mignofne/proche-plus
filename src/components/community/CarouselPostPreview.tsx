"use client";

import { useCallback, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { toMascotPose } from "@/components/mascot/BearFace";
import { COMMUNITY_BRAND } from "@/lib/community/ui-tokens";

export type CarouselSlide = {
  overlayText: string;
  /** Clé Community ou pose Mascot */
  poseKey?: string | null;
  /** @deprecated préférez poseKey */
  poseSrc?: string | null;
  bearEnabled?: boolean;
  accent?: "teal" | "sun" | "terracotta";
};

const ACCENT = {
  teal: COMMUNITY_BRAND.teal,
  sun: COMMUNITY_BRAND.sun,
  terracotta: COMMUNITY_BRAND.terracotta,
} as const;

/** Aperçu carrousel — mascotte produit + texte overlay par slide */
export function CarouselPostPreview({
  body,
  title,
  slides,
  channelLabel = "Instagram / Threads",
}: {
  body: string;
  title?: string | null;
  slides: CarouselSlide[];
  channelLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index] ?? slides[0];
  const accent = ACCENT[slide?.accent ?? "teal"];
  const mascotPose = toMascotPose(slide?.poseKey);

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

  return (
    <div className="mx-auto w-full max-w-sm animate-fade-up">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Aperçu carrousel — {channelLabel}
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
            </p>
          </div>
        </div>

        <div
          className="relative aspect-square overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse 75% 55% at 82% 14%, ${accent}33, transparent 55%),
              radial-gradient(ellipse 65% 45% at 10% 90%, rgba(245,200,66,0.16), transparent 50%),
              linear-gradient(165deg, ${COMMUNITY_BRAND.cream} 0%, #F3EDE4 45%, ${COMMUNITY_BRAND.creamDark} 100%)
            `,
          }}
        >
          <div
            key={index}
            className="absolute inset-0 flex animate-soft-pop items-center justify-center"
          >
            {slide.bearEnabled !== false ? (
              <Mascot
                pose={mascotPose}
                size="xl"
                className="relative z-[1] -translate-y-4 drop-shadow-[0_12px_24px_rgba(107,68,35,0.18)]"
              />
            ) : null}

            <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[#2D2A26]/80 via-[#2D2A26]/35 to-transparent px-5 pb-5 pt-20">
              <p
                className="text-[1.15rem] font-extrabold leading-snug tracking-tight text-white"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.25)" }}
              >
                {slide.overlayText}
              </p>
            </div>
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
                    background: i === index ? "#fff" : "rgba(255,255,255,0.4)",
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
            <p className="text-sm font-bold text-teal-dark">{title}</p>
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
