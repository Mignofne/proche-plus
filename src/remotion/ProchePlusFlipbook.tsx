import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { RemotionFlipbookProps } from "@/lib/community/video/remotion";
import {
  DEFAULT_FLIPBOOK_HOLD,
  flipbookDurationInFrames,
} from "@/lib/community/video/remotion";
import {
  DEFAULT_SUBTITLE_COLOR,
  DEFAULT_TITLE_COLOR,
} from "@/lib/community/scenes";

const COLORS = {
  peach: "#F8E8DF",
  teal: "#2A9D8F",
  sun: "#F5C842",
  terracotta: "#C67B5C",
};

function toStaticRel(src: string): string {
  return src.startsWith("/") ? src.slice(1) : src;
}

/**
 * Ours animé — flipbook plein cadre (keyframes successives).
 * Contrairement au storyboard Community, l’image occupe tout le plan ;
 * le texte est une bande légère en haut.
 */
export const ProchePlusFlipbook: React.FC<RemotionFlipbookProps> = ({
  frames,
  holdFrames = DEFAULT_FLIPBOOK_HOLD,
  title = "Top chrono 15",
  body = "On bouge un peu, toutes les 15 minutes.",
  accent = "teal",
  titleColor,
  subtitleColor,
  loops = 2,
  endHoldFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isLandscape = width > height;

  const accentColor =
    accent === "sun"
      ? COLORS.sun
      : accent === "terracotta"
        ? COLORS.terracotta
        : COLORS.teal;

  const safe =
    frames.length > 0
      ? frames
      : ["/community-assets/ours-canon/scenes-referentiel/scene-cognitif.png"];

  const cycleLen = safe.length * holdFrames;
  const totalAnim = Math.max(1, cycleLen * Math.max(1, loops));
  // endHoldFrames réservé en fin de composition (durée via calculateMetadata)
  void endHoldFrames;
  const pastAnim = frame >= totalAnim;
  const animIndex = pastAnim
    ? safe.length - 1
    : Math.min(Math.floor((frame % cycleLen) / holdFrames), safe.length - 1);
  const displaySrc = toStaticRel(safe[animIndex]!);

  const titleHex = titleColor || DEFAULT_TITLE_COLOR;
  const bodyHex = subtitleColor || DEFAULT_SUBTITLE_COLOR;

  const bannerOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const padX = isLandscape ? 72 : 40;
  const titleSize = isLandscape ? 42 : 46;
  const bodySize = isLandscape ? 22 : 24;

  return (
    <AbsoluteFill style={{ background: COLORS.peach }}>
      <AbsoluteFill>
        <Img
          src={staticFile(displaySrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </AbsoluteFill>

      {/* Légère voile haut pour lisibilité texte */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: isLandscape ? "28%" : "26%",
          background:
            "linear-gradient(180deg, rgba(250,247,242,0.92) 0%, rgba(250,247,242,0.55) 55%, transparent 100%)",
          opacity: bannerOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          padding: `${isLandscape ? 36 : 56}px ${padX}px 0`,
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center", opacity: bannerOpacity }}>
          <div
            style={{
              color: accentColor,
              fontSize: isLandscape ? 24 : 28,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 10,
              fontFamily: "Nunito, system-ui, sans-serif",
            }}
          >
            Proche+
          </div>
          <h1
            style={{
              margin: 0,
              color: titleHex,
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              fontFamily: "Nunito, system-ui, sans-serif",
            }}
          >
            {title}
          </h1>
          {body ? (
            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "92%",
                color: bodyHex,
                fontSize: bodySize,
                fontWeight: 600,
                lineHeight: 1.35,
                fontFamily: "Nunito, system-ui, sans-serif",
              }}
            >
              {body}
            </p>
          ) : null}
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

export { flipbookDurationInFrames };
