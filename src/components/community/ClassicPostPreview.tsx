"use client";

import { Mascot } from "@/components/mascot/Mascot";
import { toMascotPose } from "@/components/mascot/BearFace";
import { COMMUNITY_BRAND } from "@/lib/community/ui-tokens";

/** Aperçu post classique IG/Threads — ours = mascotte produit */
export function ClassicPostPreview({
  body,
  title,
  poseKey,
  poseSrc: _poseSrc,
  bearEnabled = true,
  channelLabel = "Instagram / Threads",
}: {
  body: string;
  title?: string | null;
  /** Clé Community ou pose Mascot (accueil/welcome, encourage, …) */
  poseKey?: string | null;
  /** @deprecated préférez poseKey — mascotte produit inline */
  poseSrc?: string | null;
  bearEnabled?: boolean;
  channelLabel?: string;
}) {
  const mascotPose = toMascotPose(poseKey);

  return (
    <div className="mx-auto w-full max-w-sm animate-fade-up">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Aperçu classique — {channelLabel}
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
              Publication sponsorisée · aperçu
            </p>
          </div>
          <span className="text-lg leading-none text-text-muted" aria-hidden>
            ···
          </span>
        </div>

        <div
          className="relative flex aspect-square items-center justify-center overflow-hidden animate-soft-pop"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 78% 18%, rgba(42,157,143,0.22), transparent 55%),
              radial-gradient(ellipse 70% 50% at 12% 88%, rgba(245,200,66,0.18), transparent 50%),
              linear-gradient(165deg, ${COMMUNITY_BRAND.cream} 0%, #F3EDE4 42%, ${COMMUNITY_BRAND.creamDark} 100%)
            `,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
            aria-hidden
          />

          {bearEnabled ? (
            <Mascot
              pose={mascotPose}
              size="xl"
              animated
              className="relative z-[1] drop-shadow-[0_12px_24px_rgba(107,68,35,0.18)]"
            />
          ) : (
            <div className="text-sm text-text-muted">Sans ours</div>
          )}

          {title ? (
            <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[#2D2A26]/75 via-[#2D2A26]/25 to-transparent px-4 pb-4 pt-16">
              <p className="text-lg font-extrabold leading-snug tracking-tight text-white drop-shadow-sm">
                {title}
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-2.5 px-4 py-3.5">
          <div className="flex gap-4 text-text" aria-hidden>
            <HeartIcon />
            <CommentIcon />
            <ShareIcon />
          </div>
          {title ? (
            <p className="text-sm font-bold text-teal-dark">{title}</p>
          ) : null}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
            <span className="font-extrabold">procheplus</span> {body}
          </p>
          <p className="text-xs text-text-muted">#ProchePlus · aperçu fondateur</p>
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
