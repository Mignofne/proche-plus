"use client";

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

/** Aperçu post classique — ours en situation + couleurs texte + format réseau */
export function ClassicPostPreview({
  body,
  title,
  subtitle,
  poseKey,
  poseSrc: _poseSrc,
  bearEnabled = true,
  channel,
  channels,
  channelLabel,
  titleColor,
  subtitleColor,
  sceneKey,
  imageSrc,
  themeSlug,
  format: formatOverride,
}: {
  body: string;
  title?: string | null;
  /** Sous-titre sur l’image (sinon extrait court du body) */
  subtitle?: string | null;
  poseKey?: string | null;
  /** @deprecated */
  poseSrc?: string | null;
  bearEnabled?: boolean;
  channel?: CommunitySocialChannel | string | null;
  channels?: Array<CommunitySocialChannel | string>;
  channelLabel?: string;
  titleColor?: string | null;
  subtitleColor?: string | null;
  sceneKey?: string | null;
  imageSrc?: string | null;
  themeSlug?: string | null;
  format?: CommunityFormatSpec;
}) {
  const primary = resolvePrimaryChannel([
    channel,
    ...(channels ?? []),
  ]);
  const format = formatOverride ?? formatForChannelKind(primary, "classique");
  const label =
    channelLabel ??
    channelLabels(
      (channels?.length
        ? channels
        : [primary]) as CommunitySocialChannel[]
    );
  const overlaySubtitle = subtitle ?? null;

  return (
    <div
      className={`mx-auto w-full animate-fade-up ${
        format.key === "fb-landscape" ? "max-w-md" : "max-w-sm"
      }`}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Aperçu classique — {label} · {format.label}
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-extrabold text-white shadow-sm"
            style={{
              background: `linear-gradient(145deg, ${COMMUNITY_BRAND.teal}, ${COMMUNITY_BRAND.tealDark})`,
            }}
          >
            P+
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold tracking-tight text-text">
              procheplus
            </p>
            <p className="text-[11px] text-text-muted">
              {primary === "facebook"
                ? "Post Facebook · aperçu"
                : "Post · aperçu"}
            </p>
          </div>
          <span className="text-lg leading-none text-text-muted" aria-hidden>
            ···
          </span>
        </div>

        <SituationPostArt
          title={title}
          subtitle={overlaySubtitle}
          titleColor={titleColor}
          subtitleColor={subtitleColor}
          sceneKey={sceneKey}
          imageSrc={imageSrc}
          poseKey={poseKey}
          themeSlug={themeSlug}
          bearEnabled={bearEnabled}
          format={format}
        />

        <div className="space-y-2.5 px-4 py-3.5">
          <div className="flex gap-4 text-text" aria-hidden>
            <HeartIcon />
            <CommentIcon />
            <ShareIcon />
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
          <p className="text-xs text-text-muted">#ProchePlus · aperçu post</p>
        </div>
      </div>
    </div>
  );
}

function HeartIcon() {
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
function CommentIcon() {
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
function ShareIcon() {
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
